import { _register, _login, _updateUser, _deleteUser } from "../models/users.models.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.ACCESS_TOKEN_SECRET;

export const register = async(req, res) => {
    const { username, password } = req.body;

    /* Encrypting the password for the database */
    const salt = bcrypt.genSaltSync(10);
    const hashedpwd = bcrypt.hashSync(password + "", salt);

    try {
        const row = await _register(username, hashedpwd);
        res.json(row);
    } catch (error) {
        console.log('register=>', error);
        res.status(404).json({msg: 'User already exists'});
    }
}

export const login = async(req, res) => {
    // TODO try catch only for parts that can give errors
    try {
        const {username, password} = req.body;
        // TODO only login if username & password exist and are strings
        const row = await _login(username);
        if (!row.length) {
            return res.status(403).json({msg: 'Username not found'});
        }
        // TODO wtf is happening here, just check if password is string
        const match = bcrypt.compareSync(password + "", row[0].password);
        // TODO return same error message for invalid username & password
        if (!match) return res.status(403).json({msg: 'Invalid password'});
        // TODO protection from password bruteforcing

        const user = {
            id: row[0].id,
            username: row[0].username
        }

        const token = jwt.sign({ user }, secret);

        res.cookie('token', token, { httpOnly: true, maxAge: 3600000, secure: true, sameSite: "Strict" });
        res.status(200).json({token, user, msg: 'Login successful'});

    } catch (error) {
        console.log('login=>', error);
        res.status(400).json({msg: 'Unable to login'});
    }
}

export const updateUser = async(req, res) => {
    const id = req.user.id;
    const { username, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedpwd = bcrypt.hashSync(password + "", salt);

    try {
        const row = await _updateUser(id, username, hashedpwd);
        res.status(200).json({msg: 'User updated successfully'});
    } catch (error) {
        console.log('updateUser=>', error);
        res.status(404).json({msg: 'Cannot update'});
    }
}

export const deleteUser = async(req, res) => {
    const id = req.user.id;
    try {
        const row = await _deleteUser(id);
        res.status(200).clearCookie('token').json({msg: 'User deleted successfully'});
    } catch (error) {
        console.log('deleteUser=>', error);
        res.status(404).json({msg: 'Cannot delete'});
    }
}