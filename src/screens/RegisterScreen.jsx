import React, { useState } from "react";
import { Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import InputField from "../components/InputField";
import Button from "../components/Button";
import ScreenWrapper from "../components/ScreenWrapper";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../services/firebase";
import colors from "../theme/colors";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await registerUser(email, password);
    } catch (error) {
      Alert.alert("Kayıt Hatası", error.message);
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Kayıt Ol</Text>

      <InputField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <InputField
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Kayıt Ol" onPress={handleRegister} type="primary" />

      <TouchableOpacity onPress={() => navigation.popTo("Login")}>
        <Text style={styles.link}>
          Zaten hesabın var mı?{" "}
          <Text style={{ color: colors.secondary }}>Giriş yap</Text>
        </Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  link: {
    color: colors.mutedText,
    textAlign: "center",
    marginTop: 12,
  },
});

export default RegisterScreen;
