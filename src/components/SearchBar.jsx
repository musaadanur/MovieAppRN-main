import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import colors from "../theme/colors";

const SearchBar = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <View style={styles.searchRow}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search movies..."
          placeholderTextColor={colors.mutedText}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (text.trim() === "") onClear();
          }}
          onSubmitEditing={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  clearText: {
    color: colors.mutedText,
    fontSize: 16,
    padding: 4,
  },
});

export default SearchBar;
