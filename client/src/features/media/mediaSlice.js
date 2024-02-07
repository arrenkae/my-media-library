import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const initialState = {
    library: [],
    search: [],
    media: {},
    load: 'idle'
};

export const searchMedia = createAsyncThunk("media/fetch", async(query) => {
  const response = await axios.get(`https://api.themoviedb.org/3/search/tv?query=${query}&api_key=${API_KEY}`);
  return response.data.results;
});

export const fetchMediaDetails = createAsyncThunk("media/details", async(apiId) => {
  const response = await axios.get(`https://api.themoviedb.org/3/tv/${apiId}?api_key=${API_KEY}`);
  return response.data;
});

export const userMedia = createAsyncThunk("media/library", async() => {
  const response = await axios.get(`${BASE_URL}/media/tv`);
  return response.data;
});

export const addMedia = createAsyncThunk("media/add", async(userId, type, media) => {
  if (Object.keys(media).length > 0) {
    const response = await axios.post(`${BASE_URL}/media/add/${type}`, media);
    return response.data;
  }
});

export const updateMedia = createAsyncThunk("media/update", async(id, media) => {
  if (Object.keys(media).length > 0) {
    const response = await axios.put(`${BASE_URL}/media/update/${id}`, media);
    return response.data;
  }
});

export const deleteMedia = createAsyncThunk("media/delete", async(id) => {
  const response = await axios.put(`${BASE_URL}/media/delete/${id}`);
  return response.data;
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    resetSearch: (state, action) => {
      state.search = [];
    }
  },
  extraReducers(builder) {
    builder.addCase(searchMedia.pending, (state, action) => {
        state.load = 'loading';
      });
    builder.addCase(searchMedia.fulfilled, (state, action) => {
        state.load = 'succeded';
        state.search = action.payload;
    });
    builder.addCase(searchMedia.rejected, (state, action) => {
        state.load = 'failed';
    });
    builder.addCase(fetchMediaDetails.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(fetchMediaDetails.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.media = {
        title: action.payload.original_name,
        type: 'tv',
        image: `https://image.tmdb.org/t/p/w200${action.payload.poster_path}`,
        description: action.payload.overview,
        status: null,
        released: !action.payload.in_production,
        progress: null,
        progress_max: action.payload.number_of_episodes,
        rating: null,
        release_date: action.payload.first_air_date,
        update_date: action.payload.last_air_date
      }
    });
    builder.addCase(fetchMediaDetails.rejected, (state, action) => {
        state.load = 'failed';
    });
    builder.addCase(userMedia.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(userMedia.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.library = action.payload;
    });
    builder.addCase(userMedia.rejected, (state, action) => {
      state.load = 'failed';
    });
    builder.addCase(addMedia.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(addMedia.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.library.push(action.payload);
    });
    builder.addCase(addMedia.rejected, (state, action) => {
      state.load = 'failed';
    });
    builder.addCase(updateMedia.pending, (state, action) => {
      state.load = 'loading';
      state.library = state.library.map(element => element.id == action.payload.id ? action.payload : element);
    });
    builder.addCase(updateMedia.fulfilled, (state, action) => {
      state.load = 'succeded';
    });
    builder.addCase(updateMedia.rejected, (state, action) => {
      state.load = 'failed';
    });
    builder.addCase(deleteMedia.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(deleteMedia.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.library = state.library.filter(element => element.id != action.payload.id);
    });
    builder.addCase(deleteMedia.rejected, (state, action) => {
      state.load = 'failed';
    });
  },
});

export const { resetSearch } = mediaSlice.actions;
export default mediaSlice.reducer;
