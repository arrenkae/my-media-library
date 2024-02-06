import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    media: [],
    state: 'idle', // 'loading', 'succeded', 'failed'
    category: -1
};

const MEDIA_URL = '';

// export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
//   const response = await axios.get(POST_URL);
//   return response.data;
// });

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
  },
});

// export const { addpost, addreaction, filterAuthor } = mediaSlice.actions;
// export default mediaSlice.reducer;
