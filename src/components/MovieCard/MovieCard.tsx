import { useCallback, type JSX } from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import TrimText from '../../utils/TrimText';
import TruncatedTitle from '../TruncatedTitle/TruncatedTitle';
import styles from './MovieCard.module.css';
import type { MovieCardProps } from './MovieCard.types';

export default function MovieCard(props: MovieCardProps): JSX.Element {
  const {
    movieId,
    movieDBApi,
    guestSessionId,
    onRatingChange,
    movieTitle,
    description = '',
    releaseDate,
    rating = 0,
    genres,
    userRating = 0,
    imgPath,
  } = props;

  const handleRatingChange = useCallback(
    (newRating: number) => {
      movieDBApi
        .rateMovie(movieId, newRating, guestSessionId)
        .then(() => {
          onRatingChange(movieId, newRating);
        })
        .catch((error) => {
          console.error('Error updating rating', error);
        });
    },
    [movieDBApi, movieId, guestSessionId, onRatingChange]
  );

  const getRatingClass = useCallback((value: number): string => {
    if (value >= 7) return styles.ratingHigh;
    if (value >= 5) return styles.ratingMid;
    if (value >= 3) return styles.ratingLow;
    return styles.ratingVeryLow;
  }, []);

  const fallbackImage =
    'https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg';
  const image = imgPath ?? fallbackImage;
  const imgSrc = image.startsWith('http')
    ? image
    : `https://image.tmdb.org/t/p/w500${image}`;

  const formattedDate = releaseDate
    ? format(new Date(releaseDate), 'MMMM d, yyyy')
    : null;
  const shortDesc = TrimText(description, 170);

  const genresElement = genres
    .map((genreItem) => (
      <li key={genreItem.id} className={styles.genresListItem}>
        {genreItem.name}
      </li>
    ))
    .slice(0, 3);

  return (
    <li className={styles.movieCard}>
      <img className={styles.movieImg} src={imgSrc} alt={movieTitle} />
      <div className={styles.movieCardContent}>
        <TruncatedTitle title={movieTitle} />
        <span className={styles.releaseDate}>{formattedDate}</span>
        <ul className={styles.genresList}>{genresElement}</ul>
        <p className={styles.description}>{shortDesc}</p>
        <Rate value={userRating} count={10} allowHalf onChange={handleRatingChange} />
        <div className={`${styles.ratingCircle} ${getRatingClass(rating)}`}>
          {rating.toFixed(1)}
        </div>
      </div>
    </li>
  );
}