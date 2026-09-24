import type { WatchedData } from '../types';
import WatchedMovie from './WatchedMovie';

interface WatchedMovieListProps {
  watched: WatchedData[];
  onDeleteWatched: (id: string) => void;
}

function WatchedMoviesList({
  watched,
  onDeleteWatched,
}: WatchedMovieListProps) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

export default WatchedMoviesList;
