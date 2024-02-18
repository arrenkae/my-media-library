import express from 'express';
import { getTV, getMovies, getBooks, getGames } from '../controllers/search.controllers.js';

const search_router = express.Router();

search_router.get('/tv/:query', getTV);
search_router.get('/movies/:query', getMovies);
search_router.get('/books/:query', getBooks);
search_router.get('/games/:query', getGames);

export default search_router;