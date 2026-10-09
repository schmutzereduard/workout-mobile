import axios from "axios";
import axiosRetry from "axios-retry";

export function createAxiosInstance(baseURL) {

    const instance = axios.create({
        baseURL: baseURL,
        timeout: Number(process.env.EXPO_PUBLIC_REQUEST_TIMEOUT),
    });

    axiosRetry(
        instance, {
            retries: Number(process.env.EXPO_PUBLIC_AXIOS_RETRIES),
            retryDelay: axiosRetry.exponentialDelay
        });

    return instance;
}
