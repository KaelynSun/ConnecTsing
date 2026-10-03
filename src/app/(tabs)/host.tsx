import { useRouter } from 'expo-router';
import { Button, Input, Label, TextField } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Presets } from 'react-native-pulsar';

import { pressHaptic } from '@/components/pressable';
import { Section } from '@/components/section';
import { Segmented } from '@/components/segmented';
import { useTablesStore } from '@/features/tables/store/tables-store';
import type { TableCategory } from '@/features/tables/types/table';

const CATEGORIES: readonly TableCategory[] = ['mahjong', 'study'];
const SEAT_CHOICES = ['2', '3', '4', '5', '6'] as const;
type SeatChoice = (typeof SEAT_CHOICES)[number];

export default function HostScreen() {
  const router = useRouter();
  const profile = useTablesStore((s) => s.profile);
  const setProfile = useTablesStore((s) => s.setProfile);
  const addTable = useTablesStore((s) => s.addTable);

  const [category, setCategory] = useState<TableCategory>('mahjong');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [timeText, setTimeText] = useState('');
  const [seats, setSeats] = useState<SeatChoice>('4');
  const [description, setDescription] = useState('');
  const [name, setName] = useState(profile.name);
  const [lineId, setLineId] = useState(profile.lineId);

  const ready = title.trim().length > 0 && location.trim().length > 0 && timeText.trim().length > 0;

  const submit = () => {
    pressHaptic();
    if (!ready) return;
    const trimmedName = name.trim() || 'Me';
    const trimmedLine = lineId.trim();
    setProfile({ ...profile, name: trimmedName, lineId: trimmedLine });
    const id = addTable({
      title,
      category,
      description,
      location,
      timeText,
      seatsTotal: Number(seats),
    });
    Presets.System.notificationSuccess();
    setTitle('');
    setLocation('');
    setTimeText('');
    setDescription('');
    router.push(`/table/${id}`);
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6"
      showsVerticalScrollIndicator={false}>
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground" numberOfLines={1}>
          Host a table
        </Text>
        <Text className="text-base text-muted">
          Post an open seat — classmates claim it from the feed.
        </Text>
      </View>

      <Section title="What are you gathering for?">
        <Segmented
          values={CATEGORIES}
          labels={['Mahjong', 'Study group']}
          value={category}
          onChange={setCategory}
        />
      </Section>

      <Section title="The table">
        <TextField isRequired>
          <Label>Title</Label>
          <Input
            placeholder={category === 'mahjong' ? 'Friday night mahjong' : 'Calculus cram group'}
            value={title}
            onChangeText={setTitle}
          />
        </TextField>
        <TextField isRequired>
          <Label>Where</Label>
          <Input
            placeholder="Delta Hall B1 lounge"
            value={location}
            onChangeText={setLocation}
          />
        </TextField>
        <TextField isRequired>
          <Label>When</Label>
          <Input placeholder="Tonight, 8:00 PM" value={timeText} onChangeText={setTimeText} />
        </TextField>
        <TextField>
          <Label>Details</Label>
          <Input
            placeholder="Skill level, what to bring, house rules…"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </TextField>
      </Section>

      <Section title="Seats (including you)">
        <Segmented values={SEAT_CHOICES} value={seats} onChange={setSeats} />
      </Section>

      <Section title="How classmates reach you">
        <TextField isRequired>
          <Label>Your name</Label>
          <Input placeholder="Mei-Ling W." value={name} onChangeText={setName} />
        </TextField>
        <TextField>
          <Label>LINE ID</Label>
          <Input
            placeholder="So they can message you"
            value={lineId}
            onChangeText={setLineId}
            autoCapitalize="none"
          />
        </TextField>
      </Section>

      <Button size="lg" onPress={submit} isDisabled={!ready}>
        <Button.Label>Post table</Button.Label>
      </Button>
    </KeyboardAwareScrollView>
  );
}
