import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../../services/api';
import { Showtime } from '../../types/api.types';
import { format } from 'date-fns';

export const ShowtimesScreen = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params as { movieId: string };

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await api.get(`/showtimes/movie/${movieId}`);
        setShowtimes(response.data);
      } catch (error) {
        console.error('Error fetching showtimes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  const renderShowtime = ({ item }: { item: Showtime }) => (
    <TouchableOpacity
      style={styles.showtimeCard}
      onPress={() =>
        navigation.navigate('SeatSelection', {
          showtimeId: item.id,
          movieId,
        })
      }
    >
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {format(new Date(item.startTime), 'h:mm a')}
        </Text>
        <Text style={styles.date}>
          {format(new Date(item.startTime), 'MMM d, yyyy')}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.seats}>
          {item.availableSeats} seats available
        </Text>
        <Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={showtimes}
        renderItem={renderShowtime}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No showtimes available</Text>
          </View>
        }
      />
    </View>
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
  list: {
    padding: 16,
  },
  showtimeCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  infoContainer: {
    alignItems: 'flex-end',
  },
  seats: {
    color: '#999',
    fontSize: 14,
  },
  price: {
    color: '#E50914',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
}); 