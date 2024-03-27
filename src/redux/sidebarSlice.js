import { createSlice } from '@reduxjs/toolkit';

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        isSidebarOpen: sessionStorage.getItem('sidebarState') === null
            ? true
            : sessionStorage.getItem('sidebarState') === 'true',
    },
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
            sessionStorage.setItem('sidebarState', state.isSidebarOpen);
        },
    },
});

export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;