export type Genre = { id: number; name: string };

export type ApiMovie = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids?: number[];
  genres: Genre[];
};

type PagedResponse<T> = {
  page: number;
  results: T[];
  total_results: number;
  total_pages: number;
};

export default function MovieDBapi() {
  const baseApi = 'https://api.themoviedb.org/3';

  const token =
    process.env.REACT_APP_TMDB_TOKEN ?? 'ad8adbb06e53c3f9318605818058225c';

  const getResource = async <T = unknown>(url: string): Promise<T> => {
    const joiner = url.includes('?') ? '&' : '?';
    const res = await fetch(`${baseApi}${url}${joiner}api_key=${token}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return res.json() as Promise<T>;
  };

  const getMovie = (id: number): Promise<ApiMovie> =>
    getResource<ApiMovie>(`/movie/${id}`);

  const getPopularMovies = (page: number): Promise<PagedResponse<ApiMovie>> =>
    getResource<PagedResponse<ApiMovie>>(
      `/movie/popular?language=en-US&page=${page}`,
    );

  const searchMovies = (
    query: string,
    page: number,
  ): Promise<PagedResponse<ApiMovie>> =>
    getResource<PagedResponse<ApiMovie>>(
      `/search/movie?query=${encodeURIComponent(
        query,
      )}&language=en-US&page=${page}`,
    );

  const createGuestSession = async (): Promise<string> => {
    const response = await getResource<{ guest_session_id: string }>(
      '/authentication/guest_session/new?language=en-US',
    );
    return response.guest_session_id;
  };

  const getGenres = async (): Promise<Genre[]> => {
    const response = await getResource<{ genres: Genre[] }>(
      '/genre/movie/list?language=en-US',
    );
    return response.genres;
  };

  const rateMovie = async (
    movieId: number,
    rating: number,
    guestSessionId: string,
  ): Promise<unknown> => {
    const url = `/movie/${movieId}/rating?guest_session_id=${guestSessionId}`;
    const res = await fetch(`${baseApi}${url}&api_key=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ value: rating }),
    });
    if (!res.ok) {
      throw new Error(
        `Could not post rating for movie ${movieId}, received ${res.status}`,
      );
    }
    return res.json();
  };

  return {
    getResource,
    getMovie,
    getPopularMovies,
    searchMovies,
    createGuestSession,
    getGenres,
    rateMovie,
  };
}

export type MovieDbApi = ReturnType<typeof MovieDBapi>;
