import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
  selectedMovie: null,
  loading: false,
  error: null,
  searchResults: [],
  currentPage: 1,
  totalPages: 1,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    fetchMoviesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMoviesSuccess: (state, action) => {
      state.loading = false;
      state.movies = action.payload.results;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.total_pages;
      state.error = null;
    },
    fetchMoviesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    searchMoviesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    searchMoviesSuccess: (state, action) => {
      state.loading = false;
      state.searchResults = action.payload.results;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.total_pages;
      state.error = null;
    },
    searchMoviesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
});

export const {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  setSelectedMovie,
  searchMoviesStart,
  searchMoviesSuccess,
  searchMoviesFailure,
  clearSearchResults,
} = movieSlice.actions;

export default movieSlice.reducer;
