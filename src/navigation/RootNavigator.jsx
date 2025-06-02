import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { auth } from "../services/firebase";
import colors from "../theme/colors";
import { setUser } from "../state/slices/authSlice";

const RootNavigator = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
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
      } else {
        dispatch(setUser(null));
        setIsLoggedIn(false);
      }

      setCheckingAuth(false);
    });

    const fallbackCheck = setTimeout(() => {
      if (!auth.currentUser && checkingAuth) {
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
