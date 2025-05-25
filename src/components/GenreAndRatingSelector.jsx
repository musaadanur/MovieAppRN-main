import React, { useEffect, useState } from "react";
import { View, Text, Modal, FlatList, StyleSheet } from "react-native";
import colors from "../theme/colors";
import { fetchGenres } from "../services/api";
import Button from "./Button"; 

const ratings = ["9+", "8+", "7+", "6+", "5+", "4+", "3+", "2+", "1+"];

const GenreAndRatingSelector = ({
  selectedGenres,
  setSelectedGenres,
  selectedRatings,
  setSelectedRatings,
}) => {
  const [genres, setGenres] = useState([]);
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        console.log("genre fetch error:", error);
      }
    };

    loadGenres();
  }, []);

  const toggleGenre = (genre) => {
    const exists = selectedGenres.some((g) => g.id === genre.id);
    if (exists) {
      setSelectedGenres((prev) => prev.filter((g) => g.id !== genre.id));
    } else {
      setSelectedGenres((prev) => [...prev, genre]);
    }
  };

  const toggleRating = (value) => {
    const exists = selectedRatings.includes(value);
    if (exists) {
      setSelectedRatings((prev) => prev.filter((r) => r !== value));
    } else {
      setSelectedRatings((prev) => [...prev, value]);
    }
  };

  return (
    <>
      <View style={styles.row}>
        <Button
          title="Genre"
          type="secondary"
          onPress={() => setGenreModalVisible(true)}
        />
        <Button
          title="Rating"
          type="secondary"
          onPress={() => setRatingModalVisible(true)}
        />
      </View>

      {/* Genre Modal */}
      <Modal visible={genreModalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Film Türü Seç</Text>
            <FlatList
              data={genres}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Button
                  title={item.name}
                  onPress={() => toggleGenre(item)}
                  type={
                    selectedGenres.some((g) => g.id === item.id)
                      ? "primary"
                      : "secondary"
                  }
                  style={{ marginBottom: 8 }}
                />
              )}
            />
            <Button
              title="Kapat"
              onPress={() => setGenreModalVisible(false)}
              type="primary"
            />
          </View>
        </View>
      </Modal>

      {/* Rating Modal */}
      <Modal visible={ratingModalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Minimum Puan Seç</Text>
            <FlatList
              data={ratings}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Button
                  title={item}
                  onPress={() => toggleRating(item)}
                  type={
                    selectedRatings.includes(item) ? "primary" : "secondary"
                  }
                  style={{ marginBottom: 8 }}
                />
              )}
            />
            <Button
              title="Kapat"
              onPress={() => setRatingModalVisible(false)}
              type="primary"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginHorizontal: 14,
    marginBottom: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
});

export default GenreAndRatingSelector;
