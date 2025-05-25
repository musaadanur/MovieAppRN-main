import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from "react-native";
import { auth, logoutUser, db } from "../services/firebase";
import Clipboard from "@react-native-clipboard/clipboard";
import Button from "../components/Button";
import colors from "../theme/colors";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const handleLogout = async () => {
    Alert.alert("Çıkış Yap", "Oturumunuzu kapatmak istiyor musunuz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Evet",
        onPress: async () => {
          await logoutUser();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hesabı Sil",
      "Hesabınızı kalıcı olarak silmek istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: async () => {
            if (!user) return;

            try {
              await deleteDoc(doc(db, "users", user.uid));
              await user.delete();

              if (Platform.OS === "android") {
                ToastAndroid.show("Hesap silindi", ToastAndroid.SHORT);
              } else {
                Alert.alert("Başarılı", "Hesabınız silindi.");
              }

              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.log("Hesap silme hatası:", error);
              Alert.alert("Hata", "Hesap silinirken bir hata oluştu.");
            }
          },
        },
      ]
    );
  };

  const copyEmailToClipboard = () => {
    if (user?.email) {
      Clipboard.setString(user.email);
      if (Platform.OS === "android") {
        ToastAndroid.show("E-posta kopyalandı", ToastAndroid.SHORT);
      } else {
        Alert.alert("Kopyalandı", "E-posta panoya kopyalandı.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <TouchableOpacity onPress={copyEmailToClipboard}>
        <Text style={styles.email}>{user?.email}</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <Button
          title="Hesabı Sil"
          onPress={handleDeleteAccount}
          type="secondary"
          style={{ flex: 1 }}
        />
        <View style={{ width: 16 }} />
        <Button
          title="Çıkış Yap"
          onPress={handleLogout}
          type="primary"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  email: {
    fontSize: 16,
    color: colors.mutedText,
    marginBottom: 32,
    textDecorationLine: "underline",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default ProfileScreen;
