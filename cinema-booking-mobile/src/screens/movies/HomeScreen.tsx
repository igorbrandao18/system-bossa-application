import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  genres: Array<{ id: string; name: string }>;
}

export const HomeScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies');
      console.log('Movies response:', response.data[0]); // Debug log
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMovies();
  };

  const renderMovie = ({ item }: { item: Movie }) => {
    // Format vote average, handling undefined/null cases
    const rating = typeof item.voteAverage === 'number' 
      ? item.voteAverage.toFixed(1)
      : 'N/A';

    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
      >
        <Image
          source={{ 
            uri: item.posterPath 
              ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
              : 'https://via.placeholder.com/500x750?text=No+Poster'
          }}
          style={styles.poster}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{rating}</Text>
          </View>
          {item.genres && item.genres.length > 0 && (
            <Text style={styles.genres} numberOfLines={1}>
              {item.genres.map(g => g.name).join(', ')}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Now Playing</Text>
      </View>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.movieList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  movieList: {
    padding: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  poster: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    justifyContent: 'flex-end',
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
  genres: {
    color: '#999',
    fontSize: 10,
    marginTop: 4,
  },
}); 