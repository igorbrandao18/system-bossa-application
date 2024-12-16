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
import { Seat, SeatStatus } from '../../types/api.types';
import { Ionicons } from '@expo/vector-icons';

export const SeatSelectionScreen = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { showtimeId } = route.params as { showtimeId: string };

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await api.get(`/showtimes/${showtimeId}/seats`);
        setSeats(response.data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [showtimeId]);

  const handleSeatPress = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      if (prev.length >= 6) {
        Alert.alert('Maximum Seats', 'You can select up to 6 seats');
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const getSeatColor = (status: SeatStatus, isSelected: boolean) => {
    if (isSelected) return '#E50914';
    switch (status) {
      case 'available':
        return '#1a1a1a';
      case 'occupied':
        return '#333';
      case 'reserved':
        return '#666';
      default:
        return '#333';
    }
  };

  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    const isDisabled = seat.status !== 'available';

    return (
      <TouchableOpacity
        key={seat.id}
        style={[
          styles.seat,
          {
            backgroundColor: getSeatColor(seat.status, isSelected),
          },
        ]}
        onPress={() => handleSeatPress(seat.id)}
        disabled={isDisabled}
      >
        <Text style={styles.seatText}>{`${seat.row}${seat.number}`}</Text>
      </TouchableOpacity>
    );
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Select Seats', 'Please select at least one seat');
      return;
    }

    navigation.navigate('BookingConfirmation', {
      showtimeId,
      selectedSeats,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.seatsContainer}>
        <View style={styles.screen}>
          <Text style={styles.screenText}>SCREEN</Text>
        </View>

        <View style={styles.seatsGrid}>
          {seats.map((seat) => renderSeat(seat))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, { backgroundColor: '#1a1a1a' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, { backgroundColor: '#E50914' }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, { backgroundColor: '#333' }]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>
            Selected: {selectedSeats.length} seats
          </Text>
          <Text style={styles.totalText}>
            Total: $ {(selectedSeats.length * 10).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  seatsContainer: {
    flex: 1,
    padding: 16,
  },
  screen: {
    height: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  screenText: {
    color: '#666',
    fontSize: 12,
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  seat: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  seatText: {
    color: '#fff',
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  selectedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectedText: {
    color: '#fff',
    fontSize: 16,
  },
  totalText: {
    color: '#E50914',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 