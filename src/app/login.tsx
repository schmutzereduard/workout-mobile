import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, ScrollView } from "react-native";
import { login } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { router } from "expo-router";

export default function LoginScreen() {
    const dispatch = useAppDispatch();
    const { backgroundColor, accentColor } = useAppSelector((state: any): any => state.sync);
    const { loginLoading } = useAppSelector((state: any): any => state.auth);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
            <View style={styles.top}>
                <Image
                    source={require('../../assets/images/dumbbell-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Welcome Back</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Login</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Username / Email</Text>
                    <TextInput
                        style={styles.input}
                        value={credentials.username}
                        onChangeText={(text) => setCredentials({...credentials, username: text})}
                        placeholder={"Enter your username"}
                        placeholderTextColor={"#666"}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={credentials.password}
                        onChangeText={(text) => setCredentials({...credentials, password: text})}
                        placeholder={"Enter your password"}
                        placeholderTextColor={"#666"}
                        secureTextEntry={true}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: accentColor }]}
                    onPress={() => dispatch(login({ username: credentials.username, password: credentials.password }))}
                >
                    {loginLoading ? (
                        <ActivityIndicator size={"small"} color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPasswordContainer}>
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottom}>
                <Text style={styles.accountText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={[styles.signUpText, { color: accentColor }]}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    top: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: "center",
        marginBottom: 10,
    },
    title: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center"
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#aaa",
        textTransform: "uppercase",
        marginBottom: 12,
        letterSpacing: 1,
    },
    inputGroup: {
        marginBottom: 12,
    },
    labelText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        backgroundColor: "#2A2A2A",
        borderWidth: 1,
        borderColor: "#3A3A3A",
        borderRadius: 8,
        fontSize: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "#FFF",
        width: "100%",
    },
    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 12,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    forgotPasswordContainer: {
        alignItems: "center",
        marginTop: 5,
    },
    forgotPasswordText: {
        color: "#aaa",
        fontSize: 15,
        fontWeight: "600",
        textDecorationLine: "underline",
    },
    bottom: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    accountText: {
        color: "#aaa",
        fontSize: 15,
        fontWeight: "600",
    },
    signUpText: {
        fontSize: 15,
        fontWeight: "bold",
        textDecorationLine: "underline",
    }
});