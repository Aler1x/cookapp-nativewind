import React from "react";
import Header from "~/components/header";
import Content from "~/components/content";
import Footer from "~/components/footer";
import { View } from "~/components/ui/view";
import { SafeAreaView } from 'react-native';

export default function Page() {
  return (
    <SafeAreaView className="flex-1"> 
      <Header />
      <Content />
      <Footer />
    </SafeAreaView>
  );
}
