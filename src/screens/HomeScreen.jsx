import React, { useEffect, useState } from "react"
import {
  FlatList,
  ActivityIndicator,
  View
} from "react-native"
import { fetchPopularMovies } from "../services/api"
import ScreenWrapper from "../components/ScreenWrapper"
import MovieCard from "../components/MovieCard"
import { useNavigation } from "@react-navigation/native"
import {
  addLikedMovie,
  getLikedMovies,
  removeLikedMovie
} from "../services/firebase"
import { auth } from "../services/firebase"
import colors from "../theme/colors"
import { useFocusEffect } from "@react-navigation/native";


const HomeScreen = () => {
  const navigation = useNavigation()
  const [movies, setMovies] = useState([])
  const [likedMovieIds, setLikedMovieIds] = useState([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
  React.useCallback(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchPopularMovies()
        setMovies(data)

        const uid = auth.currentUser?.uid
        if (uid) {
          const liked = await getLikedMovies(uid)
          setLikedMovieIds(liked.map((m) => m.id))
        }
      } catch (error) {
        console.error("API Error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])
)


  const handleToggleLike = async (movie) => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    if (likedMovieIds.includes(movie.id)) {
      await removeLikedMovie(uid, movie.id)
      setLikedMovieIds((prev) => prev.filter((id) => id !== movie.id))
    } else {
      await addLikedMovie(uid, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      })
      setLikedMovieIds((prev) => [...prev, movie.id])
    }
  }

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator
          size="large"
          color={colors.text}
          style={{ marginTop: 20 }}
        />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={movies}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginHorizontal: 4 }}>
            <MovieCard
              movie={item}
              liked={likedMovieIds.includes(item.id)}
              onToggleLike={() => handleToggleLike(item)}
              onPress={() =>
                navigation.navigate("MovieDetail", { movieId: item.id })
              }
            />
          </View>
        )}
      />
    </ScreenWrapper>
  )
}

export default HomeScreen
