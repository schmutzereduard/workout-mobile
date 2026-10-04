import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import InputSpinner from "react-native-input-spinner";

const GENDER_OPTIONS = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
];

export default function RegisterScreen() {
    const [info, setInfo] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        height: 150,
        weight: 65.0,
    });

    const handleInputChange = (key, value) => {
        setInfo((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Account info</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#888"
                    value={info.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    value={info.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#888"
                    value={info.confirmPassword}
                    onChangeText={(text) => handleInputChange("confirmPassword", text)}
                    secureTextEntry
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.title}>Profile info</Text>

                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.flexInput]}
                        placeholder="First Name"
                        placeholderTextColor="#888"
                        value={info.firstName}
                        onChangeText={(text) => handleInputChange("firstName", text)}
                    />
                    <TextInput
                        style={[styles.input, styles.flexInput]}
                        placeholder="Last Name"
                        placeholderTextColor="#888"
                        value={info.lastName}
                        onChangeText={(text) => handleInputChange("lastName", text)}
                    />
                </View>

                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 2 }]}
                        placeholder="Date of Birth"
                        value={info.dateOfBirth}
                        onChangeText={(text) => handleInputChange("dateOfBirth", text)}
                    />
                    <Dropdown
                        style={[styles.input, styles.dropdown, { flex: 1 }]}
                        placeholderStyle={styles.dropdownText}
                        selectedTextStyle={styles.dropdownText}
                        itemTextStyle={styles.dropdownItemText}
                        data={GENDER_OPTIONS}
                        placeholder={"M / F"}
                        labelField="label"
                        valueField="value"
                        value={info.gender}
                        onChange={(item) => handleInputChange("gender", item.value)}
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.flexInput}>
                        <InputSpinner
                            editable={true}
                            max={250}
                            min={100}
                            step={1}
                            value={info.height}
                            onChange={(num) => handleInputChange("height", num)}
                            skin="clean"
                            color="white"
                            textColor="black"
                            fontSize={24}
                            style={styles.spinnerContainer}
                            buttonStyle={styles.spinnerButton}
                            append={<Text style={styles.unitText}>cm</Text>}
                        />
                    </View>

                    <View style={styles.flexInput}>
                        <InputSpinner
                            editable={true}
                            type={"real"}
                            max={200}
                            min={30}
                            step={0.1}
                            precision={1}
                            value={info.weight}
                            onChange={(num) => handleInputChange("weight", num)}
                            skin="clean"
                            color="white"
                            textColor="black"
                            fontSize={24}
                            style={styles.spinnerContainer}
                            buttonStyle={styles.spinnerButton}
                            append={<Text style={styles.unitText}>kg</Text>}
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 100,
    },
    section: {
        marginBottom: 20,
        gap: 12,
    },
    title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "white",
        marginVertical: 8,
        alignSelf: "center",
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    input: {
        backgroundColor: "white",
        borderRadius: 8,
        fontSize: 24,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "#000",
        width: "100%",
    },
    flexInput: {
        flex: 1,
    },
    dropdown: {
        paddingVertical: 0,
        justifyContent: "center",
    },
    dropdownText: {
        fontSize: 24,
        color: "black",
    },
    dropdownItemText: {
        fontSize: 24,
        color: "black",
    },
    spinnerContainer: {
        borderRadius: 8,
        backgroundColor: "white",
        width: "100%",
        height: 48,
        shadowColor: "transparent",
    },
    spinnerButton: {
        borderRadius: 8,
    },
    unitText: {
        color: "gray",
        fontSize: 24,
        marginRight: 8,
        alignSelf: "center",
    },
    button: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10
    },
    buttonText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
});