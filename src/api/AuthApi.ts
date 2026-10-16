import instance from "../axios/auth-api-axios";

class AuthApi {
    static login(username: string, password: string) {
        return instance.post(
            "/authenticate",
            {},
            {
                auth: {
                    username: username,
                    password: password,
                },
            }
        );
    }
}

export default AuthApi;