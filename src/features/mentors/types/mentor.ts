export const MENTOR_AREAS = ['coursework', 'research', 'career', 'life'] as const;

export type MentorArea = (typeof MENTOR_AREAS)[number];

export const AREA_LABELS: Record<MentorArea, string> = {
  coursework: 'Coursework',
  research: 'Research',
  career: 'Career',
  life: 'Campus life',
};

export interface Mentor {
  id: string;
  name: string;
  dept: string;
  areas: MentorArea[];
  bio: string;
  credentials: string[];
  /** True when this is the current user's own listing. */
  isMine: boolean;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'mentor';
  text: string;
  at: number;
}

export interface ChatThread {
  id: string;
  mentorID: string;
  messages: ChatMessage[];
  unread: boolean;
}
