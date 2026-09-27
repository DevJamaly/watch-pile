import { useEffect, useState } from 'react';
import type { MovieData, WatchedData, OmdbSearchResponse } from './types';
import { KEY } from './config';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import NavBar from './components/NavBar';
import Search from './components/Search';
import NumResults from './components/NumResults';
import Main from './components/Main';
import Box from './components/Box';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import WatchedSummary from './components/WatchedSummary';
import WatchedMoviesList from './components/WatchedMoviesList';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [watched, setWatched] = useState<WatchedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');

  function handleSelectMovie(id: string) {
    setSelectedId(prevId => (prevId === id ? '' : id));
  }

  function handleCloseMovie() {
    setSelectedId('');
  }

  function handleAddWatchedMovie(movie: WatchedData) {
    if (watched.find(watchedMovie => watchedMovie.imdbID === movie.imdbID))
      return;
    setWatched(watched => [...watched, movie]);
  }

  function handleDeleteWatchedMovie(id: string) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  /* useEffect(function () {
    console.log(`After initial render`);
  }, []);

  useEffect(function () {
    console.log(`After every render`);
  });

  console.log('During render');

  useEffect(
    function () {
      console.log('D');
    },
    [query],
  ); */

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

    handleCloseMovie();
    fetchMovies();

    return function cleanUp() {
      console.log(`Aborting Request ${query}`);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="app">
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {/* <MovieDetails
            selectedId={`tt1375666`}
            onCloseMovie={handleCloseMovie}
          /> */}

          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>

        {/* <BoxExplicit elements={<MovieList movies={movies} />} />
        <BoxExplicit
          elements={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}
      </Main>
    </div>
  );
}

export default App;
