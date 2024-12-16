import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/movies/HomeScreen';
import { MovieDetailsScreen } from '../screens/movies/MovieDetailsScreen';
import { ShowtimesScreen } from '../screens/showtimes/ShowtimesScreen';
import { SeatSelectionScreen } from '../screens/bookings/SeatSelectionScreen';
import { BookingConfirmationScreen } from '../screens/bookings/BookingConfirmationScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MoviesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="MovieDetails" 
      component={MovieDetailsScreen}
      options={{ title: '' }}
    />
    <Stack.Screen 
      name="Showtimes" 
      component={ShowtimesScreen}
      options={{ title: 'Select Showtime' }}
    />
    <Stack.Screen 
      name="SeatSelection" 
      component={SeatSelectionScreen}
      options={{ title: 'Select Seats' }}
    />
    <Stack.Screen 
      name="BookingConfirmation" 
      component={BookingConfirmationScreen}
      options={{ title: 'Confirm Booking' }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#000',
        borderTopColor: '#222',
      },
      tabBarActiveTintColor: '#E50914',
      tabBarInactiveTintColor: '#666',
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: '#fff',
    }}
  >
    <Tab.Screen
      name="Movies"
      component={MoviesStack}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="film-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const { signed } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!signed ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="MainApp" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}; 