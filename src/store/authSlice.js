import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import AuthApi from "../api/AuthApi";
import {Alert} from "react-native";

export const login = createAsyncThunk(
    "auth/login",
    async ({ loginRequest}, { rejectWithValue }) => {
        try {
            console.log("loginRequest", loginRequest);
            const response = await AuthApi.login(loginRequest);
            return response.data;
        } catch (error) {

            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }

            return rejectWithValue({
                status: 500,
                error: "Network Error",
                message: error.message || "Something went wrong",
                timestamp: new Date().toISOString(),
            });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        username: null,
        token: null,
        loginLoading: false,
        loginError: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state => {
                state.loginLoading = true;
                state.loginError = null;
            }))
            .addCase(login.rejected, (state, action) => {
                state.loginLoading = false;
                state.loginError = action.payload;
                Alert.alert('Failed to login', state.loginError.message);
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loginLoading = false;
                state.loginError = null;
                state.username = action.payload.username;
                state.token = action.payload.token;
            });
    },
});

export default authSlice.reducer;