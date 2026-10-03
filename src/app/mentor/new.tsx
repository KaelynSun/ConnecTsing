import { useRouter } from 'expo-router';
import { Button, Chip, Description, Input, Label, TextField } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Presets } from 'react-native-pulsar';

import { pressHaptic } from '@/components/pressable';
import { Section } from '@/components/section';
import { useMentorsStore } from '@/features/mentors/store/mentors-store';
import { AREA_LABELS, MENTOR_AREAS, type MentorArea } from '@/features/mentors/types/mentor';
import { useTablesStore } from '@/features/tables/store/tables-store';

export default function NewMentorScreen() {
  const router = useRouter();
  const profile = useTablesStore((s) => s.profile);
  const setProfile = useTablesStore((s) => s.setProfile);
  const addMentor = useMentorsStore((s) => s.addMentor);

  const [name, setName] = useState(profile.name);
  const [dept, setDept] = useState(profile.dept);
  const [areas, setAreas] = useState<MentorArea[]>([]);
  const [bio, setBio] = useState('');
  const [credentials, setCredentials] = useState('');

  const ready = name.trim().length > 0 && dept.trim().length > 0 && areas.length > 0;

  const toggleArea = (area: MentorArea) => {
    pressHaptic();
    setAreas((current) =>
      current.includes(area) ? current.filter((a) => a !== area) : [...current, area],
    );
  };

  const submit = () => {
    pressHaptic();
    if (!ready) return;
    const trimmedName = name.trim();
    const trimmedDept = dept.trim();
    setProfile({ ...profile, name: trimmedName, dept: trimmedDept });
    const id = addMentor({
      name: trimmedName,
      dept: trimmedDept,
      areas,
      bio,
      credentials: credentials
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    });
    Presets.System.notificationSuccess();
    router.replace(`/mentor/${id}`);
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6"
      showsVerticalScrollIndicator={false}>
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground" numberOfLines={1}>
          Offer mentorship
        </Text>
        <Text className="text-base text-muted">
          For seniors and grad students — juniors message you right in the app.
        </Text>
      </View>

      <Section title="You">
        <TextField isRequired>
          <Label>Name</Label>
          <Input placeholder="Chia-Wen L." value={name} onChangeText={setName} />
        </TextField>
        <TextField isRequired>
          <Label>Department & year</Label>
          <Input placeholder="CS · Senior" value={dept} onChangeText={setDept} />
        </TextField>
      </Section>

      <Section title="You can help with">
        <View className="flex-row flex-wrap gap-2">
          {MENTOR_AREAS.map((area) => {
            const selected = areas.includes(area);
            return (
              <Chip
                key={area}
                variant={selected ? 'primary' : 'soft'}
                color={selected ? 'accent' : 'default'}
                onPress={() => toggleArea(area)}>
                <Chip.Label>{AREA_LABELS[area]}</Chip.Label>
              </Chip>
            );
          })}
        </View>
        <Description>Pick at least one.</Description>
      </Section>

      <Section title="About you">
        <TextField>
          <Label>Bio</Label>
          <Input
            placeholder="What you study, what you wish someone told you earlier…"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
          />
        </TextField>
        <TextField>
          <Label>Credentials</Label>
          <Input
            placeholder={'TA for Data Structures\nDean\'s list, two semesters\nTSMC intern'}
            value={credentials}
            onChangeText={setCredentials}
            multiline
            numberOfLines={4}
          />
          <Description>One per line — shown as your CV highlights.</Description>
        </TextField>
      </Section>

      <Button size="lg" onPress={submit} isDisabled={!ready}>
        <Button.Label>Publish listing</Button.Label>
      </Button>
    </KeyboardAwareScrollView>
  );
}
