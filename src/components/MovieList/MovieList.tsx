import MovieCard from '../MovieCard/MovieCard';
import { Consumer } from '../../services/Context';
import type { Movie } from '../../services/Context';
import styles from './MovieList.module.css';

type Props = {
  guestSessionId: string;
  movieDBApi: {
    rateMovie: (
      id: number,
      rating: number,
      guestSessionId: string,
    ) => Promise<unknown>;
  };
  onRatingChange: (movieId: number, newRating: number) => void;
  userRatings: Record<number, number>;
};

export default function MovieList({
  guestSessionId,
  movieDBApi,
  onRatingChange,
  userRatings,
}: Props) {
  return (
    <Consumer>
      {(movieList: Movie[]) => (
        <div className={styles.movieList}>
          {movieList.length > 0 ? (
            movieList.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                movieId={movie.id}
                movieTitle={movie.title}
                releaseDate={movie.releaseDate}
                description={movie.overview}
                imgPath={movie.posterPath ?? undefined}
                rating={movie.voteAverage}
                movieDBApi={movieDBApi}
                guestSessionId={guestSessionId}
                userRating={userRatings[movie.id]}
                onRatingChange={onRatingChange}
                genres={movie.genres.map((genre) => ({
                  id: genre.id,
                  name: genre.name,
                }))}
              />
            ))
          ) : (
            <p className={styles.emptyResult}>No movies found.</p>
          )}
        </div>
      )}
    </Consumer>
  );
}
