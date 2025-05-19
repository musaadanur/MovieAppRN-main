import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

import { ActivityIndicator, View } from "react-native";
import colors from "../theme/colors";

const RootNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcının giriş yapıp yapmadığını dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
