import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../theme/colors";

const MovieCard = ({ movie, liked, onToggleLike, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={styles.card}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          style={styles.image}
        />

        {/* Sağ üst köşe: Kalp ve metin */}
        <View style={styles.topRight}>
          {liked && <Text style={styles.likedText}>Bu filmi beğendin</Text>}
          <TouchableOpacity onPress={onToggleLike} style={styles.heartIcon}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={colors.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Sol alt köşe: Film adı + tarih */}
        <View style={styles.bottomLeft}>
          <Text style={styles.title} numberOfLines={1}>
            {movie.title}
          </Text>
          <Text style={styles.date}>{movie.release_date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.background,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  topRight: {
    position: "absolute",
    top: 8,
    right: 8,
    alignItems: "flex-end",
  },
  heartIcon: {
    backgroundColor: "#00000080",
    borderRadius: 14,
    padding: 4,
    marginBottom: 4,
  },
  likedText: {
    fontSize: 10,
    color: colors.text,
    backgroundColor: "#00000050",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bottomLeft: {
    position: "absolute",
    left: 8,
    bottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 2,
    maxWidth: 120,
  },
  date: {
    color: colors.mutedText,
    fontSize: 11,
  },
});

export default MovieCard;
