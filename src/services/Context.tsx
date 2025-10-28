import { createContext } from 'react';

export type MovieGenre = { id: number; name: string };

export type Movie = {
  id: number;
  title: string;
  releaseDate: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
  genres: MovieGenre[];
};

const { Provider, Consumer } = createContext<Movie[]>([]);

export { Provider, Consumer };
