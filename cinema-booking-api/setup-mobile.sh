#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📱 Iniciando setup do Cinema Booking Mobile App...${NC}"

# Criar projeto Expo
echo -e "${GREEN}🏗️  Criando projeto Expo...${NC}"
npx create-expo-app cinema-booking-mobile --template expo-template-blank-typescript
cd cinema-booking-mobile

# Instalar dependências do Expo
echo -e "${GREEN}📦 Instalando dependências do Expo...${NC}"
npx expo install \
  expo-status-bar \
  expo-font \
  expo-splash-screen \
  expo-updates \
  expo-secure-store \
  expo-image \
  expo-linear-gradient \
  expo-notifications \
  expo-linking \
  expo-web-browser \
  expo-auth-session \
  expo-crypto

# Instalar dependências de navegação
echo -e "${GREEN}📦 Instalando dependências de navegação...${NC}"
npm install \
  @react-navigation/native \
  @react-navigation/native-stack \
  @react-navigation/bottom-tabs \
  react-native-screens \
  react-native-safe-area-context

# Instalar dependências UI
echo -e "${GREEN}📦 Instalando bibliotecas UI...${NC}"
npm install \
  @rneui/themed @rneui/base \
  react-native-paper \
  react-native-vector-icons \
  react-native-reanimated \
  react-native-gesture-handler \
  react-native-modal \
  react-native-calendars \
  lottie-react-native

# Instalar outras dependências
echo -e "${GREEN}📦 Instalando outras dependências...${NC}"
npm install \
  @tanstack/react-query \
  axios \
  date-fns \
  yup \
  @hookform/resolvers \
  react-hook-form \
  zustand \
  @aws-amplify/core \
  @aws-amplify/auth \
  react-native-dotenv

# Instalar dependências de desenvolvimento
echo -e "${GREEN}📦 Instalando dependências de desenvolvimento...${NC}"
npm install -D \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  @types/react-native-vector-icons \
  eslint \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  prettier \
  @types/node

# Criar estrutura de diretórios
echo -e "${GREEN}📁 Criando estrutura de diretórios...${NC}"
mkdir -p \
  src/assets/images \
  src/assets/animations \
  src/components/common \
  src/components/movies \
  src/components/bookings \
  src/components/profile \
  src/components/auth \
  src/hooks \
  src/navigation \
  src/screens/auth \
  src/screens/movies \
  src/screens/bookings \
  src/screens/profile \
  src/services \
  src/utils \
  src/store \
  src/types \
  src/config \
  src/theme

# Criar arquivo de configuração do ESLint
echo -e "${GREEN}⚙️  Criando arquivo de configuração do ESLint...${NC}"
cat > .eslintrc.json << EOL
{
  "env": {
    "browser": true,
    "es2021": true,
    "react-native/react-native": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-native",
    "@typescript-eslint",
    "react-hooks"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react-native/no-unused-styles": "error",
    "react-native/no-inline-styles": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
EOL

# Criar arquivo de configuração do Prettier
echo -e "${GREEN}⚙️  Criando arquivo de configuração do Prettier...${NC}"
cat > .prettierrc << EOL
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "endOfLine": "auto"
}
EOL

# Criar arquivo de variáveis de ambiente
echo -e "${GREEN}📝 Criando arquivo .env...${NC}"
cat > .env << EOL
API_URL=http://localhost:3000/api
APP_NAME="Cinema Booking"
TMDB_API_KEY=your_tmdb_api_key
AWS_REGION=us-east-1
AWS_USER_POOL_ID=your_user_pool_id
AWS_USER_POOL_WEB_CLIENT_ID=your_client_id
EOL

# Criar arquivo .env.example
cp .env .env.example

# Criar arquivo de configuração do TypeScript
echo -e "${GREEN}⚙️  Atualizando configuração do TypeScript...${NC}"
cat > tsconfig.json << EOL
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
EOL

# Criar arquivo de tema
echo -e "${GREEN}📝 Criando arquivo de tema...${NC}"
cat > src/theme/index.ts << EOL
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
EOL

# Criar arquivo de navegação
echo -e "${GREEN}📝 Criando arquivo de navegação...${NC}"
cat > src/navigation/index.tsx << EOL
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Add your screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
EOL

# Atualizar arquivo principal
echo -e "${GREEN}📝 Atualizando arquivo principal...${NC}"
cat > App.tsx << EOL
import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Navigation } from './src/navigation';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    // Add your custom fonts here
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Navigation />
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
EOL

# Atualizar app.json
echo -e "${GREEN}📝 Atualizando app.json...${NC}"
cat > app.json << EOL
{
  "expo": {
    "name": "Cinema Booking",
    "slug": "cinema-booking-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.cinemabooking"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.cinemabooking"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store",
      "expo-notifications"
    ]
  }
}
EOL

# Atualizar .gitignore
echo -e "${GREEN}📝 Atualizando .gitignore...${NC}"
cat > .gitignore << EOL
node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env

# macOS
.DS_Store

# VSCode
.vscode/
EOL

# Atualizar package.json com scripts úteis
echo -e "${GREEN}📝 Atualizando package.json...${NC}"
npm pkg set scripts.start="expo start"
npm pkg set scripts.android="expo start --android"
npm pkg set scripts.ios="expo start --ios"
npm pkg set scripts.web="expo start --web"
npm pkg set scripts.lint="eslint . --ext .js,.jsx,.ts,.tsx"
npm pkg set scripts.format="prettier --write 'src/**/*.{ts,tsx}'"

echo -e "${BLUE}✅ Setup do app mobile concluído! Para iniciar o projeto:${NC}"
echo -e "${GREEN}1. npm install${NC}"
echo -e "${GREEN}2. npm start${NC}"
echo -e "${GREEN}3. Pressione a para abrir no Android ou i para iOS${NC}"
echo -e "${BLUE}📱 Certifique-se de ter o Expo Go instalado no seu dispositivo móvel${NC}" 