import { db } from '../config/db.js';

export const _getUserMedia = ( userId, type ) => {
    return db('media').select('*').where({ user_id: userId, media_type: type });
}

export const _addMedia = (userId, apiId, title, type, image, description, status, released, progress, progressMax, rating, releaseDate, updateDate) => {
    return db('media').insert({
        user_id: userId,
        api_id: apiId,
        title,
        media_type: type,
        image,
        description,
        status,
        released,
        progress,
        progress_max: progressMax,
        rating,
        release_date: releaseDate,
        update_date: updateDate
    })
    .returning('*');
};

export const _updateMedia = (id, title, image, description, status, released, progress, progressMax, rating, releaseDate, updateDate) => {
    return db('media').update({
        title,
        image,
        description,
        status,
        released,
        progress,
        progress_max: progressMax,
        rating,
        release_date: releaseDate,
        update_date: updateDate
    })
    .where({ id })
    .returning('*');
};

export const _deleteMedia = (id) => {
    return db('media').del().where({ id }).returning('*');
}

