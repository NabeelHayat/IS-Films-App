/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/no-array-index-key */
import React, { useReducer, useEffect } from 'react';
import axios from 'axios';

import { initialState, reducer } from '../../reducers/filmReducer';
import spinner from '../../assets/ajax-loader.gif';
import Header from '../header';
import Film from '../film';

import Pagination from '../pagination';

const FILM_URL =  'http://localhost:8080/api/v1/films/01a45100-66e2-11eb-8519-e1a23d4a1a962';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get(FILM_URL).then((jsonResponse) => {
      console.log(jsonResponse);
      dispatch({
        type: 'SEARCH_FILMS_SUCCESS',
        payload: jsonResponse.film,
      });
    });
  }, []);

  // you can add this to the onClick listener of the Header component
  const refreshPage = () => {
    window.location.reload();
  };

  const { films, errorMessage, loading } = state;

  const retrievedFilms =    loading && !errorMessage ? (
    <img className="spinner" src={spinner} alt="Loading spinner" />
  ) : errorMessage ? (
    <div className="errorMessage">{errorMessage}</div>
  ) : (
    films.map((movie, index) => (
      <Film key={`${index}-${movie.Title}`} movie={movie} />
    ))
  );

  return (
    <div className="App">
      <div className="m-container">
        <Header text="HOOKED" />

        {/* <Search search={search} /> */}

        <p className="App-intro">Sharing a few of our favourite films</p>

        <div className="movies">{retrievedFilms}</div>
      </div>
    </div>
  );
};

export default App;
