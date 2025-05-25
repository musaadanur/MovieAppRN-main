import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getLikedMovies, removeLikedMovie } from "../services/firebase";
import {
  fetchFavoritesStart,
  fetchFavoritesSuccess,
  fetchFavoritesFailure,
  removeFromFavorites,
} from "../state/slices/favoriteSlice";
import colors from "../theme/colors";
import MovieCard from "../components/MovieCard";
import ScreenWrapper from "../components/ScreenWrapper";
import SearchBar from "../components/SearchBar";
import SearchFilterSelector from "../components/SearchFilterSelector";
import GenreAndRatingSelector from "../components/GenreAndRatingSelector";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.43;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const FavoritesScreen = ({ navigation }) => {
  const [mode, setMode] = useState("search");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const dispatch = useDispatch();
  const { favorites, loading } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadFavorites();
      }
    }, [user])
  );

  useEffect(() => {
    if (favorites) {
      filterMovies();
    }
  }, [selectedGenres, selectedRatings, favorites]);

  const loadFavorites = async () => {
    try {
      dispatch(fetchFavoritesStart());
      const movies = await getLikedMovies(user.uid);
      dispatch(fetchFavoritesSuccess(movies));
    } catch (error) {
      console.error("Load Favorites Error:", error);
      dispatch(fetchFavoritesFailure(error.message));
    }
  };

  const filterMovies = () => {
    let filtered = [...favorites];

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids.some((id) =>
          selectedGenres.some((genre) => genre.id === id)
        )
      );
    }

    if (selectedRatings.length > 0) {
      const minRating = Math.min(
        ...selectedRatings.map((r) => parseInt(r.replace("+", "")))
      );
      filtered = filtered.filter((movie) => movie.vote_average >= minRating);
    }

    setFilteredMovies(filtered);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredMovies(favorites);
      return;
    }

    const filtered = favorites.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const handleUnlike = async (movieId) => {
    try {
      await removeLikedMovie(user.uid, movieId);
      dispatch(removeFromFavorites(movieId));
    } catch (error) {
      console.error("Unlike Error:", error);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedGenres([]);
    setSelectedRatings([]);
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading favorites...</Text>
        </View>
      );
    }

    if (filteredMovies.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No movies found</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper>
      <SearchFilterSelector mode={mode} setMode={handleModeChange} />

      {mode === "search" && (
        <SearchBar
          onSearch={handleSearch}
          onClear={() => setFilteredMovies(favorites)}
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

      <FlatList
        data={filteredMovies}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginHorizontal: 4 }}>
            <MovieCard
              movie={item}
              liked={true}
              onPress={() =>
                navigation.navigate("MovieDetail", { movie: item })
              }
              onToggleLike={() => handleUnlike(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        ListEmptyComponent={renderEmptyState}
      />
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

export default FavoritesScreen;
