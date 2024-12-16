#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎬 Iniciando setup do Cinema Booking System Admin Frontend...${NC}"

# Criar projeto React com Vite
echo -e "${GREEN}🏗️  Criando projeto React com Vite...${NC}"
npm create vite@latest cinema-booking-admin -- --template react-ts
cd cinema-booking-admin

# Instalar dependências
echo -e "${GREEN}📦 Instalando dependências...${NC}"
npm install

# Instalar dependências adicionais
echo -e "${GREEN}📦 Instalando bibliotecas adicionais...${NC}"
npm install \
  @mui/material @mui/icons-material @emotion/react @emotion/styled \
  @tanstack/react-query \
  @tanstack/react-table \
  axios \
  react-router-dom \
  react-hook-form \
  @hookform/resolvers \
  yup \
  date-fns \
  notistack \
  recharts \
  jwt-decode \
  @react-pdf/renderer \
  qrcode.react

# Instalar dependências de desenvolvimento
echo -e "${GREEN}📦 Instalando dependências de desenvolvimento...${NC}"
npm install -D \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  prettier \
  @types/node

# Criar estrutura de diretórios
echo -e "${GREEN}📁 Criando estrutura de diretórios...${NC}"
mkdir -p \
  src/assets \
  src/components/common \
  src/components/layout \
  src/components/forms \
  src/components/tables \
  src/components/charts \
  src/hooks \
  src/pages/auth \
  src/pages/dashboard \
  src/pages/movies \
  src/pages/theaters \
  src/pages/showtimes \
  src/pages/bookings \
  src/pages/users \
  src/pages/reports \
  src/services \
  src/utils \
  src/contexts \
  src/types \
  src/config

# Criar arquivo de configuração do ESLint
echo -e "${GREEN}⚙️  Criando arquivo de configuração do ESLint...${NC}"
cat > .eslintrc.json << EOL
{
  "env": {
    "browser": true,
    "es2021": true
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
    "@typescript-eslint",
    "react-hooks"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off"
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
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME="Cinema Booking Admin"
EOL

# Criar arquivo .env.example
cp .env .env.example

# Criar arquivo de configuração do TypeScript
echo -e "${GREEN}⚙️  Atualizando configuração do TypeScript...${NC}"
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOL

# Atualizar arquivo vite.config.ts
echo -e "${GREEN}⚙️  Atualizando configuração do Vite...${NC}"
cat > vite.config.ts << EOL
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
  },
});
EOL

# Criar arquivo de rotas
echo -e "${GREEN}📝 Criando arquivo de rotas...${NC}"
cat > src/routes.tsx << EOL
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
import Movies from '@/pages/movies/Movies';
import Theaters from '@/pages/theaters/Theaters';
import Showtimes from '@/pages/showtimes/Showtimes';
import Bookings from '@/pages/bookings/Bookings';
import Users from '@/pages/users/Users';
import Reports from '@/pages/reports/Reports';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/movies',
        element: <Movies />,
      },
      {
        path: '/theaters',
        element: <Theaters />,
      },
      {
        path: '/showtimes',
        element: <Showtimes />,
      },
      {
        path: '/bookings',
        element: <Bookings />,
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/reports',
        element: <Reports />,
      },
    ],
  },
]);
EOL

# Criar arquivo de tema do Material-UI
echo -e "${GREEN}📝 Criando tema do Material-UI...${NC}"
cat > src/theme.ts << EOL
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
EOL

# Atualizar arquivo principal
echo -e "${GREEN}📝 Atualizando arquivo principal...${NC}"
cat > src/main.tsx << EOL
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { theme } from './theme';
import { router } from './routes';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
EOL

# Atualizar .gitignore
echo -e "${GREEN}📝 Atualizando .gitignore...${NC}"
cat > .gitignore << EOL
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment
.env
EOL

# Atualizar package.json com scripts úteis
echo -e "${GREEN}📝 Atualizando package.json...${NC}"
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="tsc && vite build"
npm pkg set scripts.lint="eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.format="prettier --write 'src/**/*.{ts,tsx}'"

echo -e "${BLUE}✅ Setup do frontend concluído! Para iniciar o projeto:${NC}"
echo -e "${GREEN}1. npm install${NC}"
echo -e "${GREEN}2. npm run dev${NC}"
echo -e "${GREEN}3. Acesse http://localhost:3001${NC}" 