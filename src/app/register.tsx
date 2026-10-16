import {StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle} from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import InputSpinner from "react-native-input-spinner";

const GENDER_OPTIONS = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
];

interface ProfileInfo {

    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    height: number;
    weight: number;
}

export default function RegisterScreen() {
    const [info, setInfo] = useState<ProfileInfo>({
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

    const handleInputChange = (key: string, value: string | number): void => {
        setInfo((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Account info</Text>
                <LabeledTextInput
                    label={"Email"}
                    fieldKey={"email"}
                    value={info.email}
                    placeholder={"Enter your email"}
                    onChangeText={handleInputChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <LabeledTextInput
                    label={"Password"}
                    placeholder={"Enter your password"}
                    fieldKey={"password"}
                    value={info.password}
                    onChangeText={handleInputChange}
                    secureTextEntry
                />
                <LabeledTextInput
                    label={"Confirm Password"}
                    fieldKey={"confirmPassword"}
                    placeholder={"Confirm your password"}
                    value={info.confirmPassword}
                    onChangeText={handleInputChange}
                    secureTextEntry
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.title}>Profile info</Text>

                <View style={styles.row}>
                    <LabeledTextInput
                        containerStyle={styles.flexInput}
                        label={"First Name"}
                        fieldKey={"firstName"}
                        placeholder={"First Name"}
                        value={info.firstName}
                        onChangeText={handleInputChange}
                    />
                    <LabeledTextInput
                        containerStyle={styles.flexInput}
                        label={"Last Name"}
                        fieldKey={"lastName"}
                        placeholder={"Last Name"}
                        value={info.lastName}
                        onChangeText={handleInputChange}
                    />
                </View>

                <View style={styles.row}>
                    <LabeledTextInput
                        containerStyle={{ flex: 2 }}
                        label={"Date of Birth"}
                        fieldKey={"dateOfBirth"}
                        placeholder={"YYYY-MM-DD"}
                        value={info.dateOfBirth}
                        onChangeText={handleInputChange}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.labelText}>Gender</Text>
                        <Dropdown
                            style={[styles.input, styles.dropdown]}
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
                </View>

                <View style={styles.row}>
                    <View style={styles.flexInput}>
                        <Text style={styles.labelText}>Height</Text>
                        <InputSpinner
                            editable={true}
                            type="number"
                            max={250}
                            min={100}
                            step={1}
                            value={info.height}
                            onChange={(num: number) => handleInputChange("height", num)}
                            skin="clean"
                            color="white"
                            textColor="black"
                            fontSize={18}
                            style={styles.spinnerContainer}
                            buttonStyle={styles.spinnerButton}
                            append={<Text style={styles.unitText}>cm</Text>}
                        />
                    </View>

                    <View style={styles.flexInput}>
                        <Text style={styles.labelText}>Weight</Text>
                        <InputSpinner
                            editable={true}
                            type={"real"}
                            max={200}
                            min={30}
                            step={0.1}
                            precision={1}
                            value={info.weight}
                            onChange={(num: number) => handleInputChange("weight", num)}
                            skin="clean"
                            color="white"
                            textColor="black"
                            fontSize={18}
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
            <TouchableOpacity>
                <Text style={styles.goBackText}>Go back</Text>
            </TouchableOpacity>
        </View>
    );
}

export interface LabeledTextInputProps extends Omit<TextInputProps, "onChangeText"> {
    label: string;
    fieldKey: string;
    value: string;
    onChangeText: (fieldKey: string, text: string) => void;
    containerStyle?: ViewStyle;
}

export const LabeledTextInput: React.FC<LabeledTextInputProps> = ({
                                                                      label,
                                                                      fieldKey,
                                                                      placeholder,
                                                                      value,
                                                                      onChangeText,
                                                                      style,
                                                                      containerStyle,
                                                                      ...rest
                                                                  }) => {
    return (
        <View style={containerStyle}>
            <Text style={styles.labelText}>{label}</Text>
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                value={value}
                onChangeText={(text) => onChangeText(fieldKey, text)}
                {...rest}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    section: {
        marginBottom: 20,
        gap: 12,
    },
    title: {
        fontSize: 36,
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
        fontSize: 18,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "#000",
        width: "100%",
    },
    flexInput: {
        flex: 1,
    },
    dropdown: {
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 14,
        height: 48, // Matches standard TextInput height
        justifyContent: "center",
    },
    dropdownText: {
        fontSize: 18,
        color: "grey",
    },
    dropdownItemText: {
        fontSize: 18,
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
        fontSize: 18,
        marginRight: 8,
        alignSelf: "center",
    },
    button: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    labelText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 5,
        marginBottom: 5,
    },
    goBackText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        textDecorationLine: "underline",
        alignSelf: "center",
        padding: 10
    }
});