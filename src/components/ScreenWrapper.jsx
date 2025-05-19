import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import colors from '../theme/colors'

const ScreenWrapper = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
  },
})

export default ScreenWrapper
