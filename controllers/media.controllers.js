import { _getUserMedia, _addMedia, _updateMedia, _deleteMedia } from "../models/media.models.js";

export const getUserMedia = async(req, res) => {
    const userId = req.user.id;
    const {type} = req.params;
    try {
        const rows = await _getUserMedia(userId, type);
        res.status(200).json(rows);
    } catch (error) {
        console.log('getUserMedia=>', error);
        res.status(404).json({msg: 'Unable to get media'});
    }
}

export const addMedia = async(req, res) => {
    const userId = req.user.id;
    const {type} = req.params;
    const {apiId, title, image, description, status, released, progress, progressMax, rating, releaseDate, updateDate} = req.body;

    try {
        const row = await _addMedia(userId, apiId, title, type, image, description, status, released, progress, progressMax, rating, releaseDate, updateDate);
        res.status(201).json(row);
    } catch (error) {
        console.log('addMedia=>', error);
        res.status(404).json({msg: 'Unable to add media'});
    }
}

export const updateMedia = async(req, res) => {
    const {id} = req.params;
    const {title, image, description, status, released, progress, progressMax, rating, releaseDate, updateDate} = req.body;
    try {
        const row = await _updateMedia(id, title, image, description, status, released, progress, progressMax, rating, releaseDate, updateDate);
        res.status(201).json(row);
    } catch (error) {
        console.log('updateMedia=>', error);
        res.status(404).json({msg: 'Unable to update media'});
    }
}

export const deleteMedia = async(req, res) => {
    const {id} = req.params;
    try {
        const row = await _deleteMedia(id);
        res.status(200).json(row);
    } catch (error) {
        console.log('deleteMedia=>', error);
        res.status(404).json({msg: 'Unable to delete media'});
    }
}