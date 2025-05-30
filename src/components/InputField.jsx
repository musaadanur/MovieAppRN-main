import React from "react";
import { TextInput, StyleSheet } from "react-native";

const InputField = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType = "default",
}) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default InputField;
