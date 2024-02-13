import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {current } from '@reduxjs/toolkit'
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialState = {
    library: [],
    load: 'idle',
    type: 'tv',
    status: 'All',
    sort: 'updated'
};

export const getMedia = createAsyncThunk("media/library", async() => {
  const response = await axios.get(`${BASE_URL}/media/library`, {
    withCredentials: true
  });
  return response.data;
});

export const saveMedia = createAsyncThunk("media/save", async(media) => {
  const response = await axios.post(`${BASE_URL}/media/save`, media, {
    withCredentials: true
  });
  return response.data;
});

export const deleteMedia = createAsyncThunk("media/delete", async(id) => {
  const response = await axios.delete(`${BASE_URL}/media/delete/${id}`, {
    withCredentials: true
  });
  return response.data;
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    filterType: (state, action) => {
      state.type = action.payload;
    },
    filterStatus: (state, action) => {
      state.status = action.payload;
    },
    selectSort: (state, action) => {
      state.sort = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getMedia.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(getMedia.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.library = action.payload;
    });
    builder.addCase(getMedia.rejected, (state, action) => {
      state.load = 'failed';
    });
    builder.addCase(saveMedia.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(saveMedia.fulfilled, (state, action) => {
      state.load = 'succeded';
    });
    builder.addCase(saveMedia.rejected, (state, action) => {
      state.load = 'failed';
    });
    builder.addCase(deleteMedia.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(deleteMedia.fulfilled, (state, action) => {
      state.load = 'succeded';
    });
    builder.addCase(deleteMedia.rejected, (state, action) => {
      state.load = 'failed';
    });
  },
});

export const library = (state) => state.media.library;
export const type = (state) => state.media.type;
export const status = (state) => state.media.status;
export const sort = (state) => state.media.sort;

export const { filterType, filterStatus, selectSort } = mediaSlice.actions;
export default mediaSlice.reducer;
