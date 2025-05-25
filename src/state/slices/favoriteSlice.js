import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    fetchFavoritesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFavoritesSuccess: (state, action) => {
      state.loading = false;
      state.favorites = action.payload;
      state.error = null;
    },
    fetchFavoritesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(
        (movie) => movie.id !== action.payload
      );
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const {
  fetchFavoritesStart,
  fetchFavoritesSuccess,
  fetchFavoritesFailure,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
