import { db } from '../config/db.js';

export const _register = (username, password) => {
    return db('users').insert({username, password}, ['id', 'username']);
};

export const _login = (username) => {
    return db('users').select('id', 'username', 'password').where({ username });
};

export const _updateUser = (id, username, password) => {
    return db('users').update({username, password}).where({ id }).returning(['id', 'username']);
}

export const _deleteUser = (id) => {
    return db('users').del().where({ id }).returning(['id', 'username']);
}