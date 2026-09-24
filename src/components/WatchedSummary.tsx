import type { WatchedData } from '../types';
import { average } from '../utils';

function WatchedSummary({ watched }: { watched: WatchedData[] }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating)).toFixed(
    2,
  );
  const avgUserRating = average(watched.map(movie => movie.userRating)).toFixed(
    2,
  );
  const avgRuntime = Math.floor(average(watched.map(movie => movie.runtime)));

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

export default WatchedSummary;
