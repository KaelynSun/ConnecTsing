import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Chip, useThemeColor } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { Presets } from 'react-native-pulsar';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Pressable, pressHaptic } from '@/components/pressable';
import { Section } from '@/components/section';
import { ME_ID, useTablesStore } from '@/features/tables/store/tables-store';
import { confirmDelete } from '@/lib/confirm';

export default function TableDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const table = useTablesStore((s) => s.tables.find((t) => t.id === id));
  const claimSeat = useTablesStore((s) => s.claimSeat);
  const leaveSeat = useTablesStore((s) => s.leaveSeat);
  const closeTable = useTablesStore((s) => s.closeTable);
  const accent = useThemeColor('accent');

  const backRow = (
    <Pressable onPress={() => router.back()} className="self-start">
      <View className="flex-row items-center gap-1 py-1">
        <Ionicons name="chevron-back" size={18} color={accent} />
        <Text className="text-base font-medium text-accent">Back</Text>
      </View>
    </Pressable>
  );

  if (!table) {
    return (
      <View className="flex-1 bg-background px-5 pt-safe-offset-2 gap-6">
        {backRow}
        <Text className="text-xl font-semibold text-foreground">This table is gone</Text>
        <Text className="text-base text-muted">
          The host closed it or it already started. Check the feed for other open tables.
        </Text>
      </View>
    );
  }

  const seatsLeft = table.seatsTotal - table.members.length;
  const isFull = seatsLeft <= 0;
  const joined = table.members.some((m) => m.id === ME_ID);

  const claim = () => {
    pressHaptic();
    claimSeat(table.id);
    Presets.System.notificationSuccess();
  };
  const leave = () =>
    confirmDelete({
      title: 'Leave this table?',
      message: 'Your seat opens back up for someone else.',
      confirmLabel: 'Leave',
      onConfirm: () => leaveSeat(table.id),
    });
  const close = () =>
    confirmDelete({
      title: 'Close this table?',
      message: 'It disappears from the feed for everyone.',
      confirmLabel: 'Close',
      onConfirm: () => {
        closeTable(table.id);
        router.back();
      },
    });

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6"
      showsVerticalScrollIndicator={false}>
      {backRow}

      <View className="gap-3">
        <View className="flex-row items-center gap-2">
          <Chip size="sm" variant="soft" color={table.category === 'mahjong' ? 'accent' : 'default'}>
            <Chip.Label>{table.category === 'mahjong' ? 'Mahjong' : 'Study group'}</Chip.Label>
          </Chip>
          {isFull ? (
            <Chip size="sm" variant="soft" color="danger">
              <Chip.Label>Full</Chip.Label>
            </Chip>
          ) : (
            <Chip size="sm" variant="soft" color="success">
              <Chip.Label>
                {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
              </Chip.Label>
            </Chip>
          )}
        </View>
        <Text className="text-3xl font-bold text-foreground">{table.title}</Text>
      </View>

      {table.description ? (
        <Card>
          <Text className="text-base leading-6 text-foreground">{table.description}</Text>
        </Card>
      ) : null}

      <Section title="Where & when">
        <Card list>
          <ListRow title="Where" subtitle={table.location} />
          <ListRow title="When" subtitle={table.timeText} />
          {table.contactLine ? (
            <ListRow
              title="Host on LINE"
              subtitle={`${table.contactLine} — tap to copy`}
              onPress={() => {
                void Clipboard.setStringAsync(table.contactLine);
              }}
            />
          ) : null}
        </Card>
      </Section>

      <Section title={`At the table (${table.members.length}/${table.seatsTotal})`}>
        <Card list>
          {table.members.map((m, i) => (
            <ListRow
              key={m.id}
              title={m.id === ME_ID ? `${m.name} (you)` : m.name}
              subtitle={i === 0 ? `Host${table.hostDept ? ` · ${table.hostDept}` : ''}` : undefined}
              left={
                <View className="size-8 items-center justify-center rounded-full bg-accent">
                  <Text className="text-sm font-semibold text-accent-foreground">
                    {m.name.trim().charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
              }
            />
          ))}
          {Array.from({ length: Math.max(0, seatsLeft) }, (_, i) => (
            <ListRow
              key={`open-${i}`}
              title="Open seat"
              subtitle="Yours, if you claim it"
              left={
                <View className="size-8 items-center justify-center rounded-full border border-dashed border-border">
                  <Ionicons name="add" size={16} color={accent} />
                </View>
              }
            />
          ))}
        </Card>
      </Section>

      {table.isMine ? (
        <Button size="lg" variant="danger-soft" onPress={close}>
          <Button.Label>Close table</Button.Label>
        </Button>
      ) : joined ? (
        <Button size="lg" variant="secondary" onPress={leave}>
          <Button.Label>Leave table</Button.Label>
        </Button>
      ) : (
        <Button size="lg" onPress={claim} isDisabled={isFull}>
          <Button.Label>{isFull ? 'Table is full' : 'Claim seat'}</Button.Label>
        </Button>
      )}
    </ScrollView>
  );
}
