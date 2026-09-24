import { useEffect, useState } from 'react';
import type { MovieDetailsData, OmdbResponse, WatchedData } from '../types';
import { toMovie } from '../utils';
import ErrorMessage from './ErrorMessage';
import Loader from './Loader';
import StarRating from './StarRating';
import { KEY } from '../config';

interface MovieDetailsProps {
  selectedId: string;
  watched: WatchedData[];
  onCloseMovie: () => void;
  onAddWatched: (movie: WatchedData) => void;
}

function MovieDetails({
  selectedId,
  watched,
  onCloseMovie,
  onAddWatched,
}: MovieDetailsProps) {
  const watchedMovie = watched.find(movie => movie.imdbID === selectedId);
  const isWatched = watchedMovie !== undefined;

  const [movie, setMovie] = useState<MovieDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState<number>(0);

  function handleAdd() {
    if (!movie) return;
    const newWatchedMovie: WatchedData = {
      imdbID: selectedId,
      Title: movie.title,
      Year: movie.year,
      Poster: movie.poster,
      runtime: movie.runtime,
      imdbRating: movie.imdbRating,
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  function handleRating(rating: number) {
    console.log(rating);
  }

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
                {movie?.released} &bull; {movie?.runtime} mins
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
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={28}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      {' '}
                      + Add to list{' '}
                    </button>
                  )}{' '}
                </>
              ) : (
                <p>
                  {' '}
                  You have rated this movie {watchedMovie.userRating}
                  <span>⭐</span>
                </p>
              )}
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
