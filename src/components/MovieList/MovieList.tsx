import MovieCard from '../MovieCard/MovieCard';
import { Consumer, MovieItem } from '../../services/Context';
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
      {(movieList: MovieItem[]) => (
        <div className={styles['movie-list']}>
          {movieList.length > 0 ? (
            movieList.map((movie: MovieItem) => (
              <MovieCard
                key={movie.id}
                movieId={movie.id}
                movieTitle={movie.title}
                releaseDate={movie.release_date}
                description={movie.overview}
                imgPath={movie.poster_path ?? undefined}
                rating={movie.vote_average}
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
            <p className={styles['empty-result']}>No movies found.</p>
          )}
        </div>
      )}
    </Consumer>
  );
}
