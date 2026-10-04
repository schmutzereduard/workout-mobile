import {StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from "react-native";
import {useState} from "react";

export default function LoginScreen() {

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

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.forgotPasswordText}>Forgot password</Text>
            </View>

            <View style={styles.bottom}>
                <Text style={styles.accountText}>Don't have an account ?</Text>
                <Text style={styles.signUpText}>Sign up</Text>
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
        fontSize: 48,
        fontWeight: "bold",
        textAlign: "center"
    },
    middle: {

    },
    inputArea: {
        marginTop: 20,
        marginBottom: 20,
        gap: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "white",
        fontSize: 24,
        fontWeight: "bold",
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
        color: "black",
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