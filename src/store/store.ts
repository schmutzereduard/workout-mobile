import { configureStore } from '@reduxjs/toolkit';
import authSlice from "@/store/authSlice";
import themeSlice from "@/store/themeSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        theme: themeSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;