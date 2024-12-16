# Cinema Booking System

Um sistema completo de reserva de ingressos de cinema composto por três aplicações:

## 1. API (cinema-booking-api)

Backend do sistema construído com NestJS, responsável por toda a lógica de negócios e persistência de dados.

### Principais Funcionalidades
- Autenticação e autorização
- Gerenciamento de usuários
- Gerenciamento de salas de cinema
- Gerenciamento de sessões
- Sistema de reservas
- Integração com TMDB para informações de filmes
- Processamento de pagamentos

### Como Executar

```bash
# Entrar na pasta da API
cd cinema-booking-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Criar banco de dados PostgreSQL
createdb cinema_booking

# Executar migrações
npm run migration:run

# Iniciar em modo desenvolvimento
npm run start:dev

# A API estará disponível em http://localhost:3000
```

### Endpoints Principais
- `/api/auth/*` - Autenticação e gerenciamento de usuários
- `/api/theaters/*` - Gerenciamento de salas
- `/api/movies/*` - Gerenciamento de filmes
- `/api/showtimes/*` - Gerenciamento de sessões
- `/api/bookings/*` - Gerenciamento de reservas

## 2. Painel Administrativo (cinema-booking-admin)

Interface administrativa construída com React, destinada aos funcionários do cinema para gerenciar o sistema.

### Principais Funcionalidades
- Dashboard administrativo
- Gerenciamento de salas e sessões
- Visualização de reservas
- Relatórios e métricas
- Configurações do sistema

### Como Executar

```bash
# Entrar na pasta do admin
cd cinema-booking-admin

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar em modo desenvolvimento
npm run dev

# O painel estará disponível em http://localhost:5173
```

## 3. Aplicativo Mobile (cinema-booking-mobile)

Aplicativo móvel construído com React Native + Expo para os clientes realizarem suas reservas.

### Principais Funcionalidades
- Catálogo de filmes
- Visualização de sessões
- Seleção de assentos
- Reserva de ingressos
- Pagamento
- Histórico de reservas

### Como Executar

```bash
# Entrar na pasta do mobile
cd cinema-booking-mobile

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar com Expo
npx expo start

# Escaneie o QR code com o app Expo Go no seu celular
# ou pressione 'a' para abrir no emulador Android
# ou pressione 'i' para abrir no simulador iOS
```

## Requisitos do Sistema

### Banco de Dados
- PostgreSQL 12 ou superior

### Node.js
- Versão 18 ou superior
- npm 8 ou superior

### Outros
- Docker (opcional, para containerização)
- Expo CLI (para desenvolvimento mobile)
- Android Studio ou Xcode (para emuladores)

## Variáveis de Ambiente

### API (.env)
```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cinema_booking

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1d

# TMDB API
TMDB_API_KEY=your-tmdb-api-key
TMDB_API_BASE_URL=https://api.themoviedb.org/3
TMDB_API_LANGUAGE=pt-BR
```

### Admin (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME="Cinema Booking Admin"
```

### Mobile (.env)
```env
API_URL=http://localhost:3000
TMDB_API_KEY=your-tmdb-api-key
```

## Desenvolvimento

### Estrutura do Projeto
```
cinema-booking/
├── cinema-booking-api/     # Backend NestJS
├── cinema-booking-admin/   # Frontend React
└── cinema-booking-mobile/  # App React Native
```

### Scripts Úteis

#### API
```bash
npm run test          # Executa testes
npm run test:e2e     # Executa testes end-to-end
npm run migration:create  # Cria nova migração
npm run migration:run    # Executa migrações
npm run migration:revert # Reverte última migração
```

#### Admin
```bash
npm run build        # Build de produção
npm run test        # Executa testes
npm run lint        # Executa linter
```

#### Mobile
```bash
npm run android    # Inicia no Android
npm run ios       # Inicia no iOS
npm run test     # Executa testes
```

## Testes

Para executar todos os testes do sistema:

```bash
# Na raiz do projeto
./run-tests.sh
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request
