import { View } from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from '~/components/ui/button-link';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';

export default function Page() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text>Achievements</Text>
      <Link href="(tabs)/profile"></Link>
    </SafeAreaView>
  );
}
