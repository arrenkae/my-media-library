import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

/* Data from different external APIs returned in the same format */

export const getTVDetails = async(req, res) => {
    const {id} = req.params;
    try {
        const APIresponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TV_MOVIES_API_KEY}`);
        /* Filters out 'specials' seasons that are not part of the main show and future seasons since they mess up progress tracking */
        const media_seasons = APIresponse.data.seasons.filter(season => season.name.startsWith('Season') && season.air_date && new Date(season.air_date).getTime() < new Date().getTime());
        const media = {
            api_id: APIresponse.data.id,
            type: 'tv',
            title: APIresponse.data.name,
            image: APIresponse.data.poster_path ? `https://image.tmdb.org/t/p/w200${APIresponse.data.poster_path}` : null,
            description: APIresponse.data.overview,
            release_date: APIresponse.data.first_air_date,
            /* Checks if the released date in the future to determine if media is released or not */
            released: APIresponse.data.first_air_date ? new Date(APIresponse.data.first_air_date).getTime() < new Date().getTime() : false,
            update_date: APIresponse.data.last_air_date,
            /* Counts total for all seasons to avoid discrepancies between seasons episode count and number_of_episodes value */
            progress_max: media_seasons.length > 0 ?
                media_seasons.reduce((total, season) => {
                    return total + season.episode_count;
                }, 0)
                : APIresponse.data.number_of_episodes,
            /* Seasons data is saved only for shows with more than 1 season */
            seasons: media_seasons.length > 1 ?
                media_seasons.map((season, index) => [
                    index+1,
                    media_seasons.slice(0, index+1).reduce((total, season) => {
                        return total + season.episode_count;
                    }, 0)
                ])
                : null
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
        const media = {
            api_id: APIresponse.data.id,
            type: 'movies',
            title: APIresponse.data.title,
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
        const media = {
            api_id: APIresponse.data.id,
            type: 'books',
            title: APIresponse.data.volumeInfo.title,
            author: APIresponse.data.volumeInfo.authors ? APIresponse.data.volumeInfo.authors[0] : null,
            image: APIresponse.data.volumeInfo.imageLinks?.thumbnail ? APIresponse.data.volumeInfo.imageLinks?.thumbnail.replace('http:/', 'https:/') : null,
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

export const getGameDetails = async(req, res) => {
    const {id} = req.params;
    try {
        const APIresponse = await axios.get(`https://api.rawg.io/api/games/${id}?key=${process.env.GAMES_API_KEY}`);
        const media = {
            api_id: APIresponse.data.id,
            type: 'games',
            title: APIresponse.data.name,
            image: APIresponse.data.background_image ?
            `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/fetch/ar_2:3,c_crop,g_auto,h_1.00/c_scale,h_300,w_200/${APIresponse.data.background_image}` : null,
            description: APIresponse.data.description,
            release_date: APIresponse.data.released,
            released: APIresponse.data.released ? new Date(APIresponse.data.released).getTime() < new Date().getTime() : false,
            /* Games don't have fixed length, so progress is tracked as percentage */
            progress_max: 100
        }
        res.status(200).json({media});
    } catch (error) {
        console.log('getGameDetails=>', error);
        res.status(404).json({msg: 'Unable to get media data'});
    }
}