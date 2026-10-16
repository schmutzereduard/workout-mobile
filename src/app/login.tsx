import {StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator} from "react-native";
import {useState} from "react";
import {login} from "@/store/authSlice";
import {useAppDispatch, useAppSelector} from "@/store/store";

export default function LoginScreen() {

    const dispatch = useAppDispatch();
    const { backgroundColor, accentColor } = useAppSelector((state: any): any => state.theme);
    const { loginLoading } = useAppSelector((state: any): any => state.auth);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.top}>
                <Image
                    source={require('../../assets/images/dumbbell-logo.png')}
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
                        placeholderTextColor={"grey"}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        value={credentials.password}
                        onChangeText={(text) => setCredentials({...credentials, password: text})}
                        placeholder={"Please enter your password"}
                        secureTextEntry={true}
                        placeholderTextColor={"grey"}
                    />
                </View>

                <TouchableOpacity style={[styles.button, { backgroundColor: accentColor }]} onPress={() => dispatch(login({ username: credentials.username, password: credentials.password }))}>
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
        flex: 1,
        justifyContent: "space-evenly",
        padding: 24
    },
    top: {
        alignItems: "center",
    },
    logo: {
        width: 180,
        height: 180,
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
