import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../../services/api';
import { Movie, Showtime, Seat } from '../../types/api.types';
import { format } from 'date-fns';

interface BookingDetails {
  movie: Movie;
  showtime: Showtime;
  seats: Seat[];
}

export const BookingConfirmationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<BookingDetails | null>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { showtimeId, selectedSeats } = route.params as {
    showtimeId: string;
    selectedSeats: string[];
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const [showtimeResponse, seatsResponse] = await Promise.all([
          api.get(`/showtimes/${showtimeId}`),
          api.get(`/showtimes/${showtimeId}/seats`),
        ]);

        const showtime = showtimeResponse.data;
        const movieResponse = await api.get(`/movies/${showtime.movieId}`);

        setDetails({
          movie: movieResponse.data,
          showtime: showtime,
          seats: seatsResponse.data.filter((seat: Seat) =>
            selectedSeats.includes(seat.id)
          ),
        });
      } catch (error) {
        console.error('Error fetching booking details:', error);
        Alert.alert('Error', 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [showtimeId, selectedSeats]);

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      await api.post('/bookings', {
        showtimeId,
        seats: selectedSeats,
      });

      Alert.alert(
        'Success',
        'Your booking has been confirmed!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error confirming booking:', error);
      Alert.alert('Error', 'Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !details) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  const totalAmount = details.seats.length * details.showtime.price;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Booking Summary</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Movie</Text>
          <Text style={styles.movieTitle}>{details.movie.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Showtime</Text>
          <Text style={styles.info}>
            {format(new Date(details.showtime.startTime), 'MMMM d, yyyy')}
          </Text>
          <Text style={styles.info}>
            {format(new Date(details.showtime.startTime), 'h:mm a')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seats</Text>
          <View style={styles.seatsContainer}>
            {details.seats.map((seat) => (
              <View key={seat.id} style={styles.seatBadge}>
                <Text style={styles.seatText}>
                  {seat.row}
                  {seat.number}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Tickets ({details.seats.length})</Text>
            <Text style={styles.paymentAmount}>
              $ {(details.seats.length * details.showtime.price).toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Booking Fee</Text>
            <Text style={styles.paymentAmount}>$ 1.00</Text>
          </View>
          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              $ {(totalAmount + 1).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  seatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seatBadge: {
    backgroundColor: '#E50914',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  seatText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    color: '#fff',
    fontSize: 16,
  },
  paymentAmount: {
    color: '#fff',
    fontSize: 16,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#E50914',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  confirmButton: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 