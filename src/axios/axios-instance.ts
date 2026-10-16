import axios, {AxiosInstance} from "axios";
import axiosRetry from "axios-retry";

export function createAxiosInstance(baseURL: string): AxiosInstance {

    const instance: AxiosInstance = axios.create({
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
