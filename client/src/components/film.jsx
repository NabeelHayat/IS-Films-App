/* eslint-disable react/prop-types */
import React from 'react';
import { join } from 'path';

const DEFAULT_PLACEHOLDER_IMAGE =  'https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg';

const Movie = ({ movie }) => {
  const path = join(__dirname, `../../../public/images/${movie.photo}`);
  console.log(path);
  const poster =    movie.photo === 'N/A' ? DEFAULT_PLACEHOLDER_IMAGE : path;
  return (
    <div className="movie">
      <h2>{movie.name}</h2>
      <div>
        <img
          width="200"
          alt={`The movie titled: ${movie.name}`}
          src={poster}
        />
      </div>
      <p>
        (
        {movie.releaseDate}
        )
      </p>
    </div>
  );
};

export default Movie;
