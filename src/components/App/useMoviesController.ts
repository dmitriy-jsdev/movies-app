import { useCallback, useEffect, useRef, useState } from 'react';
import MovieDBapi, {
  type MovieDbApi,
  type Genre,
  type Movie,
} from '../../services/MovieDBapi';
import type { MovieItem } from '../../services/Context';

export function useMoviesController() {
  const [movieList, setMovieList] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [showOnlyRated, setShowOnlyRated] = useState<boolean>(false);
  const [searchPage, setSearchPage] = useState<number>(1);
  const [ratedPage, setRatedPage] = useState<number>(1);

  const apiRef = useRef<MovieDbApi | null>(null);
  if (apiRef.current === null) apiRef.current = MovieDBapi();
  const api = apiRef.current!;

  const didMountUpdateRef = useRef<boolean>(false);
  const skipNextPageEffectRef = useRef<boolean>(false);

  const userRatingsRef = useRef(userRatings);
  useEffect(() => {
    userRatingsRef.current = userRatings;
  }, [userRatings]);

  const performMovieFetch = useCallback(
    async (term: string, page: number): Promise<void> => {
      window.scrollTo(0, 0);
      try {
        const allGenres = await api.getGenres();
        const data = term
          ? await api.searchMovies(term, page)
          : await api.getPopularMovies(page);

        const mapped: MovieItem[] = data.results.map((m: Movie) => ({
          id: m.id,
          title: m.title,
          release_date: m.release_date,
          overview: m.overview,
          poster_path: m.poster_path,
          vote_average: m.vote_average,
          genres: (m.genre_ids ?? [])
            .map((gid) => allGenres.find((g) => g.id === gid))
            .filter(Boolean) as Genre[],
        }));

        setMovieList(mapped);
        setLoading(false);
        setTotalResults(data.total_results);
        setShowOnlyRated(false);
        setCurrentPage(page);
      } catch {
        setError('Error fetching movies!');
        setLoading(false);
      }
    },
    [api],
  );

  const fetchRatedMovies = useCallback(
    async (pageOverride?: number): Promise<void> => {
      window.scrollTo(0, 0);
      setLoading(true);

      const page = pageOverride ?? currentPage;
      const ratedMovieIds = Object.keys(userRatingsRef.current);
      const pageSize = 20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const currentRatedMovieIds = ratedMovieIds.slice(startIndex, endIndex);

      const detailed = await Promise.all(
        currentRatedMovieIds.map(async (movieIdStr) => {
          const movieId = Number(movieIdStr);
          const m = await api.getMovie(movieId);
          const item: MovieItem = {
            id: m.id,
            title: m.title,
            release_date: m.release_date,
            overview: m.overview,
            poster_path: m.poster_path ?? null,
            vote_average: m.vote_average,
            genres: (m.genres ?? []) as Genre[],
          };
          return item;
        }),
      );

      setMovieList(detailed);
      setLoading(false);
      setError((prev) => (detailed.length === 0 ? null : prev));
      setShowOnlyRated(true);
      setTotalResults(ratedMovieIds.length);
    },
    [api, currentPage],
  );

  useEffect(() => {
    let canceled = false;
    (async () => {
      const sessionId = await api.createGuestSession();
      if (canceled) return;
      setGuestSessionId(sessionId);
      setLoading(true);
      setError(null);
      await performMovieFetch('', 1);
    })();
    return () => {
      canceled = true;
    };
  }, [api, performMovieFetch]);

  useEffect(() => {
    if (!didMountUpdateRef.current) {
      didMountUpdateRef.current = true;
      return;
    }
    if (skipNextPageEffectRef.current) {
      skipNextPageEffectRef.current = false;
      return;
    }

    if (showOnlyRated) {
      void fetchRatedMovies();
    } else {
      void performMovieFetch(searchTerm, currentPage);
    }
  }, [
    currentPage,
    showOnlyRated,
    performMovieFetch,
    fetchRatedMovies,
    searchTerm,
  ]);

  const handleSearch = (term: string): void => {
    const nextPage = term !== searchTerm ? 1 : searchPage;
    setSearchTerm(term);
    setSearchPage(nextPage);
    setShowOnlyRated(false);

    if (nextPage === currentPage) {
      skipNextPageEffectRef.current = true;
      setLoading(true);
      setError(null);
      void performMovieFetch(term, nextPage);
    } else {
      setCurrentPage(nextPage);
    }
  };

  const handlePageChange = (page: number): void => {
    skipNextPageEffectRef.current = true;
    setCurrentPage(page);

    if (showOnlyRated) {
      setRatedPage(page);
      void fetchRatedMovies(page);
    } else {
      setSearchPage(page);
      setLoading(true);
      setError(null);
      void performMovieFetch(searchTerm, page);
    }
  };

  const handleRatedTab = (): void => {
    setShowOnlyRated(true);
    if (ratedPage === currentPage) {
      skipNextPageEffectRef.current = true;
      void fetchRatedMovies();
    } else {
      setCurrentPage(ratedPage);
    }
  };

  const handleRatingChange = (movieId: number, newRating: number): void => {
    setUserRatings((prev) => ({
      ...prev,
      [movieId]: newRating,
    }));
  };

  return {
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
  };
}
