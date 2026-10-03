import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Segmented } from '@/components/segmented';
import { MentorCard } from '@/features/mentors/components/mentor-card';
import { useMentorsStore } from '@/features/mentors/store/mentors-store';
import type { MentorArea } from '@/features/mentors/types/mentor';

type Filter = 'all' | MentorArea;

const FILTERS: readonly Filter[] = ['all', 'coursework', 'research', 'career', 'life'];

export default function MentorsScreen() {
  const router = useRouter();
  const mentors = useMentorsStore((s) => s.mentors);
  const [filter, setFilter] = useState<Filter>('all');
  const visible = filter === 'all' ? mentors : mentors.filter((m) => m.areas.includes(filter));

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-4"
      showsVerticalScrollIndicator={false}
      data={visible}
      keyExtractor={(m) => m.id}
      ListHeaderComponent={
        <View className="gap-4 pb-2">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground" numberOfLines={1}>
              Mentors
            </Text>
            <Text className="text-base text-muted">
              Seniors and grad students offering a hand — find your fit, then say hi.
            </Text>
          </View>
          <Segmented
            values={FILTERS}
            labels={['All', 'Coursework', 'Research', 'Career', 'Life']}
            value={filter}
            onChange={setFilter}
          />
          <Card list>
            <ListRow
              title="Offer mentorship"
              subtitle="Share what you know with juniors"
              onPress={() => router.push('/mentor/new')}
            />
          </Card>
        </View>
      }
      renderItem={({ item }) => (
        <MentorCard mentor={item} onPress={() => router.push(`/mentor/${item.id}`)} />
      )}
      ListEmptyComponent={
        <Card>
          <Text className="text-base text-muted">
            No mentors in this area yet — check back soon, or offer mentorship yourself.
          </Text>
        </Card>
      }
    />
  );
}
