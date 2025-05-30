import React, { useState } from "react";
import { Text, Alert, TouchableOpacity, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import InputField from "../components/InputField";
import Button from "../components/Button";
import ScreenWrapper from "../components/ScreenWrapper";
import { registerUser } from "../services/firebase";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../state/slices/authSlice";
import colors from "../theme/colors";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      dispatch(registerStart());
      const user = await registerUser(email, password);

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
      Alert.alert("Register Error", error.message);
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
          <Text style={styles.title}>Register</Text>

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

          <Button title="Register" onPress={handleRegister} type="primary" />

          <TouchableOpacity onPress={() => navigation.popTo("Login")}>
            <Text style={styles.link}>
              Already have an account?{" "}
              <Text style={{ color: colors.secondary }}>Login</Text>
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

export default RegisterScreen;
