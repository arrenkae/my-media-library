import express from 'express';
import { getTV, getMovies, getBooks, getTVDetails, getMovieDetails, getBookDetails } from '../controllers/search.controllers.js';

const search_router = express.Router();

search_router.get('/tv/q=:query', getTV);
search_router.get('/movie/q=:query', getMovies);
search_router.get('/book/q=:query', getBooks);
search_router.get('/tv/details/:id', getTVDetails);
search_router.get('/movie/details/:id', getMovieDetails);
search_router.get('/book/details/:id', getBookDetails);

export default search_router;