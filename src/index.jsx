import React from "react";
import { StatusBar, Text, View } from "react-native";
import colors from "./theme/colors";

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {/* Buraya Navigation eklenecek */}
    </View>
  );
}
