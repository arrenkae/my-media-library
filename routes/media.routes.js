import express from 'express';
import { getUserMedia, addMedia, updateMedia, deleteMedia } from '../controllers/media.controllers.js';
import { verifytoken } from '../middlewares/verifytoken.js';

const media_router = express.Router();

media_router.get('/:type', verifytoken, getUserMedia);
media_router.post('/add/:type', verifytoken, addMedia);
media_router.post('/update/:id', verifytoken, updateMedia);
media_router.post('/delete/:id', verifytoken, deleteMedia);

export default media_router;