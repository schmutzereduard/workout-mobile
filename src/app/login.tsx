import {StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, Alert} from "react-native";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {login} from "@/store/authSlice";

export default function LoginScreen() {

    const dispatch = useDispatch();
    const { loginLoading } = useSelector(state => state.auth);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Image
                    source={require('../../assets/images/dumbbell.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Please login</Text>
            </View>

            <View style={styles.middle}>
                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        value={credentials.username}
                        onChangeText={(text) => setCredentials({...credentials, username: text})}
                        placeholder={"Please enter your username"}
                    />
                    <TextInput
                        style={styles.input}
                        value={credentials.password}
                        onChangeText={(text) => setCredentials({...credentials, password: text})}
                        placeholder={"Please enter your password"}
                        secureTextEntry={true}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={() => dispatch(login({ loginRequest: credentials }))}>
                    {loginLoading ?
                        <ActivityIndicator size={"large"}/> :
                        <Text style={styles.buttonText}>Login</Text>}
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>Forgot password</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottom}>
                <Text style={styles.accountText}>Don't have an account?</Text>
                <TouchableOpacity>
                    <Text style={styles.signUpText}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        justifyContent: "space-evenly",
        padding: 24
    },
    top: {
        alignItems: "center",
    },
    logo: {
        width: 260,
        height: 260,
        alignSelf: "center"
    },
    title: {
        color: "white",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center"
    },
    middle: {

    },
    inputArea: {
        marginBottom: 20,
        gap: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "white",
        fontSize: 24,
        paddingHorizontal: 15,
    },
    button: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10
    },
    buttonText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    forgotPasswordText: {
        color: "lightblue",
        fontSize: 24,
        fontWeight: "bold",
        textDecorationLine: "underline",
        textAlign: "center",
    },
    bottom: {

    },
    accountText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    signUpText: {
        color: "lightblue",
        fontSize: 24,
        fontWeight: "bold",
        textDecorationLine: "underline",
        textAlign: "center",
    }
});
