import React, { useState } from "react";
import { Text, Alert, TouchableOpacity, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import InputField from "../components/InputField";
import Button from "../components/Button";
import ScreenWrapper from "../components/ScreenWrapper";
import { loginUser } from "../services/firebase";
import colors from "../theme/colors";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../state/slices/authSlice";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      dispatch(loginStart());
      const user = await loginUser(email, password);

      const serializedUser = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
      };

      dispatch(loginSuccess(serializedUser));
    } catch (error) {
      console.error("Login Error:", error);
      dispatch(loginFailure(error.message));
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button title="Login" onPress={handleLogin} type="primary" />

          <TouchableOpacity onPress={() => navigation.popTo("Register")}>
            <Text style={styles.link}>
              Don't have an account?{" "}
              <Text style={{ color: colors.secondary }}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
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
