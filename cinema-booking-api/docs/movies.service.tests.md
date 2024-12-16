# Documentação dos Testes do Serviço de Filmes

## Introdução
Este documento descreve os testes automatizados do serviço responsável pelo gerenciamento de filmes no sistema de reservas de cinema. Os testes garantem que todas as operações básicas (criar, ler, atualizar e excluir) funcionem corretamente e que erros sejam tratados adequadamente.

## Estrutura de Arquivos

### Arquivos Principais

1. **Serviço e Testes**
   - `src/modules/movies/movies.service.ts`
     - Implementação do serviço
     - Contém toda a lógica de negócio
     - Responsável pelas operações CRUD

   - `src/modules/movies/__tests__/movies.service.spec.ts`
     - Arquivo de testes
     - Contém todos os testes unitários
     - Verifica cada funcionalidade do serviço

2. **DTOs (Objetos de Transferência de Dados)**
   - `src/modules/movies/dto/create-movie.dto.ts`
     - Define a estrutura para criar um filme
     - Validação dos dados de entrada
     ```typescript
     {
       title: string;
       originalTitle: string;
       overview: string;
       tmdbId: number;
       releaseDate: Date;
       genreIds: string[];
       // ... outros campos
     }
     ```

   - `src/modules/movies/dto/update-movie.dto.ts`
     - Define a estrutura para atualizar um filme
     - Campos opcionais para atualização parcial

3. **Entidades**
   - `src/modules/movies/entities/movie.entity.ts`
     - Define o modelo do filme no banco de dados
     - Mapeamento das relações (gêneros, sessões)
     - Configuração das colunas da tabela

### Operações CRUD e Seus Testes

#### 1. CREATE (Criar)
**Arquivo**: `movies.service.ts`
```typescript
async create(createMovieDto: CreateMovieDto) {
  // Lógica de criação
}
```
**Testes**: `movies.service.spec.ts`
- Testa criação com dados válidos
- Verifica validação de gêneros
- Trata erros de criação

#### 2. READ (Ler)
**Arquivo**: `movies.service.ts`
```typescript
async findAll() { ... }
async findOne(id: string) { ... }
async findByGenre(genreId: string) { ... }
```
**Testes**: `movies.service.spec.ts`
- Verifica listagem completa
- Testa busca por ID
- Valida busca por gênero

#### 3. UPDATE (Atualizar)
**Arquivo**: `movies.service.ts`
```typescript
async update(id: string, updateMovieDto: UpdateMovieDto) { ... }
```
**Testes**: `movies.service.spec.ts`
- Testa atualização parcial
- Verifica validação de ID
- Trata erros de atualização

#### 4. DELETE (Excluir)
**Arquivo**: `movies.service.ts`
```typescript
async remove(id: string) { ... }
```
**Testes**: `movies.service.spec.ts`
- Verifica exclusão correta
- Testa exclusão de item inexistente
- Valida integridade após exclusão

### Funcionalidades Adicionais

1. **Relacionamentos**
   - Gerenciamento de gêneros
   - Integração com TMDB
   - Validações customizadas

2. **Tratamento de Erros**
   - Erros de banco de dados
   - Validações de negócio
   - Exceções personalizadas

## Estrutura dos Testes

### Preparação do Ambiente
Antes de executar os testes, criamos um ambiente controlado onde:
- Simulamos o banco de dados para não afetar dados reais
- Controlamos todas as respostas do sistema
- Garantimos que cada teste seja independente

### Categorias de Testes

#### 1. Criação de Filmes

**O que testamos:**
- ✅ Criar um novo filme com todas as informações necessárias
- ✅ Verificar se os gêneros do filme existem
- ✅ Garantir que erros sejam tratados corretamente

**Exemplo de dados para teste:**
```typescript
{
  título: "Filme de Teste",
  título original: "Test Movie",
  descrição: "Descrição do filme para teste",
  gêneros: ["Ação", "Drama"],
  data de lançamento: "25/12/2023",
  classificação: 8.0,
  // ... outras informações
}
```

**Cenários testados:**
1. **Sucesso**: Filme é criado corretamente com todos os dados
2. **Erro**: Tentativa de criar filme com gênero inexistente
3. **Erro**: Falha ao salvar no banco de dados

#### 2. Consulta de Filmes

**O que testamos:**
- ✅ Listar todos os filmes
- ✅ Buscar um filme específico
- ✅ Tratar casos onde o filme não existe

**Cenários testados:**
1. **Sucesso**: Retorna lista completa de filmes
2. **Sucesso**: Encontra filme específico pelo ID
3. **Erro**: Busca por filme que não existe

#### 3. Atualização de Filmes

**O que testamos:**
- ✅ Atualizar informações de um filme existente
- ✅ Verificar se o filme existe antes de atualizar
- ✅ Garantir que dados inválidos não sejam aceitos

**Cenários testados:**
1. **Sucesso**: Filme é atualizado corretamente
2. **Erro**: Tentativa de atualizar filme inexistente
3. **Erro**: Falha durante o processo de atualização

#### 4. Exclusão de Filmes

**O que testamos:**
- ✅ Remover um filme do sistema
- ✅ Verificar se o filme existe antes de tentar excluir
- ✅ Garantir que a exclusão seja segura

**Cenários testados:**
1. **Sucesso**: Filme é removido corretamente
2. **Erro**: Tentativa de remover filme inexistente
3. **Erro**: Falha durante o processo de exclusão

#### 5. Funcionalidades Adicionais

**O que testamos:**
- ✅ Buscar filmes por gênero
- ✅ Verificar relacionamentos entre filmes e gêneros

## Garantia de Qualidade

Nossos testes garantem:
1. **Confiabilidade**: Todas as operações funcionam conforme esperado
2. **Segurança**: Erros são tratados adequadamente
3. **Integridade**: Dados são mantidos consistentes
4. **Usabilidade**: Sistema responde corretamente às ações dos usuários

## Como Executar os Testes

### Execução Básica
Para rodar todos os testes:
```bash
npm test movies.service
```

### Execução com Relatório de Cobertura
Para ver quanto do código está coberto por testes:
```bash
npm test movies.service -- --coverage
```

## Resultados Esperados

Após a execução, você deve ver:
- ✅ Todos os testes passando
- ✅ Nenhum erro não tratado
- ✅ Cobertura de código adequada
- ✅ Relatório detalhado de execução

## Manutenção

Este conjunto de testes deve ser atualizado quando:
1. Novas funcionalidades forem adicionadas
2. Comportamentos existentes forem modificados
3. Bugs forem corrigidos
4. Requisitos do sistema mudarem

## Conclusão

Estes testes são fundamentais para:
- Garantir que o sistema funcione corretamente
- Prevenir erros antes de chegarem ao usuário final
- Facilitar manutenções futuras
- Documentar o comportamento esperado do sistema
 