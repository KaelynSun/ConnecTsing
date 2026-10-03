import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/lib/storage';

import type { ChatMessage, ChatThread, Mentor, MentorArea } from '../types/mentor';
import { seedMentors, seedThreads } from '../utils/seed-mentors';

export interface NewMentorInput {
  name: string;
  dept: string;
  areas: MentorArea[];
  bio: string;
  credentials: string[];
}

interface MentorsState {
  mentors: Mentor[];
  threads: ChatThread[];
  /** Publishes a mentor listing for the current user; returns its id. */
  addMentor: (input: NewMentorInput) => string;
  removeMentor: (mentorID: string) => void;
  /** Finds the 1:1 thread with a mentor, creating it on first message. */
  getOrCreateThread: (mentorID: string) => string;
  sendMessage: (threadID: string, text: string) => void;
  markRead: (threadID: string) => void;
}

/** Canned mentor replies so a local chat feels alive; rotated deterministically. */
const MENTOR_REPLIES = [
  'Hey, thanks for reaching out! What are you working on right now?',
  'Good to hear from you. Tell me a bit about your situation and I will point you the right way.',
  'Sure, happy to help. Want to start here or grab coffee at the Snack Court sometime?',
  'That was me two years ago — very doable. Send over the details and I will take a look.',
  'Nice timing, I am free most evenings after 7. What would you like to go over first?',
];

let nextId = 1;
function messageID(): string {
  return `m-${Date.now().toString(36)}-${nextId++}`;
}

export const useMentorsStore = create<MentorsState>()(
  persist(
    (set, get) => ({
      mentors: seedMentors,
      threads: seedThreads,
      addMentor: (input) => {
        const id = `mentor-${Date.now().toString(36)}-${Math.round(Math.random() * 1e6).toString(36)}`;
        const mentor: Mentor = {
          id,
          name: input.name.trim(),
          dept: input.dept.trim(),
          areas: input.areas,
          bio: input.bio.trim(),
          credentials: input.credentials,
          isMine: true,
          createdAt: Date.now(),
        };
        set((state) => ({ mentors: [mentor, ...state.mentors] }));
        return id;
      },
      removeMentor: (mentorID) =>
        set((state) => ({ mentors: state.mentors.filter((m) => m.id !== mentorID) })),
      getOrCreateThread: (mentorID) => {
        const existing = get().threads.find((t) => t.mentorID === mentorID);
        if (existing) return existing.id;
        const id = `thread-${Date.now().toString(36)}-${Math.round(Math.random() * 1e6).toString(36)}`;
        set((state) => ({
          threads: [{ id, mentorID, messages: [], unread: false }, ...state.threads],
        }));
        return id;
      },
      sendMessage: (threadID, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const mine: ChatMessage = { id: messageID(), from: 'me', text: trimmed, at: Date.now() };
        set((state) => ({
          threads: state.threads.map((t) =>
            t.id === threadID ? { ...t, messages: [...t.messages, mine] } : t,
          ),
        }));
        // Local-first demo: the mentor answers from a small canned rotation, as if online.
        setTimeout(() => {
          set((state) => ({
            threads: state.threads.map((t) => {
              if (t.id !== threadID) return t;
              const index = (t.messages.length + t.mentorID.length) % MENTOR_REPLIES.length;
              const reply: ChatMessage = {
                id: messageID(),
                from: 'mentor',
                text: MENTOR_REPLIES[index] ?? 'Happy to help!',
                at: Date.now(),
              };
              return { ...t, unread: true, messages: [...t.messages, reply] };
            }),
          }));
        }, 900);
      },
      markRead: (threadID) =>
        set((state) => ({
          threads: state.threads.map((t) => (t.id === threadID ? { ...t, unread: false } : t)),
        })),
    }),
    {
      name: 'fourth-seat-mentors',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
