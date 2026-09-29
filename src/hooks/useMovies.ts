import { useEffect, useState } from 'react';
import type { MovieData, OmdbSearchResponse } from '../types';
import { KEY } from '../config';

interface useMoviesProps {
  query: string;
  callback: () => void;
}

export function useMovies(query: string, callback?: () => void) {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal },
        );

        if (!res.ok)
          throw new Error('Something went wrong with fetching movies');

        const data: OmdbSearchResponse = await res.json();
        if (data.Response === 'False') throw new Error(data.Error);
        setMovies(data.Search ?? []); // missing? use empty array
        setError('');
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== 'AbortError') setError(error.message);
        } else {
          console.error('Something went wrong:', error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      setIsLoading(false);
      return;
    }

    callback?.();
    fetchMovies();

    return function cleanUp() {
      console.log(`Aborting Request ${query}`);
      controller.abort();
    };
  }, [query, callback]);

  return { movies, isLoading, error };
}
