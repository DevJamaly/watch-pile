import React, { useEffect, useState } from 'react';

interface MovieData {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

const tempMovieData: MovieData[] = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

interface WatchedData extends MovieData {
  runtime: number;
  imdbRating: number;
  userRating: number;
}

const tempWatchedData: WatchedData[] = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

interface OmdbSearchResponse {
  Search?: MovieData[]; // "?" = might be missing
  Response: 'True' | 'False';
  Error?: string;
}

const average = (arr: number[]) =>
  arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

const KEY = 'b80fa192';
const tempQuery = 'interstellar';

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
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
        );

        if (!res.ok)
          throw new Error('Something went wrong with fetching movies');

        const data: OmdbSearchResponse = await res.json();
        if (data.Response === 'False') throw new Error(data.Error);
        setMovies(data.Search ?? []); // missing? use empty array
        setIsLoading(false);
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
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
    fetchMovies();
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
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
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

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

interface NavBarProps {
  children: React.ReactNode;
}

function NavBar({ children }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>WatchPile</h1>
    </div>
  );
}

function NumResults({ movies }: { movies: MovieData[] }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

interface SearchProps {
  query: string;
  setQuery: (q: string) => void;
}

function Search({ query, setQuery }: SearchProps) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}

interface MainProps {
  children: React.ReactNode;
}

function Main({ children }: MainProps) {
  return <main className="main">{children}</main>;
}

function Box({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <ViewToggleButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(open => !open)}
      />
      {isOpen && children}
    </div>
  );
}

function BoxExplicit({ elements }: { elements: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <ViewToggleButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(open => !open)}
      />
      {isOpen && elements}
    </div>
  );
}

interface ViewToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

function ViewToggleButton({ isOpen, onToggle }: ViewToggleButtonProps) {
  return (
    <button className="btn-toggle" data-open={isOpen} onClick={onToggle} />
  );
}

interface MovieListProps {
  movies: MovieData[];
  onSelectMovie: (id: string) => void;
}

function MovieList({ movies, onSelectMovie }: MovieListProps) {
  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

interface MovieProps {
  movie: MovieData;
  onSelectMovie: (id: string) => void;
}

function Movie({ movie, onSelectMovie }: MovieProps) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }: { watched: WatchedData[] }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating));
  const avgUserRating = average(watched.map(movie => movie.userRating));
  const avgRuntime = average(watched.map(movie => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched }: { watched: WatchedData[] }) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }: { movie: WatchedData }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

interface MovieDetailsProps {
  selectedId: string;
  onCloseMovie: () => void;
}

interface OmdbApiMovie {
  Response: 'True';
  Title: string;
  Year: string;
  Poster: string;
  Runtime: string;
  imdbRating: string;
  Plot: string;
  Released: string;
  Actors: string;
  Director: string;
  Genre: string;
}

interface OmdbApiFailure {
  Response: 'False';
  Error: string;
}

type OmdbResponse = OmdbApiMovie | OmdbApiFailure;

interface Movie {
  title: string;
  year: string;
  poster: string;
  runtime: number; // parsed, not "148 min"
  imdbRating: number; // parsed, not "7.7"
  plot: string;
  released: string;
  actors: string[]; // split, not "A, B, C"
  director: string;
  genre: string[];
}

function toMovie(raw: OmdbApiMovie): Movie {
  return {
    title: raw.Title,
    year: raw.Year,
    poster: raw.Poster,
    runtime: parseInt(raw.Runtime),
    imdbRating: parseFloat(raw.imdbRating),
    plot: raw.Plot,
    released: raw.Released,
    actors: raw.Actors.split(', '),
    director: raw.Director,
    genre: raw.Genre.split(', '),
  };
}

function MovieDetails({ selectedId, onCloseMovie }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  useEffect(
    function () {
      async function fetchMovie() {
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
          );
          if (!res.ok)
            throw new Error('Something went wrong with fetching movies');

          const data: OmdbResponse = await res.json();
          if (data.Response === 'False') throw new Error(data.Error); // data is OmdbApiFailure here — TS knows it, so .Error is guaranteed to exist

          const mov = toMovie(data);
          setMovie(mov); // data is OmdbApiMovie here — TS narrowed it after the check above
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            console.error(`Something went wrong: `, error);
          }
        }
      }

      fetchMovie();
    },
    [selectedId],
  );

  return error ? (
    <ErrorMessage message={error} />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie} />
        <img src={movie?.poster} alt={`Poster of ${movie?.title} movie`} />
        <div className="details-overview">
          <h2>{movie?.title}</h2>
          <p>
            {movie?.released} &bull; {movie?.runtime}
          </p>
          <p>{movie?.genre}</p>
          <p>
            <span>⭐</span>
            {movie?.imdbRating} IMDb rating
          </p>
        </div>
      </header>
      {selectedId}
    </div>
  );
}

export default App;
