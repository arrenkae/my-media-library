import axios from "axios";
import dotenv from 'dotenv';

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
                    title: media.name,
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
    console.log(`https://www.googleapis.com/books/v1/volumes?q=${query}&api_key=AIzaSyDUuF29Q_jYmh4OrWQBR31LXTAQAqr2-FM`);
    try {
        const APIresponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&api_key=${process.env.BOOKS_API_KEY}`);
        if (APIresponse.data.totalItems != 0) {
            const results = APIresponse.data.items.map(media => {
                console.log(media.volumeInfo);
                return {
                    api_id: media.id,
                    title: media.volumeInfo.title,
                    author: media.volumeInfo.authors[0],
                    image: media.volumeInfo.imageLinks?.thumbnail ? media.volumeInfo.imageLinks.thumbnail : null,
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

export const getTVDetails = async(req, res) => {
    const {id} = req.params;
    try {
        const APIresponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TV_MOVIES_API_KEY}`);
        console.log(APIresponse.data);
        const media = {
            api_id: APIresponse.data.id,
            type: 'tv',
            title: APIresponse.data.name,
            image: APIresponse.data.poster_path ? `https://image.tmdb.org/t/p/w200${APIresponse.data.poster_path}` : null,
            description: APIresponse.data.overview,
            release_date: APIresponse.data.first_air_date,
            released: APIresponse.data.first_air_date ? new Date(APIresponse.data.first_air_date).getTime() < new Date().getTime() : false,
            update_date: APIresponse.data.last_air_date,
            progress_max: APIresponse.data.number_of_episodes,
            progress_seasons_max: APIresponse.data.number_of_seasons
        }
        res.status(200).json({media});
    } catch (error) {
        console.log('getTVDetails=>', error);
        res.status(404).json({msg: 'Unable to get media data'});
    }
}

export const getMovieDetails = async(req, res) => {
    const {id} = req.params;
    try {
        const APIresponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TV_MOVIES_API_KEY}`);
        console.log(APIresponse.data);
        const media = {
            api_id: APIresponse.data.id,
            type: 'movie',
            title: APIresponse.data.name,
            image: APIresponse.data.poster_path ? `https://image.tmdb.org/t/p/w200${APIresponse.data.poster_path}` : null,
            description: APIresponse.data.overview,
            release_date: APIresponse.data.release_date,
            released: APIresponse.data.release_date ? new Date(APIresponse.data.release_date).getTime() < new Date().getTime() : false,
            progress_max: APIresponse.data.runtime
        }
        res.status(200).json({media});
    } catch (error) {
        console.log('getMovieDetails=>', error);
        res.status(404).json({msg: 'Unable to get media data'});
    }
}

export const getBookDetails = async(req, res) => {
    const {id} = req.params;
    try {
        const APIresponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.BOOKS_API_KEY}`);
        console.log(APIresponse.data);
        const media = {
            api_id: APIresponse.data.id,
            type: 'book',
            title: APIresponse.data.volumeInfo.title,
            author: APIresponse.data.volumeInfo.authors[0],
            image: APIresponse.data.volumeInfo.imageLinks?.thumbnail ? APIresponse.data.volumeInfo.imageLinks?.thumbnail : null,
            description: APIresponse.data.volumeInfo.description,
            release_date: APIresponse.data.volumeInfo.publishedDate,
            released: APIresponse.data.volumeInfo.publishedDate ? new Date(APIresponse.data.volumeInfo.publishedDate).getTime() < new Date().getTime() : false,
            progress_max: APIresponse.data.volumeInfo.pageCount
        }
        res.status(200).json({media});
    } catch (error) {
        console.log('getBookDetails=>', error);
        res.status(404).json({msg: 'Unable to get media data'});
    }
}