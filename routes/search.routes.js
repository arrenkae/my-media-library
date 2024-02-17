import express from 'express';
import { getTV, getMovies, getBooks } from '../controllers/search.controllers.js';

const search_router = express.Router();

search_router.get('/tv/:query', getTV);
search_router.get('/movie/:query', getMovies);
search_router.get('/book/:query', getBooks);

export default search_router;