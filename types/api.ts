import type {
  Class,
  Echo,
  Lesson,
  PlaybackAuthorization,
  UploadAuthorization,
  User,
} from './domain';

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface MeResponse {
  user: User;
}

export interface ClassResponse {
  class: Class;
}

export interface ClassListResponse {
  classes: Class[];
}

export interface LessonResponse {
  lesson: Lesson;
}

export interface LessonListResponse {
  lessons: Lesson[];
}

export interface EchoResponse {
  echo: Echo;
}

export interface EchoListResponse {
  echoes: Echo[];
}

export interface UploadAuthorizationResponse {
  authorization: UploadAuthorization;
}

export interface PlaybackAuthorizationResponse {
  authorization: PlaybackAuthorization;
}
