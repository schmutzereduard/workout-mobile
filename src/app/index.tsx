import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";

export default function LoginScreen() {

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please login</Text>

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
            <View style={styles.buttonsArea}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
        padding: 24
    },
    title: {
        color: "white",
        fontSize: 48,
        fontWeight: "bold",
        textAlign: "center"
    },
    inputArea: {
        marginTop: 20,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "gray",
    },
    buttonsArea :{
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 12
    },
    button: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
    }
});