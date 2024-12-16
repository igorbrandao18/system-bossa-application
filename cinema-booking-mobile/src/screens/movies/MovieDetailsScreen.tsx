import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../../services/api';
import { Movie } from '../../types/api.types';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Showtime {
  id: string;
  startTime: string;
  endTime: string;
  room: string;
  price: string;
  availableSeats: number;
}

interface MovieDetails extends Movie {
  genres: Array<{ id: string; name: string }>;
  runtime?: number;
  voteAverage?: number;
}

export const MovieDetailsScreen = () => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params as { movieId: string };

  useEffect(() => {
    const fetchMovieAndShowtimes = async () => {
      try {
        const [movieResponse, showtimesResponse] = await Promise.all([
          api.get(`/movies/${movieId}`),
          api.get(`/showtimes/movie/${movieId}`),
        ]);

        console.log('Movie details:', movieResponse.data);
        console.log('Showtimes response raw data:', JSON.stringify(showtimesResponse.data, null, 2));
        
        if (showtimesResponse.data && showtimesResponse.data.length > 0) {
          console.log('First showtime details:', {
            id: showtimesResponse.data[0].id,
            startTime: showtimesResponse.data[0].startTime,
            priceHalf: showtimesResponse.data[0].priceHalf,
            priceFull: showtimesResponse.data[0].priceFull,
            allProps: Object.keys(showtimesResponse.data[0])
          });
        }

        if (!showtimesResponse.data || !Array.isArray(showtimesResponse.data)) {
          console.error('Invalid showtimes data:', showtimesResponse.data);
          setShowtimes([]);
        } else {
          setShowtimes(showtimesResponse.data);
        }

        setMovie(movieResponse.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        Alert.alert(
          'Erro',
          'Não foi possível carregar os detalhes do filme. Tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShowtimes();
  }, [movieId]);

  const formatTime = (date: string) => {
    return format(new Date(date), 'HH:mm');
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number') return 'N/A';
    if (value === 0) return 'Preço a definir';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const renderShowtimes = () => {
    // Group showtimes by date
    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
      const date = format(new Date(showtime.startTime), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(showtime);
      return acc;
    }, {} as Record<string, Showtime[]>);

    return Object.entries(groupedShowtimes).map(([date, sessions]) => (
      <View key={date} style={styles.dateSection}>
        <Text style={styles.dateTitle}>
          {formatDate(date)}
        </Text>
        <View style={styles.showtimesList}>
          {sessions.map((showtime) => (
            <TouchableOpacity
              key={showtime.id}
              style={styles.showtimeCard}
              onPress={() => {
                console.log('Showtime selected:', showtime);
                navigation.navigate('SeatSelection', {
                  showtimeId: showtime.id,
                  movieId,
                });
              }}
            >
              <View style={styles.showtimeHeader}>
                <Text style={styles.timeText}>{formatTime(showtime.startTime)}</Text>
                <Text style={styles.roomText}>Sala {showtime.room}</Text>
              </View>
              
              <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Preço</Text>
                  <Text style={styles.priceValue}>
                    {formatCurrency(parseFloat(showtime.price))}
                  </Text>
                </View>
              </View>

              <View style={styles.seatsInfo}>
                <Ionicons name="seat-outline" size={16} color="#999" />
                <Text style={styles.seatsText}>
                  {showtime.availableSeats} lugares disponíveis
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ));
  };

  if (loading || !movie) {
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
      <ScrollView style={styles.container} bounces={false}>
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w780${movie.backdropPath}` }}
            style={styles.backdrop}
          />
          <LinearGradient
            colors={['transparent', '#000']}
            style={styles.gradient}
          />
          <View style={styles.headerContent}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w342${movie.posterPath}` }}
              style={styles.poster}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>
                  {typeof movie.voteAverage === 'number' ? movie.voteAverage.toFixed(1) : 'N/A'}
                </Text>
              </View>
              {movie.genres && (
                <Text style={styles.genres}>
                  {movie.genres.map(g => g.name).join(' • ')}
                </Text>
              )}
              {movie.runtime && (
                <Text style={styles.runtime}>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Sinopse</Text>
          <Text style={styles.overview}>{movie.overview}</Text>

          <Text style={[styles.sectionTitle, styles.showtimesTitle]}>Sessões Disponíveis</Text>
          {showtimes.length > 0 ? (
            renderShowtimes()
          ) : (
            <Text style={styles.noShowtimes}>
              Não há sessões disponíveis para este filme.
            </Text>
          )}
        </View>
      </ScrollView>
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
  headerContainer: {
    height: 300,
    width: '100%',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  genres: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  runtime: {
    color: '#999',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overview: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  showtimesTitle: {
    marginTop: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  showtimesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  showtimeCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    width: (SCREEN_WIDTH - 44) / 2,
  },
  showtimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomText: {
    color: '#999',
    fontSize: 14,
  },
  priceContainer: {
    marginVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    color: '#999',
    fontSize: 14,
  },
  priceValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  seatsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 8,
  },
  seatsText: {
    color: '#999',
    fontSize: 12,
    marginLeft: 4,
  },
  noShowtimes: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
}); 