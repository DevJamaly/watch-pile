import { useCallback, useEffect, useState } from 'react';
import type { WatchedData } from './types';
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
import { useMovies } from './hooks/useMovies';

function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [watched, setWatched] = useState<WatchedData[]>(
    function getWatchedData(): WatchedData[] {
      try {
        const storedValue = localStorage.getItem('watched');
        return storedValue ? JSON.parse(storedValue) : [];
      } catch {
        return [];
      }
    },
  );

  const handleCloseMovie = useCallback(() => {
    setSelectedId('');
  }, []);

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  function handleSelectMovie(id: string) {
    setSelectedId(prevId => (prevId === id ? '' : id));
  }

  function handleAddWatchedMovie(movie: WatchedData) {
    if (watched.find(watchedMovie => watchedMovie.imdbID === movie.imdbID))
      return;
    setWatched(watched => [...watched, movie]);
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatchedMovie(id: string) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

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
      </Main>
    </div>
  );
}

export default App;
