import { DefaultTheme } from '@react-navigation/native';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    border: '#d0d0d0',
    notification: '#dc004e',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};
