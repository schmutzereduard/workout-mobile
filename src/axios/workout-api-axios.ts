import {createAxiosInstance} from "./axios-instance";
import {AxiosInstance} from "axios";

const instance: AxiosInstance = createAxiosInstance(process.env.EXPO_PUBLIC_WORKOUT_API_BASE_URL || "");

instance.interceptors.request.use(
    (config) => {
        //Use token here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.data) {
            error.message = error.response.data;
        }
        return Promise.reject(error);
    }
);

export default instance;