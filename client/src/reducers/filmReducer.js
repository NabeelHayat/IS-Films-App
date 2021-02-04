export const initialState = {
  loading: true,
  films: [],
  errorMessage: null
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_FILMS_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_FILMS_SUCCESS":
      return {
        ...state,
        loading: false,
        films: action.payload
      };
    case "SEARCH_FILMS_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};