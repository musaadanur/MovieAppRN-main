import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native"; // updated
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails, fetchMovieCredits } from "../services/api";
import { addLikedMovie, removeLikedMovie } from "../services/firebase";
import { auth } from "../services/firebase";
import colors from "../theme/colors";
import {
  setSelectedMovie,
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
} from "../state/slices/movieSlice";
import {
  addToFavorites,
  removeFromFavorites,
} from "../state/slices/favoriteSlice";
import FavoriteIcon from "../assets/favorite.svg";

let lastTap = 0;

const MovieDetailScreen = () => {
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation(); // added
  const { movieId } = route.params;

  const { selectedMovie: movie } = useSelector((state) => state.movies);
  const { favorites } = useSelector((state) => state.favorites);
  const liked = movie ? favorites.some((fav) => fav.id === movie.id) : false;

  useEffect(() => {
    const loadDetails = async () => {
      try {
        dispatch(fetchMoviesStart());

        const movieData = await fetchMovieDetails(movieId);
        dispatch(setSelectedMovie(movieData));

        const credits = await fetchMovieCredits(movieId);
        setCast(credits.cast?.slice(0, 10) || []);

        dispatch(fetchMoviesSuccess({ results: [], page: 1, total_pages: 1 }));
      } catch (error) {
        console.error("Movie detail error:", error);
        dispatch(fetchMoviesFailure(error.message));
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [movieId]);

  const handleLike = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !movie) return;

    try {
      if (liked) {
        await removeLikedMovie(uid, movie.id);
        dispatch(removeFromFavorites(movie.id));
      } else {
        const movieData = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          genre_ids: movie.genre_ids || [],
          vote_average: movie.vote_average,
        };
        await addLikedMovie(uid, movieData);
        dispatch(addToFavorites(movieData));
      }
    } catch (error) {
      Alert.alert("Hata", "İşlem sırasında hata oluştu.");
      console.log("Firestore like toggle hatası:", error);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      handleLike();
    }
    lastTap = now;
  };

  if (loading || !movie) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableWithoutFeedback onPress={handleDoubleTap}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.image}
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.heartIcon} onPress={handleLike}>
            <FavoriteIcon
              width={28}
              height={28}
              fill={liked ? colors.secondary : colors.tabInactive}
            />
          </TouchableOpacity>

          {liked && <Text style={styles.likedText}>Bu filmi beğendin</Text>}
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.info}>Puan: {movie.vote_average} ⭐</Text>
        <Text style={styles.info}>Tarih: {movie.release_date}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>

        <Text style={[styles.title, { fontSize: 18, marginTop: 20 }]}>
          Oyuncular
        </Text>
        <FlatList
          data={cast}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 10 }}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <View style={styles.castItem}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w185${item.profile_path}`,
                }}
                style={styles.castImage}
              />
              <Text style={styles.castName}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 400,
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 16,
    backgroundColor: "#00000060",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    zIndex: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "300",
  },
  heartIcon: {
    position: "absolute",
    bottom: 32,
    right: 16,
    backgroundColor: "#00000040",
    borderRadius: 24,
    padding: 6,
  },
  likedText: {
    position: "absolute",
    bottom: 8,
    right: 16,
    fontSize: 12,
    color: colors.text,
    backgroundColor: "#00000080",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: "400",
  },
  content: {
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  info: {
    color: "#aaa",
    marginBottom: 4,
  },
  overview: {
    color: "#ddd",
    marginTop: 12,
    lineHeight: 22,
  },
  castItem: {
    alignItems: "center",
    width: 100,
  },
  castImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginBottom: 4,
  },
  castName: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});

export default MovieDetailScreen;
