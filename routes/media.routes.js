import express from 'express';
import { getUserMedia, saveMedia, deleteMedia } from '../controllers/media.controllers.js';

const media_router = express.Router();

media_router.get('/:user_id', getUserMedia);
media_router.post('/save', saveMedia);
media_router.delete('/delete/:id', deleteMedia);

export default media_router;