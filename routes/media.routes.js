import express from 'express';
import { getUserMedia, saveMedia, deleteMedia } from '../controllers/media.controllers.js';
import { verifytoken } from '../middlewares/verifytoken.js';

const media_router = express.Router();

media_router.get('/library', verifytoken, getUserMedia);
media_router.post('/save', verifytoken, saveMedia);
media_router.delete('/delete/:id', verifytoken, deleteMedia);

export default media_router;