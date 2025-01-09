import React from "react";
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
      <View
        className="flex shrink-0 bg-gray-200 dark:bg-gray-800 native:hidden "
        style={{ paddingBottom: bottom }}
      >
        <View className="py-6 items-start px-4 md:px-6">
          <Text className="text-center">
            © {new Date().getFullYear()} Me
          </Text>
      </View>
    </View>
  );
}
