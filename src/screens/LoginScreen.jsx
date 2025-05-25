import React, { useState } from "react";
import { Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import InputField from "../components/InputField";
import Button from "../components/Button"; // yeni tekil buton bileşeni
import ScreenWrapper from "../components/ScreenWrapper";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../services/firebase";
import colors from "../theme/colors";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await loginUser(email, password);
    } catch (error) {
      Alert.alert("Giriş Hatası", error.message);
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Giriş Yap</Text>

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

      <Button title="Giriş Yap" onPress={handleLogin} type="primary" />

      <TouchableOpacity onPress={() => navigation.popTo("Register")}>
        <Text style={styles.link}>
          Hesabın yok mu?{" "}
          <Text style={{ color: colors.secondary }}>Kayıt ol</Text>
        </Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#fff",
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

export default LoginScreen;
