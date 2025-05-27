import { Stack } from 'expo-router';

export default function ModalLayout({ children }: { children: React.ReactNode }) {
  return <Stack screenOptions={{ headerShown: false }}>{children}</Stack>;
}
