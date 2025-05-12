import React from "react";
import { View } from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from '~/components/ui/button-link';
import { Button } from "~/components/ui/button";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function Page() {
  const { signOut, isLoaded } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    if (!isLoaded) return;
    
    setIsLoading(true);
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4">
      <Text className="text-2xl font-bold mb-6">
        Profile
      </Text>

      <View className="w-full max-w-xs gap-2">
        <Link href="/profile/preferences" className="w-full">
          <Text>Preferences</Text>
        </Link>
        <Link href="(tabs)/profile/achievements" className="w-full">
          <Text>Achievements</Text>
        </Link>
        <Link href="/profile/settings" className="w-full">
          <Text>Settings</Text>
        </Link>
      </View>

      <Button 
        onPress={handleSignOut} 
        variant="destructive" 
        className="mt-8 w-full max-w-xs"
        disabled={isLoading}
      >
        <Text>{isLoading ? "Signing out..." : "Sign out"}</Text>
      </Button>
    </SafeAreaView>
  );
}
