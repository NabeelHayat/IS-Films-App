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

const config = {
    headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIxMmgiLCJ1c2VySWQiOiJjMTQxYmIzMC02NmUwLTExZWItYWJlZS0wOTk1OWQ2ODQ3YmYiLCJ1c2VybmFtZSI6Im5hYmVlbGhheWF0ODciLCJlbWFpbCI6Im5hYmVlbC5oYXlhdDg3QGdtYWlsLmNvbSIsImlhdCI6MTYxMjQ0MDExOH0.4y763JbqmYkZ_FQgA7rcsepWPB6gzwJ_8Myl8lnmxYk` }
};

const FILM_URL =  'http://localhost:8080/api/v1/films';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get(FILM_URL, config).then((jsonResponse) => {
      dispatch({
        type: 'SEARCH_FILMS_SUCCESS',
        payload: jsonResponse.data.films,
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
    films.map((film, index) => (
      <Film key={`${index}-${film.name}`} movie={film} />
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
