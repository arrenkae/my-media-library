import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

/* Data from different external APIs returned in the same format */

export const getTV = async(req, res) => {
    const {query} = req.params;
    try {
        const APIresponse = await axios.get(`https://api.themoviedb.org/3/search/tv?query=${query}&api_key=${process.env.TV_MOVIES_API_KEY}`);
        if (APIresponse.data.results.length > 0) {
            const results = APIresponse.data.results.map(media => {
                return {
                    api_id: media.id,
                    title: media.name,
                    image: media.poster_path ? `https://image.tmdb.org/t/p/w200${media.poster_path}` : null,
                }
            })
            res.status(200).json({results});
        } else {
            res.status(404).json({msg: `No results for ${query}`});
        }
    } catch (error) {
        console.log('getTV=>', error);
        res.status(404).json({msg: 'Search error'});
    }
}

export const getMovies = async(req, res) => {
    const {query} = req.params;
    try {
        const APIresponse = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${process.env.TV_MOVIES_API_KEY}`);
        if (APIresponse.data.results.length > 0) {
            const results = APIresponse.data.results.map(media => {
                return {
                    api_id: media.id,
                    title: media.title,
                    image: media.poster_path ? `https://image.tmdb.org/t/p/w200${media.poster_path}` : null,
                }
            })
            res.status(200).json({results});
        } else {
            res.status(404).json({msg: `No results for ${query}`});
        }
    } catch (error) {
        console.log('getMovies=>', error);
        res.status(404).json({msg: 'Search error'});
    }
}

export const getBooks = async(req, res) => {
    const {query} = req.params;
    try {
        const APIresponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20&api_key=${process.env.BOOKS_API_KEY}`);
        if (APIresponse.data.totalItems > 0) {
            const results = APIresponse.data.items.map(media => {
                return {
                    api_id: media.id,
                    title: media.volumeInfo.title,
                    author: media.volumeInfo.authors ? media.volumeInfo.authors[0] : null,
                    image: media.volumeInfo.imageLinks?.thumbnail ? media.volumeInfo.imageLinks.thumbnail.replace('http:/', 'https:/') : null,
                }
            })
            res.status(200).json({results});
        } else {
            res.status(404).json({msg: `No results for ${query}`});
        }
    } catch (error) {
        console.log('getBooks=>', error);
        res.status(404).json({msg: 'Search error'});
    }
}