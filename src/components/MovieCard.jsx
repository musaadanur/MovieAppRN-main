import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const MovieCard = ({ movie, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.image}
      />
      <Text style={styles.title} numberOfLines={1}>
        {movie.title}
      </Text>
      <Text style={styles.date}>{movie.release_date}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 8,
  },
  image: {
    height: 220,
    borderRadius: 6,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "bold",
  },
  date: {
    color: "#aaa",
    fontSize: 12,
  },
});

export default MovieCard;
