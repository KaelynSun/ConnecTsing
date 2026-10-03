import { Chip } from 'heroui-native';
import { Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Pressable } from '@/components/pressable';

import { ME_ID } from '../store/tables-store';
import type { GameTable } from '../types/table';

type TableCardProps = {
  table: GameTable;
  onPress: () => void;
};

/** One open table in the feed: category chip, seat dots, host, where and when. */
export function TableCard({ table, onPress }: TableCardProps) {
  const seatsLeft = table.seatsTotal - table.members.length;
  const isFull = seatsLeft <= 0;
  const joined = table.members.some((m) => m.id === ME_ID);
  const hostLine = table.isMine
    ? `${table.hostName} (you)`
    : table.hostDept
      ? `${table.hostName} · ${table.hostDept}`
      : table.hostName;

  return (
    <Pressable onPress={onPress}>
      <Card>
        <View className="flex-row items-center gap-2">
          <Chip size="sm" variant="soft" color={table.category === 'mahjong' ? 'accent' : 'default'}>
            <Chip.Label>{table.category === 'mahjong' ? 'Mahjong' : 'Study group'}</Chip.Label>
          </Chip>
          {joined ? (
            <Chip size="sm" variant="soft" color="success">
              <Chip.Label>Joined</Chip.Label>
            </Chip>
          ) : null}
          {isFull ? (
            <Chip size="sm" variant="soft" color="danger">
              <Chip.Label>Full</Chip.Label>
            </Chip>
          ) : null}
          <Text className="ml-auto text-sm font-medium text-muted">
            {table.members.length}/{table.seatsTotal} seats
          </Text>
        </View>
        <Text className="text-lg font-semibold text-foreground" numberOfLines={2}>
          {table.title}
        </Text>
        <Text className="text-sm text-muted" numberOfLines={1}>
          {hostLine}
        </Text>
        <View className="flex-row items-center justify-between gap-3">
          <Text className="flex-1 text-sm text-muted" numberOfLines={1}>
            {table.location} · {table.timeText}
          </Text>
          <View className="flex-row gap-1.5">
            {Array.from({ length: table.seatsTotal }, (_, i) => (
              <View
                key={i}
                className={`size-2 rounded-full ${i < table.members.length ? 'bg-accent' : 'bg-border'}`}
              />
            ))}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
