import React from "react";
import { View } from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text>Preferences</Text>
    </SafeAreaView>
  );
}
