import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from 'react-native'
import { auth, logoutUser } from '../services/firebase'
import colors from '../theme/colors'
import PrimaryButton from '../components/PrimaryButton'
import Clipboard from '@react-native-clipboard/clipboard'


const ProfileScreen = () => {
  const user = auth.currentUser

  const handleLogout = async () => {
    Alert.alert('Çıkış Yap', 'Oturumunuzu kapatmak istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Evet',
        onPress: async () => {
          await logoutUser()
        },
      },
    ])
  }

  const copyEmailToClipboard = () => {
  if (user?.email) {
    Clipboard.setString(user.email)
    if (Platform.OS === 'android') {
      ToastAndroid.show('E-posta kopyalandı', ToastAndroid.SHORT)
    } else {
      Alert.alert('Kopyalandı', 'E-posta panoya kopyalandı.')
    }
  }
}


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <TouchableOpacity onPress={copyEmailToClipboard}>
        <Text style={styles.email}>{user?.email}</Text>
      </TouchableOpacity>

      <PrimaryButton title="Çıkış Yap" onPress={handleLogout} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  email: {
    fontSize: 16,
    color: colors.mutedText,
    marginBottom: 32,
    textDecorationLine: 'underline',
  },
})

export default ProfileScreen
