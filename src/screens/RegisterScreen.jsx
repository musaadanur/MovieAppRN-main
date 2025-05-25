import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { registerUser } from "../services/firebase";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../state/slices/authSlice";
import colors from "../theme/colors";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Hata", "Lütfen email ve şifrenizi girin");
      return;
    }

    try {
      setLoading(true);
      dispatch(registerStart());
      const user = await registerUser(email, password);

      // Firebase user objesini serialize edilebilir hale getir
      const serializedUser = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
      };

      dispatch(registerSuccess(serializedUser));
    } catch (error) {
      console.error("Register Error:", error);
      dispatch(registerFailure(error.message));
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Film Uygulaması</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.mutedText}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor={colors.mutedText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.secondary }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>
          Zaten hesabın var mı?{" "}
          <Text style={[styles.loginLink, { color: colors.secondary }]}>
            Giriş yap
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: colors.mutedText,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
