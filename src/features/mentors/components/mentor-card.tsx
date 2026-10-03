import { Chip } from 'heroui-native';
import { Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Pressable } from '@/components/pressable';

import { AREA_LABELS, type Mentor } from '../types/mentor';

type MentorCardProps = {
  mentor: Mentor;
  onPress: () => void;
};

/** One mentor in the directory: name, department, what they help with, short bio. */
export function MentorCard({ mentor, onPress }: MentorCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card>
        <View className="flex-row items-center gap-3">
          <View className="size-11 items-center justify-center rounded-full bg-accent">
            <Text className="text-lg font-bold text-accent-foreground">
              {mentor.name.trim().charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-lg font-semibold text-foreground" numberOfLines={1}>
              {mentor.name}
              {mentor.isMine ? ' (you)' : ''}
            </Text>
            <Text className="text-sm text-muted" numberOfLines={1}>
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
        </View>
        <Text className="text-sm text-muted" numberOfLines={2}>
          {mentor.bio}
        </Text>
      </Card>
    </Pressable>
  );
}
