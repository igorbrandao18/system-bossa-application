import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageBackground,
  Platform,
  StatusBar,
  Animated,
  Easing,
  Alert,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '../../services/api';

const CINEMA_BACKGROUND = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LoginScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0.7)).current;

  // Refs for TextInputs
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        emailInputRef.current?.focus();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const breathingAnimation = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.9,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => breathingAnimation());
    };

    breathingAnimation();
  }, [fadeAnim]);

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', { email, password });
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  };

  const handleRegister = async () => {
    try {
      console.log('Attempting register with:', { email, password, name });
      await api.post('/auth/register', {
        email,
        password,
        name,
      });
      Alert.alert('Success', 'Account created successfully! Please login.');
      setIsRegistering(false);
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const handleSubmitEditing = (field: 'name' | 'email' | 'password') => {
    switch (field) {
      case 'name':
        emailInputRef.current?.focus();
        break;
      case 'email':
        passwordInputRef.current?.focus();
        break;
      case 'password':
        isRegistering ? handleRegister() : handleLogin();
        break;
    }
  };

  const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: CINEMA_BACKGROUND }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <AnimatedGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
          style={[styles.gradient, { opacity: fadeAnim }]}
        />
      </ImageBackground>
      
      <KeyboardAvoidingView 
        style={styles.formWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>CINEMA</Text>
            </View>

            <View style={styles.formContainer}>
              {isRegistering && (
                <TextInput
                  ref={nameInputRef}
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#8c8c8c"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => handleSubmitEditing('name')}
                  blurOnSubmit={false}
                  keyboardType="default"
                  textContentType="name"
                />
              )}
              <TextInput
                ref={emailInputRef}
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8c8c8c"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => handleSubmitEditing('email')}
                blurOnSubmit={false}
                textContentType="emailAddress"
              />
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8c8c8c"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={() => handleSubmitEditing('password')}
                blurOnSubmit={true}
                textContentType="password"
              />
              <TouchableOpacity
                style={styles.loginButton}
                onPress={isRegistering ? handleRegister : handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {isRegistering ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {!isRegistering && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>
                  {isRegistering ? 'Already have an account? ' : 'New to Cinema? '}
                </Text>
                <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                  <Text style={styles.signupLink}>
                    {isRegistering ? 'Sign In' : 'Sign up now'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  formWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: SCREEN_HEIGHT,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#E50914',
    letterSpacing: 2,
  },
  formContainer: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: 'rgba(51, 51, 51, 0.8)',
    borderRadius: 4,
    padding: 15,
    marginBottom: 15,
    color: '#FFFFFF',
    fontSize: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginButton: {
    backgroundColor: '#E50914',
    borderRadius: 4,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#8c8c8c',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  signupText: {
    color: '#8c8c8c',
    fontSize: 14,
  },
  signupLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 