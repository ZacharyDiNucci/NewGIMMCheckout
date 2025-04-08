import React from "react";
import { SafeAreaView } from "react-native";
import CheckoutList from "./components/CheckoutList"; // Adjusted import path

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CheckoutList />
    </SafeAreaView>
  );
}
