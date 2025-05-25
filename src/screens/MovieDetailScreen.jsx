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
import { useRoute } from "@react-navigation/native";
import { fetchMovieDetails, fetchMovieCredits } from "../services/api";
import {
  addLikedMovie,
  getLikedMovies,
  removeLikedMovie,
} from "../services/firebase";
import { auth } from "../services/firebase";
import colors from "../theme/colors";
import Ionicons from "react-native-vector-icons/Ionicons";

let lastTap = 0;

const MovieDetailScreen = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [cast, setCast] = useState([]);

  const route = useRoute();
  const { movieId } = route.params;

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await fetchMovieDetails(movieId);
        setMovie(data);
        const credits = await fetchMovieCredits(movieId);
        setCast(credits.cast?.slice(0, 10) || []);
      } catch (error) {
        console.error("Movie detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, []);

  useEffect(() => {
    const checkIfLiked = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid || !movie) return;

      const likedList = await getLikedMovies(uid);
      const alreadyLiked = likedList.some((m) => m.id === movie.id);
      setLiked(alreadyLiked);
    };

    if (movie) checkIfLiked();
  }, [movie]);

  const handleLike = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !movie) return;

    try {
      if (liked) {
        await removeLikedMovie(uid, movie.id);
        setLiked(false);
      } else {
        await addLikedMovie(uid, {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          genre_ids: movie.genres?.map((g) => g.id) || [],
          vote_average: movie.vote_average,
        });
        setLiked(true);
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
          <TouchableOpacity style={styles.heartIcon} onPress={handleLike}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={32}
              color={colors.secondary}
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
  heartIcon: {
    position: "absolute",
    bottom: 32,
    right: 16,
    backgroundColor: "#00000080",
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
    fontWeight: 400,
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
