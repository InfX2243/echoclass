import { verifyBearerToken } from './auth.mjs';
import { getOrCreateUser } from './user-repository.mjs';
import { createClass, getClassForStudent, getClassForTeacher, listClassesForStudent, listClassesOwnedByTeacher, updateClass } from './class-repository.mjs';
import { createInvite, joinWithInvite, listMembers, removeMembership, teacherOwnsClass } from './membership-repository.mjs';

const json = (statusCode, body) => ({ statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const error = (statusCode, code, message) => Object.assign(new Error(message), { statusCode, code });
const parseBody = (event) => { if (!event.body) return {}; try { return typeof event.body === 'string' ? JSON.parse(event.body) : event.body; } catch { throw error(400, 'INVALID_JSON', 'Request body must be valid JSON'); } };
const requireText = (value, field, { min = 1, max = 200 } = {}) => { if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) throw error(400, 'VALIDATION_ERROR', `${field} must be between ${min} and ${max} characters`); return value.trim(); };
const routeClassId = (path) => /^\/classes\/([^/]+)$/.exec(path)?.[1] ?? null;
const memberRoute = (path) => /^\/classes\/([^/]+)\/members(?:\/([^/]+))?$/.exec(path);
const inviteRoute = (path) => /^\/classes\/([^/]+)\/invite$/.exec(path)?.[1] ?? null;

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? event.httpMethod ?? 'GET';
  const path = event.rawPath ?? event.path ?? '/';
  if (method === 'GET' && path === '/health') return json(200, { status: 'ok' });
  try {
    const principal = await verifyBearerToken(event.headers?.authorization ?? event.headers?.Authorization);
    const user = await getOrCreateUser(principal);
    if (method === 'GET' && path === '/me') return json(200, { user: { id: user.userId, username: user.username, email: user.email ?? null, role: user.role ?? null, createdAt: user.createdAt } });

    if (method === 'POST' && path === '/classes') { if (user.role !== 'TEACHER') throw error(403, 'FORBIDDEN', 'Only teachers can create classes'); const body = parseBody(event); const name = requireText(body.name, 'name', { max: 120 }); const description = body.description === undefined ? undefined : requireText(body.description, 'description', { min: 0, max: 1000 }); return json(201, { class: await createClass({ teacherId: user.userId, name, description }) }); }
    if (method === 'GET' && path === '/classes') { if (user.role === 'TEACHER') return json(200, { classes: await listClassesOwnedByTeacher(user.userId) }); if (user.role === 'STUDENT') return json(200, { classes: await listClassesForStudent(user.userId) }); throw error(403, 'FORBIDDEN', 'Application role is not configured'); }

    if (method === 'POST' && path === '/invites/join') { if (user.role !== 'STUDENT') throw error(403, 'FORBIDDEN', 'Only students can join classes'); const code = requireText(parseBody(event).code, 'code', { min: 4, max: 64 }).toUpperCase(); const result = await joinWithInvite({ code, studentId: user.userId }); if (result.kind === 'NOT_FOUND') throw error(404, 'NOT_FOUND', 'Invite code not found'); if (result.kind === 'CONFLICT') throw error(409, 'MEMBERSHIP_EXISTS', 'You are already an active member of this class'); return json(201, { membership: result.membership }); }

    const inviteClassId = inviteRoute(path);
    if (inviteClassId && method === 'POST') { if (user.role !== 'TEACHER' || !(await teacherOwnsClass({ classId: inviteClassId, teacherId: user.userId }))) throw error(404, 'NOT_FOUND', 'Class not found'); return json(201, { invite: await createInvite({ classId: inviteClassId, teacherId: user.userId }) }); }

    const memberMatch = memberRoute(path);
    if (memberMatch) { const [, memberClassId, studentId] = memberMatch; if (user.role !== 'TEACHER' || !(await teacherOwnsClass({ classId: memberClassId, teacherId: user.userId }))) throw error(404, 'NOT_FOUND', 'Class not found'); if (method === 'GET' && !studentId) return json(200, { members: await listMembers({ classId: memberClassId }) }); if (method === 'DELETE' && studentId) { const membership = await removeMembership({ classId: memberClassId, studentId }); if (!membership) throw error(404, 'NOT_FOUND', 'Active membership not found'); return json(200, { membership }); } }

    const classId = routeClassId(path);
    if (classId && method === 'GET') { const found = user.role === 'TEACHER' ? await getClassForTeacher(classId, user.userId) : user.role === 'STUDENT' ? await getClassForStudent(classId, user.userId) : null; if (!found) throw error(404, 'NOT_FOUND', 'Class not found'); return json(200, { class: found }); }
    if (classId && method === 'PATCH') { if (user.role !== 'TEACHER') throw error(403, 'FORBIDDEN', 'Only teachers can update classes'); const body = parseBody(event); if (body.name === undefined && body.description === undefined) throw error(400, 'VALIDATION_ERROR', 'At least one field must be provided'); const name = body.name === undefined ? undefined : requireText(body.name, 'name', { max: 120 }); const description = body.description === undefined ? undefined : requireText(body.description, 'description', { min: 0, max: 1000 }); const updated = await updateClass({ classId, teacherId: user.userId, name, description }); if (!updated) throw error(404, 'NOT_FOUND', 'Class not found'); return json(200, { class: updated }); }
    return json(404, { error: { code: 'NOT_FOUND', message: 'Route not found' } });
  } catch (caught) { if (caught?.statusCode && caught.statusCode < 500) return json(caught.statusCode, { error: { code: caught.code ?? 'BAD_REQUEST', message: caught.message } }); console.error('API request failure', caught); return json(500, { error: { code: 'INTERNAL_ERROR', message: 'Unable to process request' } }); }
};
