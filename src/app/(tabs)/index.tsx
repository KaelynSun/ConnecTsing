import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Segmented } from '@/components/segmented';
import { TableCard } from '@/features/tables/components/table-card';
import { useTablesStore } from '@/features/tables/store/tables-store';
import type { TableCategory } from '@/features/tables/types/table';

type Filter = 'all' | TableCategory;

const FILTERS: readonly Filter[] = ['all', 'mahjong', 'study'];

export default function TablesScreen() {
  const router = useRouter();
  const tables = useTablesStore((s) => s.tables);
  const [filter, setFilter] = useState<Filter>('all');
  const visible = filter === 'all' ? tables : tables.filter((t) => t.category === filter);

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-4"
      showsVerticalScrollIndicator={false}
      data={visible}
      keyExtractor={(t) => t.id}
      ListHeaderComponent={
        <View className="gap-4 pb-2">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground" numberOfLines={1}>
              Open tables
            </Text>
            <Text className="text-base text-muted">
              Mahjong and study groups around NTHU — claim a seat.
            </Text>
          </View>
          <Segmented
            values={FILTERS}
            labels={['All', 'Mahjong', 'Study']}
            value={filter}
            onChange={setFilter}
          />
        </View>
      }
      renderItem={({ item }) => (
        <TableCard table={item} onPress={() => router.push(`/table/${item.id}`)} />
      )}
      ListEmptyComponent={
        <Card>
          <Text className="text-base text-muted">
            Nothing open here right now — host a table and classmates will find you.
          </Text>
        </Card>
      }
    />
  );
}
