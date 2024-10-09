// Step 1
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import userReducer from './user-slice';

// Step 2
const reducers = combineReducers({
  user: userReducer,
});

// Step 3
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'darkMode'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

// Step 4
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;