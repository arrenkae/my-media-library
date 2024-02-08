import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {current } from '@reduxjs/toolkit'
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const initialState = {
    library: [],
    search: [],
    load: 'idle',
};

export const searchMedia = createAsyncThunk("media/search", async(query) => {
  const response = await axios.get(`https://api.themoviedb.org/3/search/tv?query=${query}&api_key=${API_KEY}`);
  return response.data.results;
});

// export const fetchMedia = createAsyncThunk("media/fetch", async(apiId) => {
//   const response = await axios.get(`https://api.themoviedb.org/3/tv/${apiId}?api_key=${API_KEY}`);
//   return response.data;
// });

export const userMedia = createAsyncThunk("media/library", async(user_id) => {
  const response = await axios.get(`${BASE_URL}/media/${user_id}`);
  return response.data;
});

export const saveMedia = createAsyncThunk("media/save", async(media) => {
  const response = await axios.post(`${BASE_URL}/media/save`, media);
  return response.data;
});

export const deleteMedia = createAsyncThunk("media/delete", async(id) => {
  const response = await axios.delete(`${BASE_URL}/media/delete/${id}`);
  return response.data;
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    resetSearch: (state, action) => {
      state.search = [];
    },
    resetFetch: (state, action) => {
      state.fetched = null;
    },
    editMedia: (state, action) => {
      state.media = action.payload;
    },
    sortMedia: (state, action) => {
      state.sort = action.payload;
    },
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
    // builder.addCase(fetchMedia.pending, (state, action) => {
    //   state.load = 'loading';
    // });
    // builder.addCase(fetchMedia.fulfilled, (state, action) => {
    //   state.load = 'succeded';
    //   state.fetched = {
    //     api_id: action.payload.id,
    //     title: action.payload.name,
    //     type: 'tv',
    //     image: `https://image.tmdb.org/t/p/w200${action.payload.poster_path}`,
    //     description: action.payload.overview,
    //     released: action.payload.status !== 'In Production',
    //     progress_max: action.payload.number_of_episodes,
    //     release_date: action.payload.first_air_date,
    //     update_date: action.payload.last_air_date
    //   };
    // });
    // builder.addCase(fetchMedia.rejected, (state, action) => {
    //     state.load = 'failed';
    // });
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
    builder.addCase(saveMedia.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(saveMedia.fulfilled, (state, action) => {
      state.load = 'succeded';
      if (state.library.some(element => element.id === action.payload.id)) {
        state.library = state.library.map(element => element.id === action.payload.id ? {...element, ...action.payload} : element)
      } else {
        state.library.push(action.payload);
      }
    });
    builder.addCase(saveMedia.rejected, (state, action) => {
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

export const { resetSearch, resetFetch, editMedia, sortMedia } = mediaSlice.actions;
export default mediaSlice.reducer;
