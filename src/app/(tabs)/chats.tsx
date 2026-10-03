import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Section } from '@/components/section';
import { useMentorsStore } from '@/features/mentors/store/mentors-store';
import { formatChatTime } from '@/features/mentors/utils/format';

export default function ChatsScreen() {
  const router = useRouter();
  const mentors = useMentorsStore((s) => s.mentors);
  const threads = useMentorsStore((s) => s.threads);
  const markRead = useMentorsStore((s) => s.markRead);

  const sorted = [...threads]
    .filter((t) => t.messages.length > 0)
    .sort((a, b) => {
      const lastA = a.messages[a.messages.length - 1]?.at ?? 0;
      const lastB = b.messages[b.messages.length - 1]?.at ?? 0;
      return lastB - lastA;
    });

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6"
      showsVerticalScrollIndicator={false}>
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground" numberOfLines={1}>
          Messages
        </Text>
        <Text className="text-base text-muted">Your conversations with mentors.</Text>
      </View>

      <Section title="Conversations">
        {sorted.length === 0 ? (
          <Card>
            <Text className="text-base text-muted">
              No conversations yet — open a mentor profile and tap Message.
            </Text>
          </Card>
        ) : (
          <Card list>
            {sorted.map((thread) => {
              const mentor = mentors.find((m) => m.id === thread.mentorID);
              const last = thread.messages[thread.messages.length - 1];
              if (!last) return null;
              return (
                <ListRow
                  key={thread.id}
                  title={mentor?.name ?? 'Mentor'}
                  subtitle={`${last.from === 'me' ? 'You: ' : ''}${last.text}`}
                  right={
                    <View className="items-end gap-1">
                      <Text className="text-xs text-muted">{formatChatTime(last.at)}</Text>
                      {thread.unread ? <View className="size-2 rounded-full bg-accent" /> : null}
                    </View>
                  }
                  onPress={() => {
                    markRead(thread.id);
                    router.push(`/chat/${thread.id}`);
                  }}
                />
              );
            })}
          </Card>
        )}
      </Section>
    </ScrollView>
  );
}
