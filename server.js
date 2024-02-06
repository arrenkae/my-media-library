import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import users_router from "./routes/users.routes.js";
import media_router from "./routes/media.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server runs on port ${process.env.PORT || 3001}`);
});

app.use('/users', users_router);
app.use('/media', media_router);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  });