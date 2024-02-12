import { configureStore } from "@reduxjs/toolkit";

import mediaReducer from "../features/media/mediaSlice"
import usersReducer from "../features/users/usersSlice";

const store = configureStore({
  reducer: {
    media: mediaReducer,
    users: usersReducer
  },
});

export default store;