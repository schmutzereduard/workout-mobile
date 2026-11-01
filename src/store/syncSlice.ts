import { createSlice } from '@reduxjs/toolkit';
import {UserUtils} from "@/utils/Storage";

const syncSlice = createSlice({
    name: 'sync',
    initialState: {
        backgroundColor: '#121212',
        accentColor: '#FF0000',
    },
    reducers: {
        refreshTheme: (state) => {
            const preferences = UserUtils.getUserPreferences();
            if (preferences) {
                state.backgroundColor = preferences.backgroundColor;
                state.accentColor = preferences.accentColor;
            }
        },
        setThemeColors: (state, action) => {
            state.backgroundColor = action.payload.backgroundColor;
            state.accentColor = action.payload.accentColor;
        },
    },
});

export const { setThemeColors, refreshTheme } = syncSlice.actions;
export default syncSlice.reducer;