import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {
  getLikedMovies,
  removeLikedMovie
} from '../services/firebase'
import { auth } from '../services/firebase'
import MovieCard from '../components/MovieCard'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ScreenWrapper from '../components/ScreenWrapper'
import colors from '../theme/colors'

const FavoritesScreen = () => {
  const [movies, setMovies] = useState([])
  const navigation = useNavigation()

  // Ekran odaklandığında favorileri yeniden çek
  useFocusEffect(
    React.useCallback(() => {
      const fetchFavorites = async () => {
        const uid = auth.currentUser?.uid
        if (!uid) return
        const liked = await getLikedMovies(uid)
        setMovies(liked)
      }

      fetchFavorites()
    }, [])
  )

  const handleUnlike = (movie) => {
    Alert.alert(
      'Favoriden çıkarılsın mı?',
      'Bu filmi beğenmekten vazgeçiyorsun. Emin misin?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            const uid = auth.currentUser?.uid
            await removeLikedMovie(uid, movie.id)
            setMovies((prev) => prev.filter((m) => m.id !== movie.id))
          },
        },
      ]
    )
  }

  // Eğer tek film varsa dummy bir kart ekle
  const dataWithPlaceholder =
    movies.length % 2 === 1
      ? [...movies, { isPlaceholder: true, id: 'placeholder' }]
      : movies

  const renderItem = ({ item }) => {
    if (item.isPlaceholder) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.placeholder}
        >
          <Text style={styles.placeholderText}>+ Beğenebileceğin filmleri keşfet</Text>
        </TouchableOpacity>
      )
    }

    return (
      <MovieCard
        movie={item}
        liked={true}
        onPress={() =>
          navigation.navigate('MovieDetail', { movieId: item.id })
        }
        onToggleLike={() => handleUnlike(item)}
      />
    )
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={dataWithPlaceholder}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginHorizontal: 4 }}>
            {renderItem({ item })}
          </View>
        )}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  placeholder: {
    aspectRatio: 2 / 3,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.mutedText,
    fontSize: 12,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
})

export default FavoritesScreen
