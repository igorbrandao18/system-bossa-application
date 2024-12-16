#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Criando estrutura de pastas do projeto...${NC}"

# Criar estrutura base
mkdir -p src/{modules,config,common,database}

# Criar módulos
MODULES=(
  "auth:dto,guards,strategies"
  "users:dto,entities"
  "movies:dto,entities"
  "theaters:dto,entities"
  "showtimes:dto,entities"
  "bookings:dto,entities"
  "payments:dto,entities"
)

for module in "${MODULES[@]}"; do
  IFS=":" read -r name folders <<< "${module}"
  echo -e "${GREEN}Criando módulo ${name}...${NC}"
  
  # Criar pasta do módulo
  mkdir -p "src/modules/${name}"
  
  # Criar subpastas
  IFS="," read -r -a subfolders <<< "${folders}"
  for subfolder in "${subfolders[@]}"; do
    mkdir -p "src/modules/${name}/${subfolder}"
  done
  
  # Criar arquivos base
  touch "src/modules/${name}/${name}.controller.ts"
  touch "src/modules/${name}/${name}.service.ts"
  touch "src/modules/${name}/${name}.module.ts"
done

# Criar pastas comuns
COMMON_FOLDERS=(
  "decorators"
  "filters"
  "guards"
  "interceptors"
  "pipes"
)

for folder in "${COMMON_FOLDERS[@]}"; do
  mkdir -p "src/common/${folder}"
done

# Criar pastas de banco de dados
mkdir -p "src/database/migrations"
mkdir -p "src/database/seeds"

echo -e "${GREEN}Estrutura de pastas criada com sucesso!${NC}" 