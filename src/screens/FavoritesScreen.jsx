import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
} from "react-native";
import { getLikedMovies, removeLikedMovie } from "../services/firebase";
import { auth } from "../services/firebase";
import MovieCard from "../components/MovieCard";
import ScreenWrapper from "../components/ScreenWrapper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import colors from "../theme/colors";
import SearchFilterSelector from "../components/SearchFilterSelector";
import GenreAndRatingSelector from "../components/GenreAndRatingSelector";
import SearchBar from "../components/SearchBar";
import { searchMovies } from "../services/api";

const FavoritesScreen = () => {
  const navigation = useNavigation();

  const [mode, setMode] = useState("search");
  const [query, setQuery] = useState("");
  const [likedMovies, setLikedMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLiked = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const liked = await getLikedMovies(uid);
        setLikedMovies(liked);
        setFiltered(liked);
      };

      fetchLiked();
    }, [])
  );

  useEffect(() => {
    if (mode !== "filter") return setFiltered(likedMovies);

    const genreIds = selectedGenres.map((g) => g.id);
    const ratingsNumbers = selectedRatings.map((r) =>
      parseInt(r.replace("+", ""))
    );
    const minRating =
      ratingsNumbers.length > 0 ? Math.min(...ratingsNumbers) : 0;

    const result = likedMovies.filter((movie) => {
      const matchGenre =
        genreIds.length === 0 ||
        (Array.isArray(movie.genre_ids) &&
          movie.genre_ids.some((id) => genreIds.includes(id)));

      const matchRating =
        ratingsNumbers.length === 0 || movie.vote_average >= minRating;

      return matchGenre && matchRating;
    });

    setFiltered(result);
  }, [likedMovies, selectedGenres, selectedRatings, mode]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await searchMovies(query.trim());
      const likedIds = likedMovies.map((m) => m.id);
      const matched = results.filter((m) => likedIds.includes(m.id));
      setFiltered(matched);
    } catch (error) {
      console.log("Search error in favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = (movie) => {
    Alert.alert(
      "Favoriden çıkarılsın mı?",
      "Bu filmi beğenmekten vazgeçiyorsun. Emin misin?",
      [
        { text: "Hayır", style: "cancel" },
        {
          text: "Evet",
          onPress: async () => {
            const uid = auth.currentUser?.uid;
            await removeLikedMovie(uid, movie.id);
            setLikedMovies((prev) => prev.filter((m) => m.id !== movie.id));
            setFiltered((prev) => prev.filter((m) => m.id !== movie.id));
            if (Platform.OS === "android") {
              ToastAndroid.show("Favorilerden kaldırıldı", ToastAndroid.SHORT);
            }
          },
        },
      ]
    );
  };

  const dataWithPlaceholder =
    filtered.length % 2 === 1
      ? [...filtered, { isPlaceholder: true, id: "placeholder" }]
      : filtered;

  const renderItem = ({ item }) => {
    if (item.isPlaceholder) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.placeholder}
        >
          <Text style={styles.placeholderText}>
            + Beğenebileceğin filmleri keşfet
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <MovieCard
        movie={item}
        liked={true}
        onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
        onToggleLike={() => handleUnlike(item)}
      />
    );
  };

  return (
    <ScreenWrapper>
      <SearchFilterSelector
        mode={mode}
        setMode={(newMode) => {
          setMode(newMode);
          setQuery("");
          setSelectedGenres([]);
          setSelectedRatings([]);
          setFiltered(likedMovies);
        }}
      />

      {mode === "search" && (
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          onClear={() => setFiltered(likedMovies)}
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

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {likedMovies.length === 0
              ? "Henüz hiç favori film eklemedin."
              : "Seçtiğin filtrelere uygun film bulunamadı."}
          </Text>
        </View>
      )}

      <FlatList
        data={dataWithPlaceholder}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginHorizontal: 4 }}>
            {renderItem({ item })}
          </View>
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    aspectRatio: 2 / 3,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.mutedText,
    fontSize: 12,
    paddingHorizontal: 8,
    textAlign: "center",
  },
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 14,
    textAlign: "center",
  },
});

export default FavoritesScreen;
