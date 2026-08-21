import { createBrowserRouter } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { ClassesPage } from './pages/ClassesPage';
import { ClassDetailPage } from './pages/ClassDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { EchoesPage } from './pages/EchoesPage';
import { LandingPage } from './pages/LandingPage';
import { LessonPage } from './pages/LessonPage';
import { RevisitsPage } from './pages/RevisitsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TeacherClassPage } from './pages/TeacherClassPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { TeacherLessonsPage } from './pages/TeacherLessonsPage';
import { PlaceholderPage } from './PlaceholderPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <AuthPage mode="login" /> },
  { path: '/register', element: <AuthPage mode="register" /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/teacher/dashboard', element: <TeacherDashboardPage /> },
  { path: '/teacher/classes/:classId', element: <TeacherClassPage /> },
  { path: '/teacher/classes/:classId/lessons', element: <TeacherLessonsPage /> },
  { path: '/classes', element: <ClassesPage /> },
  { path: '/classes/:classId', element: <ClassDetailPage /> },
  { path: '/lessons/:lessonId', element: <LessonPage /> },
  { path: '/echoes', element: <EchoesPage /> },
  { path: '/revisits', element: <RevisitsPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/profile', element: <PlaceholderPage title="Profile" /> },
  { path: '*', element: <PlaceholderPage title="Page Not Found" /> },
]);
