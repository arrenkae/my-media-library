import { configureStore } from "@reduxjs/toolkit";

import mediaReducer from "../features/books/mediaSlice";

const store = configureStore({
  reducer: {
    media: mediaReducer,
  },
});

export default store;