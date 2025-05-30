import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "./state/store";
import RootNavigator from "./navigation/RootNavigator";
import colors from "./theme/colors";

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
        />
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
