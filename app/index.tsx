import React from "react";
import Header from "~/components/header";
import Content from "~/components/content";
import Footer from "~/components/footer";
import { View } from "~/components/ui/view";

export default function Page() {
  return (
    <View className="flex flex-1 bg-background">
      <Header />
      <Content />
      <Footer />
    </View>
  );
}
