export type EchoType = 'QUESTION' | 'CONFUSION' | 'INSIGHT' | 'REVIEW';

export interface Echo {
  id: string;
  studentUserId: string;
  lessonId: string;
  timestampSeconds: number;
  type: EchoType;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}
