import React from "react";
import { View } from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from '~/components/ui/button-link';

export default function Page() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text>
        Profile
      </Text>
      <Link href="/profile/preferences">
        <Text>Preferences</Text>
      </Link>
      <Link href="(tabs)/profile/achievements">
        <Text>Achievements</Text>
      </Link>
      <Link href="/profile/settings">
        <Text>Settings</Text>
      </Link>
    </SafeAreaView >
  );
}
