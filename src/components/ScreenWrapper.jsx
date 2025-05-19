import React from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import colors from "../theme/colors";

const ScreenWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
});

export default ScreenWrapper;
