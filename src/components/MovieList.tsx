import type { MovieData } from '../types';
import MovieDetailsData from './MovieDetailsData';

interface MovieListProps {
  movies: MovieData[];
  onSelectMovie: (id: string) => void;
}

function MovieList({ movies, onSelectMovie }: MovieListProps) {
  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <MovieDetailsData
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

export default MovieList;
