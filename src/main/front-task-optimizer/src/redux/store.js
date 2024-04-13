import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarReducer.js';

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
    },
});