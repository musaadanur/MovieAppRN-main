import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";

import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { auth } from "../services/firebase"; // ✅ artık doğrudan auth kullanıyoruz
import colors from "../theme/colors";
import { setUser } from "../state/slices/authSlice";

const RootNavigator = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Auth kontrolü başladı...");

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.log("auth.onAuthStateChanged tetiklendi");
      console.log("firebaseUser:", firebaseUser);

      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            isAnonymous: firebaseUser.isAnonymous,
          })
        );
        setIsLoggedIn(true);
        console.log("Kullanıcı bulundu, isLoggedIn: true");
      } else {
        dispatch(setUser(null));
        setIsLoggedIn(false);
        console.log("Kullanıcı yok, isLoggedIn: false");
      }

      setCheckingAuth(false);
    });

    const fallbackCheck = setTimeout(() => {
      if (!auth.currentUser && checkingAuth) {
        console.log("fallback check çalıştı — kullanıcı yok");
        dispatch(setUser(null));
        setIsLoggedIn(false);
        setCheckingAuth(false);
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(fallbackCheck);
    };
  }, []);

  if (checkingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
