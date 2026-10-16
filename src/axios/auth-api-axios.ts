import {createAxiosInstance} from "./axios-instance";
import {AxiosInstance} from "axios";

const instance: AxiosInstance = createAxiosInstance(process.env.EXPO_PUBLIC_AUTH_SERVICE_BASE_URL || "");

export default instance;