import instance from "../axios/auth-api-axios";

class AuthApi {
    static login(loginRequest) {
        return instance.post(
            "/authenticate",
            {}, // Request body payload (pass empty object or body payload required by server)
            {
                auth: {
                    username: loginRequest.username,
                    password: loginRequest.password,
                },
            }
        );
    }
}

export default AuthApi;