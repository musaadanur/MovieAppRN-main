import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import colors from "../theme/colors";

const ScreenWrapper = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 8,
  },
});

export default ScreenWrapper;
