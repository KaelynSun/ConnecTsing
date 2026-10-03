import type { ChatThread, Mentor } from '../types/mentor';

/** Realistic senior and grad-student mentors around NTHU, seeded on first launch. */
export const seedMentors: Mentor[] = [
  {
    id: 'seed-mentor-chiawen',
    name: 'Chia-Wen L.',
    dept: 'CS · Senior',
    areas: ['coursework', 'research'],
    bio: 'CS senior, TA’d Data Structures twice. Happy to help you survive the CS core and figure out whether research is for you.',
    credentials: [
      "Dean's list, three semesters",
      'TA for Data Structures, two semesters',
      'Incoming MS student, NTU CSIE',
      'ML reading group lead',
    ],
    isMine: false,
    createdAt: 6,
  },
  {
    id: 'seed-mentor-poyu',
    name: 'Po-Yu H.',
    dept: 'EE · Grad student',
    areas: ['research', 'career'],
    bio: 'Second-year master’s in EE, power IC design. Ask me about joining a lab, reading papers, and TSMC internships.',
    credentials: [
      'IEEE ISCAS paper, co-author',
      'TSMC summer intern, 2025',
      'NTHU EE scholarship',
    ],
    isMine: false,
    createdAt: 5,
  },
  {
    id: 'seed-mentor-minjie',
    name: 'Min-Jie C.',
    dept: 'Econ · Senior',
    areas: ['career', 'coursework'],
    bio: 'Econ senior headed into consulting. I can review your resume and run mock case interviews until they stop being scary.',
    credentials: [
      'Incoming analyst, global consulting firm',
      'Case competition finalist, 2025',
      'Statistics TA',
    ],
    isMine: false,
    createdAt: 4,
  },
  {
    id: 'seed-mentor-yuhsuan',
    name: 'Yu-Hsuan T.',
    dept: 'Foreign Languages · Junior',
    areas: ['life'],
    bio: 'FL junior, spent a year on exchange in Japan. Dorm drama, club life, exchange applications — ask me anything.',
    credentials: [
      'Exchange year, Waseda University',
      'TOEFL 115',
      'International student buddy program, two years',
    ],
    isMine: false,
    createdAt: 3,
  },
  {
    id: 'seed-mentor-shaoyun',
    name: 'Shao-Yun W.',
    dept: 'Physics · Grad student',
    areas: ['research', 'coursework'],
    bio: 'PhD student in quantum optics. I like helping undergrads find their first lab and pass quantum mechanics with their sanity intact.',
    credentials: [
      'Quantum optics lab, three years',
      'Two journal publications',
      'Undergrad research mentor since 2024',
    ],
    isMine: false,
    createdAt: 2,
  },
  {
    id: 'seed-mentor-hsiaoching',
    name: 'Hsiao-Ching L.',
    dept: 'Math · Senior',
    areas: ['coursework', 'career'],
    bio: 'Math senior. Calculus and Linear Algebra are my love language; also happy to talk quant recruiting.',
    credentials: [
      'Calculus & Linear Algebra TA',
      'Quant trading offer, Hsinchu fintech',
      'Problem-solving club founder',
    ],
    isMine: false,
    createdAt: 1,
  },
];

const HOUR = 3_600_000;

/** One sample conversation so the Messages tab has life on first launch. */
export const seedThreads: ChatThread[] = [
  {
    id: 'seed-thread-chiawen',
    mentorID: 'seed-mentor-chiawen',
    unread: false,
    messages: [
      {
        id: 'seed-msg-1',
        from: 'me',
        text: "Hi Chia-Wen! I'm a sophomore thinking about grad school for ML. Could I ask a few questions?",
        at: Date.now() - 26 * HOUR,
      },
      {
        id: 'seed-msg-2',
        from: 'mentor',
        text: 'Of course! Ask away — happy to share how I prepped for applications.',
        at: Date.now() - 26 * HOUR + 5 * 60_000,
      },
    ],
  },
];
