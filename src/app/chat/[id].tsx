import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Input, useThemeColor } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';

import { Pressable, pressHaptic } from '@/components/pressable';
import { useMentorsStore } from '@/features/mentors/store/mentors-store';
import type { ChatMessage } from '@/features/mentors/types/mentor';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useMentorsStore((s) => s.threads.find((t) => t.id === id));
  const mentor = useMentorsStore((s) => s.mentors.find((m) => m.id === thread?.mentorID));
  const sendMessage = useMentorsStore((s) => s.sendMessage);
  const markRead = useMentorsStore((s) => s.markRead);
  const accent = useThemeColor('accent');
  const accentForeground = useThemeColor('accent-foreground');
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const messageCount = thread?.messages.length ?? 0;
  useEffect(() => {
    if (id) markRead(id);
  }, [id, messageCount, markRead]);

  if (!thread) {
    return (
      <View className="flex-1 bg-background px-5 pt-safe-offset-2 gap-6">
        <Pressable onPress={() => router.back()} className="self-start">
          <View className="flex-row items-center gap-1 py-1">
            <Ionicons name="chevron-back" size={18} color={accent} />
            <Text className="text-base font-medium text-accent">Back</Text>
          </View>
        </Pressable>
        <Text className="text-xl font-semibold text-foreground">Conversation not found</Text>
      </View>
    );
  }

  const send = () => {
    pressHaptic();
    if (!draft.trim()) return;
    sendMessage(thread.id, draft);
    setDraft('');
  };

  return (
    <View className="flex-1 bg-background">
      <View className="gap-3 border-b border-border px-5 pt-safe-offset-2 pb-3">
        <Pressable onPress={() => router.back()} className="self-start">
          <View className="flex-row items-center gap-1 py-1">
            <Ionicons name="chevron-back" size={18} color={accent} />
            <Text className="text-base font-medium text-accent">Back</Text>
          </View>
        </Pressable>
        <View className="flex-row items-center gap-3">
          <View className="size-10 items-center justify-center rounded-full bg-accent">
            <Text className="text-base font-bold text-accent-foreground">
              {(mentor?.name ?? 'M').trim().charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-lg font-semibold text-foreground" numberOfLines={1}>
              {mentor?.name ?? 'Mentor'}
            </Text>
            <Text className="text-sm text-muted" numberOfLines={1}>
              {mentor?.dept ?? ''}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={thread.messages}
        keyExtractor={(m) => m.id}
        contentContainerClassName="gap-2 px-5 pt-3 pb-4"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const mine = item.from === 'me';
          return (
            <View
              className={`max-w-3/4 rounded-2xl px-3.5 py-2.5 ${
                mine ? 'self-end bg-accent' : 'self-start bg-surface'
              }`}>
              <Text className={`text-base ${mine ? 'text-accent-foreground' : 'text-foreground'}`}>
                {item.text}
              </Text>
            </View>
          );
        }}
      />

      <KeyboardStickyView>
        <View className="flex-row items-center gap-2 border-t border-border bg-background px-5 pb-safe-offset-2 pt-2">
          <View className="flex-1">
            <Input
              placeholder="Message…"
              value={draft}
              onChangeText={setDraft}
              returnKeyType="send"
              onSubmitEditing={send}
            />
          </View>
          <Button isIconOnly onPress={send} isDisabled={!draft.trim()} accessibilityLabel="Send">
            <Ionicons name="send" size={18} color={accentForeground} />
          </Button>
        </View>
      </KeyboardStickyView>
    </View>
  );
}
