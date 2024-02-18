import express from 'express';
import { getTVDetails, getMovieDetails, getBookDetails, getGameDetails } from '../controllers/details.controllers.js';

const details_router = express.Router();

details_router.get('/tv/:id', getTVDetails);
details_router.get('/movies/:id', getMovieDetails);
details_router.get('/books/:id', getBookDetails);
details_router.get('/games/:id', getGameDetails);

export default details_router;