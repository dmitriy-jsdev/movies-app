import { Alert } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import MovieList from '../MovieList/MovieList';
import SearchPanel from '../SearchPanel/SearchPanel';
import Pagination from '../Pagination/Pagination';
import Spinner from '../Spinner/Spinner';
import { Provider } from '../../services/Context';
import { useMoviesController } from './useMoviesController';
import styles from './App.module.css';

export default function App(): JSX.Element {
  const {
    movieList,
    loading,
    error,
    currentPage,
    totalResults,
    guestSessionId,
    userRatings,
    handleSearch,
    handleRatedTab,
    handlePageChange,
    handleRatingChange,
    api,
  } = useMoviesController();

  return (
    <Provider value={movieList}>
      <div className={styles.app}>
        <Offline>
          <Alert
            message="No internet connection"
            type="warning"
            showIcon
            closable
          />
        </Offline>
        <Online>
          <SearchPanel onSearch={handleSearch} onRated={handleRatedTab} />
          {loading && <Spinner />}
          {!loading && !error && (
            <MovieList
              guestSessionId={guestSessionId ?? ''}
              movieDBApi={api}
              onRatingChange={handleRatingChange}
              userRatings={userRatings}
            />
          )}
          {!loading && !error && (
            <Pagination
              current={currentPage}
              total={totalResults}
              onChange={handlePageChange}
            />
          )}
        </Online>
      </div>
    </Provider>
  );
}
