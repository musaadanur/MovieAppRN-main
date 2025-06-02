import axios from "axios";

const API_KEY = "cf23b9879eaaa73403ae55ece94e0d8b";
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "tr-TR",
  },
});

// Popüler filmleri getir
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await api.get("/movie/popular", {
      params: { page },
    });
    return response.data.results;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Filmler yüklenirken bir hata oluştu"
    );
  }
};

// Film detaylarını getir
export const fetchMovieDetails = async (id) => {
  try {
    const response = await api.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Film detayları yüklenirken bir hata oluştu"
    );
  }
};

// Oyuncu kadrosunu getir
export const fetchMovieCredits = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Film oyuncuları yüklenirken bir hata oluştu"
    );
  }
};

// Arama
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get("/search/movie", {
      params: { query, page },
    });
    return response.data.results;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Film arama sırasında bir hata oluştu"
    );
  }
};

// Türleri getir
export const fetchGenres = async () => {
  try {
    const response = await api.get("/genre/movie/list");
    return response.data.genres;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Film türleri yüklenirken bir hata oluştu"
    );
  }
};

// Filtreli film araması (genre + rating)
export const discoverMovies = async (genreIds, minRating, page = 1) => {
  try {
    const response = await api.get("/discover/movie", {
      params: {
        with_genres: genreIds,
        "vote_average.gte": minRating,
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Film arama sırasında bir hata oluştu"
    );
  }
};
