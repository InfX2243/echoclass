export type UserRole = 'STUDENT' | 'TEACHER';

export interface User {
  id: string;
  cognitoSub: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  ownerUserId: string;
  name: string;
  description?: string;
  inviteCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  classId: string;
  userId: string;
  status: 'ACTIVE' | 'REMOVED';
  createdAt: string;
  updatedAt: string;
}

export type LessonStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Lesson {
  id: string;
  classId: string;
  title: string;
  description?: string;
  status: LessonStatus;
  media?: LessonMedia;
  createdAt: string;
  updatedAt: string;
}

export interface LessonMedia {
  status: 'PENDING' | 'UPLOADING' | 'READY' | 'FAILED';
  objectKey: string;
  contentType: string;
  sizeBytes: number;
  durationSeconds?: number;
  uploadedAt?: string;
}

export type EchoType = 'QUESTION' | 'CONFUSION' | 'INSIGHT' | 'REVIEW';

export interface Echo {
  id: string;
  studentUserId: string;
  lessonId: string;
  timestampSeconds: number;
  type: EchoType;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Revisit {
  id: string;
  studentUserId: string;
  lessonId: string;
  echoId: string;
  timestampSeconds: number;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface UploadAuthorization {
  uploadUrl: string;
  objectKey: string;
  expiresAt: string;
  requiredHeaders?: Record<string, string>;
}

export interface PlaybackAuthorization {
  playbackUrl: string;
  expiresAt: string;
}
