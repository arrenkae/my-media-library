import express from 'express';
import { getTV, getMovies, getBooks } from '../controllers/search.controllers.js';

const search_router = express.Router();

search_router.get('/tv/:query', getTV);
search_router.get('/movies/:query', getMovies);
search_router.get('/books/:query', getBooks);

export default search_router;