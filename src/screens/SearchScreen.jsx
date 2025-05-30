import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ScreenWrapper from "../components/ScreenWrapper";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import SearchFilterSelector from "../components/SearchFilterSelector";
import GenreAndRatingSelector from "../components/GenreAndRatingSelector";
import { searchMovies, discoverMovies } from "../services/api";
import {
  getLikedMovies,
  addLikedMovie,
  removeLikedMovie,
} from "../services/firebase";
import { auth } from "../services/firebase";
import colors from "../theme/colors";
import {
  searchMoviesStart,
  searchMoviesSuccess,
  searchMoviesFailure,
  clearSearchResults,
} from "../state/slices/movieSlice";
import {
  fetchFavoritesStart,
  fetchFavoritesSuccess,
  fetchFavoritesFailure,
  addToFavorites,
  removeFromFavorites,
} from "../state/slices/favoriteSlice";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.43;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const SearchScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mode, setMode] = useState("search");
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const { searchResults, loading: moviesLoading } = useSelector(
    (state) => state.movies
  );
  const { favorites, loading: favoritesLoading } = useSelector(
    (state) => state.favorites
  );
  const { user } = useSelector((state) => state.auth);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLikes = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        try {
          dispatch(fetchFavoritesStart());
          const liked = await getLikedMovies(uid);
          dispatch(fetchFavoritesSuccess(liked));
        } catch (error) {
          dispatch(fetchFavoritesFailure(error.message));
        }
      };

      fetchLikes();
    }, [])
  );

  useEffect(() => {
    if (mode !== "filter") return;
    if (selectedGenres.length === 0 && selectedRatings.length === 0) {
      dispatch(clearSearchResults());
      return;
    }

    const fetchFiltered = async () => {
      try {
        dispatch(searchMoviesStart());
        const genreIds = selectedGenres.map((g) => g.id).join(",");
        const ratingsNumbers = selectedRatings.map((r) =>
          parseInt(r.replace("+", ""))
        );
        const minRating =
          ratingsNumbers.length > 0 ? Math.min(...ratingsNumbers) : 0;

        const data = await discoverMovies(genreIds, minRating, 1);
        dispatch(
          searchMoviesSuccess({ results: data, page: 1, total_pages: 1 })
        );
        setPage(1);
      } catch (error) {
        console.log("discover error:", error);
        dispatch(searchMoviesFailure(error.message));
      }
    };

    fetchFiltered();
  }, [selectedGenres, selectedRatings, mode]);

  const handleSearch = async (searchQuery) => {
    try {
      dispatch(searchMoviesStart());
      const results = await searchMovies(searchQuery);
      dispatch(
        searchMoviesSuccess({ results: results, page: 1, total_pages: 1 })
      );
      setPage(1);
    } catch (error) {
      console.error("Search Error:", error);
      dispatch(searchMoviesFailure(error.message));
    }
  };

  const loadMore = async () => {
    if (loadingMore || !searchResults.length) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      let data;

      if (mode === "search") {
        data = await searchMovies(query.trim(), nextPage);
      } else {
        const genreIds = selectedGenres.map((g) => g.id).join(",");
        const ratingsNumbers = selectedRatings.map((r) =>
          parseInt(r.replace("+", ""))
        );
        const minRating =
          ratingsNumbers.length > 0 ? Math.min(...ratingsNumbers) : 0;
        data = await discoverMovies(genreIds, minRating, nextPage);
      }

      if (data.length > 0) {
        dispatch(
          searchMoviesSuccess({
            results: [...searchResults, ...data],
            page: nextPage,
            total_pages: 1,
          })
        );
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Load More Error:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const toggleLike = async (movie) => {
    if (!user) {
      navigation.navigate("Login");
      return;
    }

    const isLiked = favorites.some((fav) => fav.id === movie.id);

    try {
      if (isLiked) {
        await removeLikedMovie(user.uid, movie.id);
        dispatch(removeFromFavorites(movie.id));
      } else {
        await addLikedMovie(user.uid, movie);
        dispatch(addToFavorites(movie));
      }
    } catch (error) {
      console.error("Toggle Like Error:", error);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setQuery("");
    dispatch(clearSearchResults());
    setSelectedGenres([]);
    setSelectedRatings([]);
    setPage(1);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator
        size="small"
        color={colors.text}
        style={{ marginVertical: 10 }}
      />
    );
  };

  const renderEmptyState = () => {
    if (moviesLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Searching...</Text>
        </View>
      );
    }

    if (query && searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No movies found</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Search for movies</Text>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <SearchFilterSelector mode={mode} setMode={handleModeChange} />

      {mode === "search" && (
        <SearchBar
          onSearch={handleSearch}
          onClear={() => dispatch(clearSearchResults())}
        />
      )}

      {mode === "filter" && (
        <>
          <GenreAndRatingSelector
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
          />

          <View style={styles.chipsRow}>
            {selectedGenres.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={styles.chip}
                onPress={() =>
                  setSelectedGenres((prev) =>
                    prev.filter((g) => g.id !== genre.id)
                  )
                }
              >
                <Text style={styles.chipText}>{genre.name} ✕</Text>
              </TouchableOpacity>
            ))}
            {selectedRatings.map((rating) => (
              <TouchableOpacity
                key={rating}
                style={styles.chip}
                onPress={() =>
                  setSelectedRatings((prev) => prev.filter((r) => r !== rating))
                }
              >
                <Text style={styles.chipText}>{rating} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {moviesLoading || favoritesLoading ? (
        <ActivityIndicator size="large" color={colors.text} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 12,
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          renderItem={({ item }) => (
            <View style={{ flex: 1, marginHorizontal: 4 }}>
              <MovieCard
                movie={item}
                liked={favorites.some((fav) => fav.id === item.id)}
                onPress={() =>
                  navigation.navigate("MovieDetail", { movieId: item.id })
                }
                onToggleLike={() => toggleLike(item)}
              />
            </View>
          )}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 14,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    color: colors.text,
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 16,
  },
});

export default SearchScreen;
