export type TableCategory = 'mahjong' | 'study';

export interface TableMember {
  id: string;
  name: string;
}

export interface GameTable {
  id: string;
  title: string;
  category: TableCategory;
  description: string;
  location: string;
  timeText: string;
  seatsTotal: number;
  members: TableMember[];
  hostName: string;
  hostDept: string;
  contactLine: string;
  /** True when the current user hosts this table. */
  isMine: boolean;
  createdAt: number;
}

export interface Profile {
  name: string;
  dept: string;
  lineId: string;
}
