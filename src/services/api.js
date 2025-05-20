import axios from "axios";

const API_KEY = "cf23b9879eaaa73403ae55ece94e0d8b";
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchPopularMovies = async () => {
  const response = await api.get(
    `/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );
  return response.data.results;
};
export const fetchMovieDetails = async (id) => {
  const response = await api.get(`/movie/${id}?api_key=${API_KEY}&language=en-US`)
  return response.data
}

export const fetchMovieCredits = async (movieId) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
  )
  return response.data
}