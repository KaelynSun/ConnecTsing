import { useRouter } from 'expo-router';
import { Button, Input, Label, TextField } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Presets } from 'react-native-pulsar';

import { pressHaptic } from '@/components/pressable';
import { useTablesStore } from '@/features/tables/store/tables-store';

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useTablesStore((s) => s.profile);
  const setProfile = useTablesStore((s) => s.setProfile);
  const [name, setName] = useState(profile.name);
  const [dept, setDept] = useState(profile.dept);
  const [lineId, setLineId] = useState(profile.lineId);

  const save = () => {
    pressHaptic();
    setProfile({
      name: name.trim() || 'Me',
      dept: dept.trim(),
      lineId: lineId.trim(),
    });
    Presets.System.notificationSuccess();
    router.back();
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6"
      showsVerticalScrollIndicator={false}>
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground" numberOfLines={1}>
          Your profile
        </Text>
        <Text className="text-base text-muted">
          Shown on tables you host and seats you claim.
        </Text>
      </View>

      <TextField isRequired>
        <Label>Name</Label>
        <Input placeholder="Mei-Ling W." value={name} onChangeText={setName} />
      </TextField>
      <TextField>
        <Label>Department & year</Label>
        <Input placeholder="CS · Junior" value={dept} onChangeText={setDept} />
      </TextField>
      <TextField>
        <Label>LINE ID</Label>
        <Input
          placeholder="How classmates message you"
          value={lineId}
          onChangeText={setLineId}
          autoCapitalize="none"
        />
      </TextField>

      <Button size="lg" onPress={save}>
        <Button.Label>Save</Button.Label>
      </Button>
    </KeyboardAwareScrollView>
  );
}
