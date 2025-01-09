import React from "react";
import { View } from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="font-comfortaa-bold">This will use Comfortaa_Bold</Text>
      <Text className="font-comfortaa-semibold">This will use Comfortaa_SemiBold</Text>
      <Text className="font-comfortaa-medium">This will use Comfortaa_Medium</Text>
      <Text className="font-comfortaa">This will use Comfortaa_Regular</Text>
      <Text className="font-comfortaa-light">This will use Comfortaa_Light</Text>
    </SafeAreaView>
  );
}
