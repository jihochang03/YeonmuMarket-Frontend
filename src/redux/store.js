import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

// Import reducers
import userReducer from "./user-slice";
import ticketReducer from "./ticketSlice"; // ticketSlice 추가

// Combine all reducers
const reducers = combineReducers({
  user: userReducer,
  ticket: ticketReducer, // ticketReducer 추가
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "ticket"], // user와 ticket을 persist에 포함
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Configure Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
