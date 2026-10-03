import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Chip, useThemeColor } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Pressable, pressHaptic } from '@/components/pressable';
import { Section } from '@/components/section';
import { useMentorsStore } from '@/features/mentors/store/mentors-store';
import { AREA_LABELS } from '@/features/mentors/types/mentor';
import { confirmDelete } from '@/lib/confirm';

export default function MentorDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const mentor = useMentorsStore((s) => s.mentors.find((m) => m.id === id));
  const getOrCreateThread = useMentorsStore((s) => s.getOrCreateThread);
  const removeMentor = useMentorsStore((s) => s.removeMentor);
  const accent = useThemeColor('accent');

  const backRow = (
    <Pressable onPress={() => router.back()} className="self-start">
      <View className="flex-row items-center gap-1 py-1">
        <Ionicons name="chevron-back" size={18} color={accent} />
        <Text className="text-base font-medium text-accent">Back</Text>
      </View>
    </Pressable>
  );

  if (!mentor) {
    return (
      <View className="flex-1 bg-background px-5 pt-safe-offset-2 gap-6">
        {backRow}
        <Text className="text-xl font-semibold text-foreground">This listing is gone</Text>
        <Text className="text-base text-muted">
          The mentor took it down. Browse the directory for someone else who fits.
        </Text>
      </View>
    );
  }

  const message = () => {
    pressHaptic();
    const threadID = getOrCreateThread(mentor.id);
    router.push(`/chat/${threadID}`);
  };
  const remove = () =>
    confirmDelete({
      title: 'Remove your listing?',
      message: 'Juniors will no longer find you in the directory.',
      confirmLabel: 'Remove',
      onConfirm: () => {
        removeMentor(mentor.id);
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
        <View className="flex-row items-center gap-3">
          <View className="size-14 items-center justify-center rounded-full bg-accent">
            <Text className="text-2xl font-bold text-accent-foreground">
              {mentor.name.trim().charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-2xl font-bold text-foreground" numberOfLines={1}>
              {mentor.name}
            </Text>
            <Text className="text-base text-muted" numberOfLines={1}>
              {mentor.dept}
            </Text>
          </View>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {mentor.areas.map((area) => (
            <Chip key={area} size="sm" variant="soft" color="default">
              <Chip.Label>{AREA_LABELS[area]}</Chip.Label>
            </Chip>
          ))}
          {mentor.isMine ? (
            <Chip size="sm" variant="soft" color="accent">
              <Chip.Label>Your listing</Chip.Label>
            </Chip>
          ) : null}
        </View>
      </View>

      {mentor.bio ? (
        <Section title="About">
          <Card>
            <Text className="text-base leading-6 text-foreground">{mentor.bio}</Text>
          </Card>
        </Section>
      ) : null}

      {mentor.credentials.length > 0 ? (
        <Section title="Credentials">
          <Card>
            {mentor.credentials.map((credential) => (
              <View key={credential} className="flex-row items-start gap-2">
                <View className="h-6 items-center justify-center">
                  <View className="size-1.5 rounded-full bg-accent" />
                </View>
                <Text className="flex-1 text-base text-foreground">{credential}</Text>
              </View>
            ))}
          </Card>
        </Section>
      ) : null}

      {mentor.isMine ? (
        <Button size="lg" variant="danger-soft" onPress={remove}>
          <Button.Label>Remove listing</Button.Label>
        </Button>
      ) : (
        <Button size="lg" onPress={message}>
          <Button.Label>Message {mentor.name.split(' ')[0]}</Button.Label>
        </Button>
      )}
    </ScrollView>
  );
}
