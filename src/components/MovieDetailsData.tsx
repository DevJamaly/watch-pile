import type { MovieData } from '../types';

interface MovieDetailsDataProps {
  movie: MovieData;
  onSelectMovie: (id: string) => void;
}

function MovieDetailsData({ movie, onSelectMovie }: MovieDetailsDataProps) {
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

export default MovieDetailsData;
