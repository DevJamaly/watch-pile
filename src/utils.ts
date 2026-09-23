import type { OmdbApiMovie, MovieDetailsData } from './types';

export const average = (arr: number[]) =>
  arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);
export function toMovie(raw: OmdbApiMovie): MovieDetailsData {
  return {
    title: raw.Title,
    year: raw.Year,
    poster: raw.Poster,
    runtime: parseInt(raw.Runtime),
    imdbRating: parseFloat(raw.imdbRating),
    plot: raw.Plot,
    released: raw.Released,
    actors: raw.Actors,
    director: raw.Director,
    genre: raw.Genre,
  };
}
