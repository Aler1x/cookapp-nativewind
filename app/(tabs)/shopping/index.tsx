import React from "react";
import { View } from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { share } from "~/lib/share";

export default function Page() {

  const itemsToShare = [
    '1. Bolius new ui',
    '2. Bolius new features like text edit and undo',
    '3. Toddle new formula types/components',
  ];

  const onShare = async () => {
    const result = await share('text', itemsToShare, {
      dialogTitle: 'Sharing shopping list'
    });
    
    if (result.success) {
      console.log('Shopping list shared successfully');
    }
  };

return (
  <SafeAreaView className="flex-1 items-center justify-center">
    <Text>Shopping</Text>
    <Button onPress={onShare}>
      <Text>Share this list</Text>
    </Button>
  </SafeAreaView>
);
}
