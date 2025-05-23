import express from 'express';
import { register, login, updateUser, deleteUser } from '../controllers/users.controllers.js';
import { verifytoken } from '../middlewares/verifytoken.js';

const users_router = express.Router();

users_router.post('/register', register);
users_router.post('/login', login);
users_router.put('/update', verifytoken, updateUser);
users_router.delete('/delete', verifytoken, deleteUser);

users_router.get('/verify', verifytoken, (req, res) => {
    res.sendStatus(200);
});

users_router.get('/token', (req, res) => {
    /* Used to get token on the page refresh to keep the user logged in */
    const token = req.cookies.token || req.headers['x-access-token'];
    // TODO use server redirects
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