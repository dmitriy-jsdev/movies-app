import { createContext } from 'react';

export type MovieGenre = { id: number; name: string };

export type MovieItem = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  genres: MovieGenre[];
};

const { Provider, Consumer } = createContext<MovieItem[]>([]);

export { Provider, Consumer };
