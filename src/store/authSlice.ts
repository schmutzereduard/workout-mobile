import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthApi from "../api/AuthApi";
import { Alert } from "react-native";
import { LocalStorage, StorageKeys } from "@/utils/Storage";
import { LoginRequest, AuthState } from "@/types/auth";
import { ErrorDTO } from "@/types/error";
import axios from "axios";

const initialState: AuthState = {
    username: null,
    token: null,
    loginLoading: false,
};

export const login = createAsyncThunk<
    { username: string; token: string },
    LoginRequest,
    { rejectValue: ErrorDTO }
>(
    "auth/login",
    async ({ username, password }: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await AuthApi.login(username, password);
            return response.data;
        } catch (error: unknown) {

            if (axios.isAxiosError(error) && error.response?.data) {
                return rejectWithValue(error.response.data as ErrorDTO);
            }

            const err = error as Error;
            return rejectWithValue({
                status: 500,
                error: "Network Error",
                message: err.message || "Something went wrong",
                timestamp: new Date().toISOString(),
            });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        refreshToken: (state) => {
            state.token = LocalStorage.getString(StorageKeys.AUTH_TOKEN) || null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loginLoading = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loginLoading = false;
                if (action.payload) {
                    Alert.alert('Failed to login', action.payload.message);
                }
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loginLoading = false;
                state.username = action.payload.username;
                state.token = action.payload.token;
                LocalStorage.set(StorageKeys.AUTH_TOKEN, state.token);
            });
    },
});

export const { refreshToken } = authSlice.actions;
export default authSlice.reducer;