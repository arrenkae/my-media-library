import express from 'express';
import { register, login, refresh, updateUser, deleteUser } from '../controllers/users.controllers.js';
import { verifytoken } from '../middlewares/verifytoken.js';

const users_router = express.Router();

users_router.post('/register', register);
users_router.post('/login', login);
users_router.post('/refresh', refresh);
users_router.put('/update', verifytoken, updateUser);
users_router.delete('/delete', verifytoken, deleteUser);

users_router.get('/profile', verifytoken, (req, res) => {
    res.json({ msg: `Welcome, ${req.user.username}!` });
});

users_router.get('/verify', verifytoken, (req, res) => {
    res.sendStatus(200);
});

users_router.get('/logout', (req, res) => {
    res.status(200).clearCookie('token').json({ msg: 'Logged out'})
});

export default users_router;