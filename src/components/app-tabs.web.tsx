import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Tables</TabButton>
          </TabTrigger>
          <TabTrigger name="mentors" href="/mentors" asChild>
            <TabButton>Mentors</TabButton>
          </TabTrigger>
          <TabTrigger name="host" href="/host" asChild>
            <TabButton>Host</TabButton>
          </TabTrigger>
          <TabTrigger name="chats" href="/chats" asChild>
            <TabButton>Messages</TabButton>
          </TabTrigger>
          <TabTrigger name="mine" href="/mine" asChild>
            <TabButton>Mine</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} className="rounded-xl px-4 py-2 active:opacity-70">
      <Text
        className={
          isFocused ? 'text-sm font-medium text-foreground' : 'text-sm font-medium text-muted'
        }>
        {children}
      </Text>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} className="absolute w-full flex-row items-center justify-center p-4">
      <View className="w-full max-w-3xl flex-row items-center gap-2 rounded-2xl bg-surface px-5 py-2">
        {props.children}
      </View>
    </View>
  );
}
