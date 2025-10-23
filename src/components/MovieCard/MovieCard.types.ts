export type MovieGenre = { id: number; name: string };

export interface MovieDbApi {
  rateMovie: (
    id: number,
    rating: number,
    guestSessionId: string,
  ) => Promise<unknown>;
}

export type MovieCardProps = {
  movieId: number;
  movieDBApi: MovieDbApi;
  guestSessionId: string;
  onRatingChange: (movieId: number, newRating: number) => void;
  movieTitle: string;
  description?: string;
  releaseDate: string;
  rating?: number;
  genres: MovieGenre[];
  userRating?: number;
  imgPath?: string;
};
