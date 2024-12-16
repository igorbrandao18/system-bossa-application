#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎬 Iniciando setup do Cinema Booking System Backend...${NC}"

# Criar diretório do projeto
echo -e "${GREEN}📁 Criando estrutura de diretórios...${NC}"
mkdir -p cinema-booking-api
cd cinema-booking-api

# Inicializar projeto NestJS
echo -e "${GREEN}🦁 Instalando NestJS CLI...${NC}"
npm i -g @nestjs/cli

echo -e "${GREEN}🏗️  Criando projeto NestJS...${NC}"
nest new . --package-manager npm --skip-git

# Instalar dependências necessárias
echo -e "${GREEN}📦 Instalando dependências...${NC}"
npm install \
  @nestjs/typeorm typeorm pg \
  @nestjs/config \
  @nestjs/swagger \
  @nestjs/websockets @nestjs/platform-socket.io \
  @nestjs/jwt @nestjs/passport passport passport-jwt passport-local \
  class-validator class-transformer \
  bcrypt \
  axios \
  helmet \
  compression \
  @types/bcrypt @types/passport-jwt @types/passport-local -D

# Criar estrutura base do projeto
echo -e "${GREEN}🏗️  Criando estrutura de diretórios...${NC}"
mkdir -p \
  src/config \
  src/common \
  src/modules/movies/{dto,entities,interfaces} \
  src/modules/theaters/{dto,entities,interfaces} \
  src/modules/showtimes/{dto,entities,interfaces} \
  src/modules/bookings/{dto,entities,interfaces} \
  src/modules/users/{dto,entities,interfaces} \
  test/integration

# Criar arquivo de configuração do TypeORM
echo -e "${GREEN}⚙️  Criando arquivo de configuração do TypeORM...${NC}"
cat > src/config/typeorm.config.ts << EOL
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'cinema_booking',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
EOL

# Criar interface TMDB
echo -e "${GREEN}📝 Criando interface TMDB...${NC}"
cat > src/modules/movies/interfaces/tmdb.interface.ts << EOL
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  adult: boolean;
  video: boolean;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}
EOL

# Criar arquivo .env
echo -e "${GREEN}📝 Criando arquivo .env...${NC}"
cat > .env << EOL
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
TMDB_API_KEY=c90bcc69290d26ceb456609c8e38227d
TMDB_API_BASE_URL=https://api.themoviedb.org/3
TMDB_API_LANGUAGE=pt-BR
EOL

# Criar arquivo .env.example
cp .env .env.example

# Atualizar package.json com scripts úteis
echo -e "${GREEN}📝 Atualizando package.json...${NC}"
npm pkg set scripts.start:dev="nest start --watch"
npm pkg set scripts.start:debug="nest start --debug --watch"
npm pkg set scripts.start:prod="node dist/main"
npm pkg set scripts.test:e2e="jest --config ./test/jest-e2e.json"
npm pkg set scripts.test:cov="jest --coverage"

# Criar arquivo .gitignore
echo -e "${GREEN}📝 Criando .gitignore...${NC}"
cat > .gitignore << EOL
# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# Environment
.env
EOL

echo -e "${BLUE}✅ Setup concluído! Para iniciar o projeto:${NC}"
echo -e "${GREEN}1. Certifique-se que o PostgreSQL está instalado e rodando${NC}"
echo -e "${GREEN}2. Crie o banco de dados 'cinema_booking' no PostgreSQL${NC}"
echo -e "${GREEN}3. npm run start:dev${NC}"