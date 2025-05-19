import React from 'react'
import { StatusBar, View } from 'react-native'
import colors from './theme/colors'
import RootNavigator from './navigation/RootNavigator'

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <RootNavigator />
    </View>
  )
}
