import {createAxiosInstance} from "./axios-instance";

const instance = createAxiosInstance(process.env.EXPO_PUBLIC_AUTH_SERVICE_BASE_URL);

export default instance;