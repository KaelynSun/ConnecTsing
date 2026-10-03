import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/lib/storage';

import type { GameTable, Profile, TableCategory } from '../types/table';
import { seedTables } from '../utils/seed-tables';

/** Local id for the current user inside member lists. */
export const ME_ID = 'me';

export interface NewTableInput {
  title: string;
  category: TableCategory;
  description: string;
  location: string;
  timeText: string;
  seatsTotal: number;
}

interface TablesState {
  profile: Profile;
  tables: GameTable[];
  setProfile: (profile: Profile) => void;
  /** Creates a table hosted by the current user; returns its id. */
  addTable: (input: NewTableInput) => string;
  claimSeat: (tableID: string) => void;
  leaveSeat: (tableID: string) => void;
  closeTable: (tableID: string) => void;
}

export const useTablesStore = create<TablesState>()(
  persist(
    (set, get) => ({
      profile: { name: 'Me', dept: '', lineId: '' },
      tables: seedTables,
      setProfile: (profile) => set({ profile }),
      addTable: (input) => {
        const id = `t-${Date.now().toString(36)}-${Math.round(Math.random() * 1e6).toString(36)}`;
        const { profile } = get();
        const table: GameTable = {
          id,
          title: input.title.trim(),
          category: input.category,
          description: input.description.trim(),
          location: input.location.trim(),
          timeText: input.timeText.trim(),
          seatsTotal: input.seatsTotal,
          members: [{ id: ME_ID, name: profile.name }],
          hostName: profile.name,
          hostDept: profile.dept,
          contactLine: profile.lineId,
          isMine: true,
          createdAt: Date.now(),
        };
        set((state) => ({ tables: [table, ...state.tables] }));
        return id;
      },
      claimSeat: (tableID) =>
        set((state) => ({
          tables: state.tables.map((table) => {
            if (table.id !== tableID) return table;
            if (table.members.some((m) => m.id === ME_ID)) return table;
            if (table.members.length >= table.seatsTotal) return table;
            return { ...table, members: [...table.members, { id: ME_ID, name: state.profile.name }] };
          }),
        })),
      leaveSeat: (tableID) =>
        set((state) => ({
          tables: state.tables.map((table) =>
            table.id === tableID
              ? { ...table, members: table.members.filter((m) => m.id !== ME_ID) }
              : table,
          ),
        })),
      closeTable: (tableID) =>
        set((state) => ({ tables: state.tables.filter((table) => table.id !== tableID) })),
    }),
    {
      name: 'fourth-seat',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
