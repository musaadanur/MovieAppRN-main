import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, View, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularMovies } from "../services/api";
import ScreenWrapper from "../components/ScreenWrapper";
import MovieCard from "../components/MovieCard";
import { useNavigation } from "@react-navigation/native";
import {
  addLikedMovie,
  getLikedMovies,
  removeLikedMovie,
} from "../services/firebase";
import { auth } from "../services/firebase";
import colors from "../theme/colors";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
} from "../state/slices/movieSlice";
import {
  fetchFavoritesStart,
  fetchFavoritesSuccess,
  fetchFavoritesFailure,
  addToFavorites,
  removeFromFavorites,
} from "../state/slices/favoriteSlice";

const ITEMS_PER_PAGE = 20;

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const { movies, loading: moviesLoading } = useSelector(
    (state) => state.movies
  );
  const { favorites, loading: favoritesLoading } = useSelector(
    (state) => state.favorites
  );

  const loadMovies = async () => {
    try {
      dispatch(fetchMoviesStart());
      const data = await fetchPopularMovies(1);
      dispatch(fetchMoviesSuccess({ results: data, page: 1, total_pages: 1 }));
    } catch (error) {
      console.error("API Error:", error);
      dispatch(fetchMoviesFailure(error.message));
      Alert.alert("Hata", "Filmler yüklenirken bir hata oluştu");
    }
  };

  const loadFavorites = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.log("No user ID available");
      return;
    }

    try {
      dispatch(fetchFavoritesStart());
      const liked = await getLikedMovies(uid);
      console.log("Loaded favorites:", liked);
      dispatch(fetchFavoritesSuccess(liked));
    } catch (error) {
      console.error("Favorites Error:", error);
      dispatch(fetchFavoritesFailure(error.message));
      Alert.alert("Hata", "Favori filmler yüklenirken bir hata oluştu");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen focused, loading data...");
      loadMovies();
      loadFavorites();
    }, [])
  );

  const loadMoreMovies = async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchPopularMovies(nextPage);

      if (data.length > 0) {
        dispatch(
          fetchMoviesSuccess({
            results: [...movies, ...data],
            page: nextPage,
            total_pages: 1,
          })
        );
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Load More Error:", error);
      Alert.alert("Hata", "Daha fazla film yüklenirken bir hata oluştu");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleToggleLike = async (movie) => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert("Hata", "Lütfen giriş yapın");
      return;
    }

    const isLiked = favorites.some((fav) => fav.id === movie.id);

    try {
      if (isLiked) {
        await removeLikedMovie(uid, movie.id);
        dispatch(removeFromFavorites(movie.id));
        Alert.alert("Başarılı", "Film favorilerden kaldırıldı");
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
        Alert.alert("Başarılı", "Film favorilere eklendi");
      }
    } catch (error) {
      console.error("Toggle Like Error:", error);
      Alert.alert(
        "Hata",
        error.message || "Film beğenme işlemi sırasında bir hata oluştu"
      );
    }
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

  if (moviesLoading || favoritesLoading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator
          size="large"
          color={colors.text}
          style={{ marginTop: 20 }}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={movies}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginHorizontal: 4 }}>
            <MovieCard
              movie={item}
              liked={favorites.some((fav) => fav.id === item.id)}
              onToggleLike={() => handleToggleLike(item)}
              onPress={() =>
                navigation.navigate("MovieDetail", { movieId: item.id })
              }
            />
          </View>
        )}
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;
