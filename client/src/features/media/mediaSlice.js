import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialState = {
    library: [],
    load: 'idle',
    message: null,
    type: 'tv',
    status: 'all',
    search: '',
    sort: 'updated',
    ascending: false
};

export const getMedia = createAsyncThunk("media/library", async(_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/media/library`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg ? error.response.data.msg : error.message);
  }
});

export const saveMedia = createAsyncThunk("media/save", async(media, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/media/save`, media, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg ? error.response.data.msg : error.message);
  }
});

export const deleteMedia = createAsyncThunk("media/delete", async(id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${BASE_URL}/media/delete/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg ? error.response.data.msg : error.message);
  }
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    filterType: (state, action) => {
      state.type = action.payload;
    },
    filterStatus: (state, action) => {
      state.status = action.payload;
    },
    selectSort: (state, action) => {
      state.sort = action.payload;
    },
    reverseSort: (state, action) => {
      state.ascending = !state.ascending;
    },
    searchLibrary: (state, action) => {
      state.search = action.payload;
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
      state.message = action.payload;
    });
    builder.addCase(saveMedia.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(saveMedia.fulfilled, (state, action) => {
      /* Doesn't need to save to the state.library because Details component immediately updates the library after saving */
      state.load = 'succeded';
      state.message = 'Library updated';
    });
    builder.addCase(saveMedia.rejected, (state, action) => {
      state.load = 'failed';
      state.message = action.payload;
    });
    builder.addCase(deleteMedia.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(deleteMedia.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.message = 'Deleted successfully';
    });
    builder.addCase(deleteMedia.rejected, (state, action) => {
      state.load = 'failed';
      state.message = action.payload;
    });
  },
});

export const library = (state) => state.media.library;
export const type = (state) => state.media.type;
export const status = (state) => state.media.status;
export const search = (state) => state.media.search;
export const sort = (state) => state.media.sort;
export const ascending = (state) => state.media.ascending;

export const { setMessage, filterType, filterStatus, selectSort, reverseSort, searchLibrary } = mediaSlice.actions;
export default mediaSlice.reducer;
