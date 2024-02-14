import { db } from '../config/db.js';
import knex from 'knex';

export const _getUserMedia = (user_id) => {
    return db('media').select('*').where({ user_id });
}

export const _saveMedia = (media) => {
    return db('media').insert({...media, user_update: new Date() })
    .onConflict(['user_id', 'api_id', 'type'])
    .merge()
    .returning('*');
};

export const _deleteMedia = (id) => {
    return db('media').del().where({ id }).returning('*');
}