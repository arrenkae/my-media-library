import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialState = {
  user: {},
  token: '',
  load: 'idle',
  error: ''
};

export const login = createAsyncThunk("users/login", async({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      username: credentials.username,
      password: credentials.password
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const register = createAsyncThunk("users/register", async(credentials) => {
  const response = await axios.post(`${BASE_URL}/users/register`, {
    username: credentials.username,
    password: credentials.password
  });
  return response.data;
});

export const verify = createAsyncThunk("users/verify", async(token) => {
  const response = await axios.get(`${BASE_URL}/users/verify`, {
    headers: {
        'x-access-token': token
    }
  })
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder.addCase(login.rejected, (state, action) => {
      state.load = 'failed';
    });
    builder.addCase(login.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.load = 'failed';
    });
    builder.addCase(register.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.load = 'succeded';
    });
    builder.addCase(verify.rejected, (state, action) => {
      state.load = 'failed';
    });
    builder.addCase(verify.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(verify.fulfilled, (state, action) => {
      state.load = 'succeded';
    });
  },
});

export default usersSlice.reducer;