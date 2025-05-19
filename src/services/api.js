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
