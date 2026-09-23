import { useEffect, useState } from 'react';
import type { MovieDetailsData, OmdbResponse } from '../types';
import { toMovie } from '../utils';
import ErrorMessage from './ErrorMessage';
import Loader from './Loader';
import StarRating from './StarRating';
import { KEY } from '../config';

interface MovieDetailsProps {
  selectedId: string;
  onCloseMovie: () => void;
}

function MovieDetails({ selectedId, onCloseMovie }: MovieDetailsProps) {
  const [movie, setMovie] = useState<MovieDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setIsLoading(true);
          setError('');
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
          );
          if (!res.ok)
            throw new Error('Something went wrong with fetching movies');

          const data: OmdbResponse = await res.json();
          if (data.Response === 'False') throw new Error(data.Error); // data is OmdbApiFailure here — TS knows it, so .Error is guaranteed to exist

          const mov = toMovie(data);
          setMovie(mov); // data is OmdbApiMovie here — TS narrowed it after the check above
          setIsLoading(false);
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
  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie} />
            <div className="details-poster-wrap">
              <img
                className="details-poster"
                src={movie?.poster}
                alt={`Poster of ${movie?.title} movie`}
              />
            </div>
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
          <section>
            <div className="rating">
              <StarRating maxRating={10} size={28} />
            </div>
            <p>
              <em>{movie?.plot}</em>
            </p>
            <p>
              <b>Starring: </b>
              {movie?.actors}
            </p>
            <p>
              <b>Directed by: </b>
              {movie?.director}
            </p>
          </section>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default MovieDetails;
