import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MovieListScreen } from '../screens/MovieListScreen';

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const { signed } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!signed ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Home' }}
            />
            <Stack.Screen 
              name="MovieList" 
              component={MovieListScreen} 
              options={{ title: 'Movies' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 