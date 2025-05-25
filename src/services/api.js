import axios from 'axios'

const API_KEY = 'cf23b9879eaaa73403ae55ece94e0d8b'
const BASE_URL = 'https://api.themoviedb.org/3'

const api = axios.create({
  baseURL: BASE_URL,
})

// Popüler filmleri getir
export const fetchPopularMovies = async () => {
  const response = await api.get(`/movie/popular`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  })
  return response.data.results
}

// Film detaylarını getir
export const fetchMovieDetails = async (id) => {
  const response = await api.get(`/movie/${id}`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  })
  return response.data
}

// Oyuncu kadrosunu getir
export const fetchMovieCredits = async (movieId) => {
  const response = await api.get(`/movie/${movieId}/credits`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  })
  return response.data
}

// Arama
export const searchMovies = async (query) => {
  const response = await api.get(`/search/movie`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
      query,
    },
  })
  return response.data.results
}

// Türleri getir
export const fetchGenres = async () => {
  const response = await api.get('/genre/movie/list', {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  })
  return response.data.genres
}

// Filtreli film araması (genre + rating)
export const discoverMovies = async (genreIds, rating = 0) => {
  const response = await api.get('/discover/movie', {
    params: {
      api_key: API_KEY,
      language: 'en-US',
      with_genres: genreIds, // "28,16" gibi string
      'vote_average.gte': rating, // min rating
      sort_by: 'popularity.desc',
    },
  })
  return response.data.results
}
