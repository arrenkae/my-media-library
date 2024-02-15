import { db } from '../config/db.js';

export const _getUserMedia = (user_id) => {
    return db('media').select('*').where({ user_id });
}

export const _saveMedia = (media) => {
    /* If the media exists in the current user's database, updates it (including the last modified date) */
    return db('media').insert({...media, user_update: new Date() })
    .onConflict(['user_id', 'api_id', 'type'])
    .merge()
    .returning('*');
};

export const _deleteMedia = (id) => {
    return db('media').del().where({ id }).returning('*');
}