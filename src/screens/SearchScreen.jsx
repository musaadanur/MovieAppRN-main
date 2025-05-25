import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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

const SearchScreen = () => {
  const navigation = useNavigation();

  const [mode, setMode] = useState("search");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedIds, setLikedIds] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLikes = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const liked = await getLikedMovies(uid);
        setLikedIds(liked.map((m) => m.id));
      };

      fetchLikes();
    }, [])
  );

  useEffect(() => {
    if (mode !== "filter") return;
    if (selectedGenres.length === 0 && selectedRatings.length === 0) {
      setResults([]);
      return;
    }

    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const genreIds = selectedGenres.map((g) => g.id).join(",");
        const ratingsNumbers = selectedRatings.map((r) =>
          parseInt(r.replace("+", ""))
        );
        const minRating =
          ratingsNumbers.length > 0 ? Math.min(...ratingsNumbers) : 0;

        const data = await discoverMovies(genreIds, minRating);
        setResults(data);
      } catch (error) {
        console.log("discover error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [selectedGenres, selectedRatings, mode]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchMovies(query.trim());
      setResults(data);
    } catch (error) {
      console.log("search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (movie) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const isLiked = likedIds.includes(movie.id);

    if (isLiked) {
      await removeLikedMovie(uid, movie.id);
      setLikedIds((prev) => prev.filter((id) => id !== movie.id));
    } else {
      await addLikedMovie(uid, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        genre_ids: movie.genre_ids || [],
        vote_average: movie.vote_average,
      });
      setLikedIds((prev) => [...prev, movie.id]);
    }

    if (Platform.OS === "android") {
      ToastAndroid.show(
        isLiked ? "Beğeni kaldırıldı" : "Film beğenildi",
        ToastAndroid.SHORT
      );
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setQuery("");
    setResults([]);
    setSelectedGenres([]);
    setSelectedRatings([]);
  };

  return (
    <ScreenWrapper>
      <SearchFilterSelector mode={mode} setMode={handleModeChange} />

      {mode === "search" && (
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          onClear={() => setResults([])}
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

      {loading ? (
        <ActivityIndicator size="large" color={colors.text} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 12,
          }}
          renderItem={({ item }) => (
            <View style={{ flex: 1, marginHorizontal: 4 }}>
              <MovieCard
                movie={item}
                liked={likedIds.includes(item.id)}
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
});

export default SearchScreen;
