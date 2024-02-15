import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialState = {
  user: null,
  token: null,
  load: 'idle',
  message: null
};

export const getToken = createAsyncThunk("users/token", async(_, {rejectWithValue}) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/token`, {
        withCredentials: true
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg ? error.response.data.msg : error.message);
  }
});

export const login = createAsyncThunk("users/login", async({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
        username,
        password
    },
    {
        withCredentials: true
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg ? error.response.data.msg : error.message);
  }
});

export const register = createAsyncThunk("users/register", async({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, {
        username,
        password
    },
    {
        withCredentials: true
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg ? error.response.data.msg : error.message);
  }
});

export const logout = createAsyncThunk("users/logout", async(_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/logout`, {
        withCredentials: true
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg ? error.response.data.msg : error.message);
  }
});

export const verify = createAsyncThunk("users/verify", async(token, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/verify`, {
        headers: {
            'x-access-token': token ? token : ''
        },
        withCredentials: true
    })
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg ? error.response.data.msg : error.message);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getToken.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.token = action.payload.token;
      /* User information is decoded from the token */
      const decode = jwtDecode(action.payload.token);
      state.user = decode.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.load = 'failed';
      state.message = action.payload;
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
      state.message = action.payload;
    });
    builder.addCase(register.pending, (state, action) => {
      state.load = 'loading';
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.message = 'Registration successful!';
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.load = 'succeded';
      state.user = null;
      state.token = null;
    });
    builder.addCase(verify.rejected, (state, action) => {
      state.load = 'failed';
    });
    builder.addCase(verify.fulfilled, (state, action) => {
      state.load = 'succeded';
    });
  },
});

export const { setMessage } = usersSlice.actions;
export default usersSlice.reducer;