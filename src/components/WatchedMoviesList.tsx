import type { WatchedData } from '../types';
import WatchedMovie from './WatchedMovie';

function WatchedMoviesList({ watched }: { watched: WatchedData[] }) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

export default WatchedMoviesList;
