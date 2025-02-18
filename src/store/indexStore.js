import { applyMiddleware, combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

import { articlesReducer } from "./articlesReducer";

const rootReducer = combineReducers({
  articlesReducer,
});

export const store = configureStore(
  {
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  },
  applyMiddleware(thunk)
);
