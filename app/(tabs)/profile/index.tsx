import React from "react";
import { View } from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import { Image } from "~/components/ui/image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from '~/components/ui/button-link';
import { Button } from "~/components/ui/button";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import AuthPage from "~/components/pages/auth";
import { UserPen, LogOut, ChevronRight, Settings } from "~/assets/icons";

export default function Page() {
  const { signOut, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
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
    <>
      {!isSignedIn &&
        <AuthPage />
      }
      {isSignedIn &&
        <SafeAreaView className="flex-1 px-4 py-4 gap-4">
          <Text className="text-3xl font-comfortaa-bold">Profile</Text>
          <View className="flex-row items-center justify-between px-4">
            <View className="flex-row items-center gap-4">
              <Image source={user?.imageUrl} className="w-16 h-16 rounded-full" />
              <View>
                <Text className="text-lg font-comfortaa-semibold">{user?.fullName}</Text>
                <Text className="text-sm text-gray-500 font-comfortaa-regular">{user?.emailAddresses[0].emailAddress}</Text>
              </View>
            </View>
            <Button variant="outline" size="icon" className="size-10">
              <UserPen size={24} />
            </Button>
          </View>
          <View className="">
            <Link href="/settings" variant="ghost" className="items-center justify-between border-b">
              <View className="flex-row items-center gap-4">
                <Settings size={24} />
                <Text className="text-lg font-comfortaa-semibold">Settings</Text>
              </View>
              <ChevronRight size={24} />
            </Link>
            <Link href="/preferences" variant="ghost" className="items-center justify-between border-b border-gray-500 py-6">
              <View className="flex-row items-center gap-4">
                <Settings size={24} />
                <Text className="text-lg font-comfortaa-semibold">Preferences</Text>
              </View>
              <ChevronRight size={24} />
            </Link>
          </View>
        </SafeAreaView>
      }
    </>
  );
}
