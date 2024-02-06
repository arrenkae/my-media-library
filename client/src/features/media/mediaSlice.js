import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    library: [],
    search: [],
    load: 'idle',
    type: ''
};

export const searchMedia = createAsyncThunk("media/fetch", async(query) => {
  const response = await axios.request({
    method: 'GET',
    url: `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`,
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyN2RjNzg4Mjg0MjNkZDkzM2Q0ZWFkOTdkYzA1ZjBkYSIsInN1YiI6IjY1YzE0MzFiZmM2NTM4MDE3Y2VlOGM3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RbCKlCb9IOjvLWdw_RadPsKcVYd-aX5zhd8hWa0TNng'
    }
  });
  return response.data.results;
});

export const fetchMediaDetails = createAsyncThunk("media/details", async(apiId) => {
  const response = await axios.request({
    method: 'GET',
    url: `https://api.themoviedb.org/3/tv/${apiId}?language=en-US`,
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyN2RjNzg4Mjg0MjNkZDkzM2Q0ZWFkOTdkYzA1ZjBkYSIsInN1YiI6IjY1YzE0MzFiZmM2NTM4MDE3Y2VlOGM3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RbCKlCb9IOjvLWdw_RadPsKcVYd-aX5zhd8hWa0TNng'
    }
  });
  return response.data;
});

export const userMedia = createAsyncThunk("media/library", async() => {
  const response = await axios.get('http://localhost:3001/media/tv');
  return response.data;
});

export const addTVShow = createAsyncThunk("media/add", async(type, media) => {
  const response = await axios.post(`http://localhost:3001/media/add/${type}`, media);
  return response.data;
});

export const updateTVShow = createAsyncThunk("media/update", async(id, media) => {
  const response = await axios.put(`http://localhost:3001/media/update/${id}`, media);
  return response.data;
});

export const deleteTVShow = createAsyncThunk("media/delete", async(id, media) => {
  const response = await axios.put(`http://localhost:3001/media/delete/${id}`, media);
  return response.data;
});

const TVshowSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addMedia: {
      reducer(state, action) {
        state.library.push(action.payload);
      },
      prepare(userId, apiId, title, image, description, type, status, released, progress, progressMax, rating, releaseDate, updateDate) {
        return{
          payload: {
            userId,
            apiId,
            title,
            type,
            image,
            description,
            status,
            released,
            progress,
            progressMax,
            rating,
            releaseDate,
            updateDate
          }
        }
      }
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
    builder.addCase(fetchMediaDetails.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(fetchMediaDetails.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.search = action.payload;
    });
    builder.addCase(fetchMediaDetails.rejected, (state, action) => {
        state.load = 'failed';
    });
  },
});

export default mediaSlice.reducer;
