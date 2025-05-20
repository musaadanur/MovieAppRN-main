import React, { useState } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  ToastAndroid,
  Platform,
} from 'react-native'
import { searchMovies } from '../services/api'
import colors from '../theme/colors'
import MovieCard from '../components/MovieCard'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ScreenWrapper from '../components/ScreenWrapper'
import {
  getLikedMovies,
  addLikedMovie,
  removeLikedMovie,
} from '../services/firebase'
import { auth } from '../services/firebase'

const SearchScreen = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [likedIds, setLikedIds] = useState([])
  const navigation = useNavigation()

  // Beğenilen filmleri her odaklanmada çek
  useFocusEffect(
    React.useCallback(() => {
      const fetchLikes = async () => {
        const uid = auth.currentUser?.uid
        if (!uid) return
        const liked = await getLikedMovies(uid)
        setLikedIds(liked.map((m) => m.id))
      }

      fetchLikes()
    }, [])
  )

  // Arama
  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const data = await searchMovies(query.trim())
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
      Keyboard.dismiss()
    }
  }

  // Like işlemi
  const toggleLike = async (movie) => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const isLiked = likedIds.includes(movie.id)

    if (isLiked) {
      await removeLikedMovie(uid, movie.id)
      setLikedIds((prev) => prev.filter((id) => id !== movie.id))
      if (Platform.OS === 'android') ToastAndroid.show('Beğenme kaldırıldı', ToastAndroid.SHORT)
    } else {
      await addLikedMovie(uid, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      })
      setLikedIds((prev) => [...prev, movie.id])
      if (Platform.OS === 'android') ToastAndroid.show('Film beğenildi', ToastAndroid.SHORT)
    }
  }

  return (
    <ScreenWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Arama kutusu */}
          <View style={styles.searchRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Film ara..."
                placeholderTextColor={colors.mutedText}
                value={query}
                onChangeText={(text) => {
                  setQuery(text)
                  if (text.trim() === '') setResults([])
                }}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setQuery('')
                    setResults([])
                  }}
                >
                  <Text style={styles.clearText}>X</Text>
                </TouchableOpacity>
              )}
            </View>

            {query.length > 0 && (
              <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Ara</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Sonuçlar */}
          {loading ? (
            <ActivityIndicator size="large" color={colors.text} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
              contentContainerStyle={{ padding: 8 }}
              renderItem={({ item }) => (
                <View style={{ flex: 1, marginHorizontal: 4 }}>
                  <MovieCard
                    movie={item}
                    liked={likedIds.includes(item.id)}
                    onPress={() =>
                      navigation.navigate('MovieDetail', { movieId: item.id })
                    }
                    onToggleLike={() => toggleLike(item)}
                  />
                </View>
              )}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 10,
  },
  clearText: {
    color: colors.secondary,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  searchButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
})

export default SearchScreen
