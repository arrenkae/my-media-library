import { configureStore } from "@reduxjs/toolkit";

import mediaReducer from "../features/media/mediaSlice";

const store = configureStore({
  reducer: {
    media: mediaReducer,
  },
});

export default store;