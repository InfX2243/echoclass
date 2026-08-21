import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { ClassesPage } from './pages/ClassesPage';
import { ClassDetailPage } from './pages/ClassDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { EchoesPage } from './pages/EchoesPage';
import { LessonPage } from './pages/LessonPage';
import { RevisitsPage } from './pages/RevisitsPage';
import { TeacherClassPage } from './pages/TeacherClassPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';

function PlaceholderPage({ title }: { title: string }) {
  return <div className="grid min-h-screen place-items-center bg-background p-8 text-center"><div><p className="text-sm text-muted-foreground">EchoClass</p><h1 className="mt-2 text-3xl font-semibold">{title}</h1><p className="mt-2 text-muted-foreground">This page is part of the next feature slice.</p></div></div>;
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <AuthPage mode="login" /> },
  { path: '/register', element: <AuthPage mode="register" /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/teacher/dashboard', element: <TeacherDashboardPage /> },
  { path: '/teacher/classes/:classId', element: <TeacherClassPage /> },
  { path: '/classes', element: <ClassesPage /> },
  { path: '/classes/:classId', element: <ClassDetailPage /> },
  { path: '/lessons/:lessonId', element: <LessonPage /> },
  { path: '/echoes', element: <EchoesPage /> },
  { path: '/revisits', element: <RevisitsPage /> },
  { path: '/profile', element: <PlaceholderPage title="Profile" /> },
  { path: '*', element: <PlaceholderPage title="Page Not Found" /> },
]);
