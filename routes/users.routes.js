import express from 'express';
import { register, login, updateUser, deleteUser } from '../controllers/users.controllers.js';
import { verifytoken } from '../middlewares/verifytoken.js';

const users_router = express.Router();

users_router.post('/register', register);
users_router.post('/login', login);
users_router.put('/update', verifytoken, updateUser);
users_router.delete('/delete', verifytoken, deleteUser);


users_router.get('/profile', verifytoken, (req, res) => {
    res.json({ msg: `Welcome, ${req.user.username}!` });
});

users_router.get('/verify', verifytoken, (req, res) => {
    res.sendStatus(200);
});

users_router.get('/token', (req, res) => {
    const token = req.cookies.token || req.headers['x-access-token'];
    console.log('Token from the server=> ', token);
    if (token) {
        res.status(200).json({token});
    } else {
        res.status(404).json({msg: 'No token'});
    }
});

users_router.get('/logout', (req, res) => {
    res.status(200).clearCookie('token').json({ msg: 'Logged out'})
});

export default users_router;