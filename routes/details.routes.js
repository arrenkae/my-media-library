import express from 'express';
import { getTVDetails, getMovieDetails, getBookDetails } from '../controllers/details.controllers.js';

const details_router = express.Router();

details_router.get('/tv/:id', getTVDetails);
details_router.get('/movies/:id', getMovieDetails);
details_router.get('/books/:id', getBookDetails);

export default details_router;