import { _getUserMedia, _saveMedia, _deleteMedia } from "../models/media.models.js";

export const getUserMedia = async(req, res) => {
    const { user_id } = req.params;
    try {
        const rows = await _getUserMedia(user_id);
        res.status(200).json(rows);
    } catch (error) {
        console.log('getUserMedia=>', error);
        res.status(404).json({msg: 'Unable to get media'});
    }
}

export const saveMedia = async(req, res) => {
    const media = req.body;

    try {
        const row = await _saveMedia(media);
        res.status(201).json(row[0]);
    } catch (error) {
        console.log('saveMedia=>', error);
        res.status(404).json({msg: 'Unable to save media'});
    }
}

export const updateMedia = async(req, res) => {
    const {id} = req.params;
    const media = req.body;
    try {
        const row = await _updateMedia(id, media);
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