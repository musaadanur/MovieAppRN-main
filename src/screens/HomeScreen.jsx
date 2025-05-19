import React, { useEffect, useState } from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import { fetchPopularMovies } from '../services/api'
import ScreenWrapper from '../components/ScreenWrapper'
import MovieCard from '../components/MovieCard'

const HomeScreen = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchPopularMovies()
        setMovies(data)
      } catch (error) {
        console.error('API Error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard movie={item} onPress={() => {}} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </ScreenWrapper>
  )
}

export default HomeScreen
