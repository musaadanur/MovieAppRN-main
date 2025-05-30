import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "./Button";

const SearchFilterSelector = ({ mode, setMode }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Search"
        onPress={() => setMode("search")}
        type={mode === "search" ? "primary" : "secondary"}
        style={styles.button}
      />
      <Button
        title="Filter"
        onPress={() => setMode("filter")}
        type={mode === "filter" ? "primary" : "secondary"}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    marginHorizontal: 14,
  },
  button: {
    flex: 1,
  },
});

export default SearchFilterSelector;
