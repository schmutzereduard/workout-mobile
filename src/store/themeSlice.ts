import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        backgroundColor: '#121212',
        accentColor: '#FF0000',
    },
    reducers: {
        setThemeColors: (state: any, action: any): void => {
            state.backgroundColor = action.payload.backgroundColor;
            state.accentColor = action.payload.accentColor;
        },
    },
});

export const { setThemeColors } = themeSlice.actions;
export default themeSlice.reducer;