import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Section } from '@/components/section';
import { ME_ID, useTablesStore } from '@/features/tables/store/tables-store';

export default function MineScreen() {
  const router = useRouter();
  const profile = useTablesStore((s) => s.profile);
  const tables = useTablesStore((s) => s.tables);
  const hosting = tables.filter((t) => t.isMine);
  const joined = tables.filter((t) => !t.isMine && t.members.some((m) => m.id === ME_ID));
  const initial = profile.name.trim().charAt(0).toUpperCase() || 'M';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6"
      showsVerticalScrollIndicator={false}>
      <Text className="text-3xl font-bold text-foreground" numberOfLines={1}>
        My tables
      </Text>

      <Section title="You">
        <Card>
          <View className="flex-row items-center gap-3">
            <View className="size-11 items-center justify-center rounded-full bg-accent">
              <Text className="text-lg font-bold text-accent-foreground">{initial}</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-lg font-semibold text-foreground" numberOfLines={1}>
                {profile.name}
              </Text>
              <Text className="text-sm text-muted" numberOfLines={1}>
                {profile.dept || 'NTHU'}
                {profile.lineId ? ` · LINE: ${profile.lineId}` : ''}
              </Text>
            </View>
          </View>
        </Card>
        <Card list>
          <ListRow
            title="Edit profile"
            subtitle="Name, department, LINE ID"
            onPress={() => router.push('/profile')}
          />
        </Card>
      </Section>

      <Section title="Hosting">
        {hosting.length === 0 ? (
          <Card>
            <Text className="text-base text-muted">
              You are not hosting any tables. Post one from the Host tab.
            </Text>
          </Card>
        ) : (
          <Card list>
            {hosting.map((t) => (
              <ListRow
                key={t.id}
                title={t.title}
                subtitle={`${t.members.length}/${t.seatsTotal} seats · ${t.timeText}`}
                onPress={() => router.push(`/table/${t.id}`)}
              />
            ))}
          </Card>
        )}
      </Section>

      <Section title="Joined">
        {joined.length === 0 ? (
          <Card>
            <Text className="text-base text-muted">
              Nothing yet — claim a seat from the feed and it shows up here.
            </Text>
          </Card>
        ) : (
          <Card list>
            {joined.map((t) => (
              <ListRow
                key={t.id}
                title={t.title}
                subtitle={`${t.location} · ${t.timeText}`}
                onPress={() => router.push(`/table/${t.id}`)}
              />
            ))}
          </Card>
        )}
      </Section>
    </ScrollView>
  );
}
