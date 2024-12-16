export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  originalLanguage: string;
  adult: boolean;
  video: boolean;
  createdAt: Date;
  updatedAt: Date;
} 