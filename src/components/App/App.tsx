import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'antd';
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

  const [isOffline, setIsOffline] = useState(false);
  const failStreakRef = useRef(0);
  const offlineTimerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const ping = useCallback(async (): Promise<boolean> => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2500);

    try {
      await fetch(`/favicon.ico?ping=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });
      return true;
    } catch {
      return false;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }, []);

  const checkConnectivity = useCallback(async () => {
    const ok = await ping();

    if (ok) {
      failStreakRef.current = 0;
      setIsOffline(false);
      return;
    }

    failStreakRef.current += 1;
    if (failStreakRef.current >= 2) {
      setIsOffline(true);
    }
  }, [ping]);

  useEffect(() => {
    const clearOfflineTimer = () => {
      if (offlineTimerRef.current !== null) {
        window.clearTimeout(offlineTimerRef.current);
        offlineTimerRef.current = null;
      }
    };

    const onOnline = () => {
      clearOfflineTimer();
      checkConnectivity();
    };

    const onOffline = () => {
      clearOfflineTimer();
      offlineTimerRef.current = window.setTimeout(() => {
        checkConnectivity();
      }, 1500);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    checkConnectivity();
    intervalRef.current = window.setInterval(checkConnectivity, 20000);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      clearOfflineTimer();
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkConnectivity]);

  return (
    <Provider value={movieList}>
      <div className={styles.app}>
        {isOffline ? (
          <Alert
            message="No internet connection"
            type="warning"
            showIcon
            closable
          />
        ) : (
          <>
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
          </>
        )}
      </div>
    </Provider>
  );
}
