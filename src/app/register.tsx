import React, { useState, useRef } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle, ScrollView } from "react-native";
import { useAppSelector } from "@/store/store";
import NumberStepper from "@/components/NumberStepper";
import ActionMenu, { AnchorRect } from "@/components/ActionMenu";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
    const { accentColor, backgroundColor } = useAppSelector((state: any) => state.sync);

    const [info, setInfo] = useState<ProfileInfo>({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        height: 170,
        weight: 70.0,
    });

    const [genderMenuAnchor, setGenderMenuAnchor] = useState<AnchorRect | null>(null);
    const genderButtonRef = useRef<View>(null);

    const handleInputChange = (key: string, value: string | number): void => {
        setInfo((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleOpenGenderMenu = () => {
        genderButtonRef.current?.measureInWindow((x, y, width, height) => {
            setGenderMenuAnchor({ x, y, width, height });
        });
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Account Info</Text>
                <LabeledTextInput
                    label={"Email"}
                    fieldKey={"email"}
                    value={info.email}
                    placeholder={"Enter your email"}
                    placeholderTextColor="#666"
                    onChangeText={handleInputChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <LabeledTextInput
                    label={"Password"}
                    placeholder={"Enter your password"}
                    placeholderTextColor="#666"
                    fieldKey={"password"}
                    value={info.password}
                    onChangeText={handleInputChange}
                    secureTextEntry
                />
                <LabeledTextInput
                    label={"Confirm Password"}
                    fieldKey={"confirmPassword"}
                    placeholder={"Confirm your password"}
                    placeholderTextColor="#666"
                    value={info.confirmPassword}
                    onChangeText={handleInputChange}
                    secureTextEntry
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Profile Info</Text>

                <View style={styles.row}>
                    <LabeledTextInput
                        containerStyle={styles.flexInput}
                        label={"First Name"}
                        fieldKey={"firstName"}
                        placeholder={"First"}
                        placeholderTextColor="#666"
                        value={info.firstName}
                        onChangeText={handleInputChange}
                    />
                    <LabeledTextInput
                        containerStyle={styles.flexInput}
                        label={"Last Name"}
                        fieldKey={"lastName"}
                        placeholder={"Last"}
                        placeholderTextColor="#666"
                        value={info.lastName}
                        onChangeText={handleInputChange}
                    />
                </View>

                <View style={styles.row}>
                    <LabeledTextInput
                        containerStyle={{ flex: 1.5 }}
                        label={"Date of Birth"}
                        fieldKey={"dateOfBirth"}
                        placeholder={"YYYY-MM-DD"}
                        placeholderTextColor="#666"
                        value={info.dateOfBirth}
                        onChangeText={handleInputChange}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.labelText}>Gender</Text>
                        <View ref={genderButtonRef} collapsable={false}>
                            <TouchableOpacity
                                style={styles.genderSelectButton}
                                onPress={handleOpenGenderMenu}
                            >
                                <Text style={[styles.genderButtonText, !info.gender && { color: "#666" }]}>
                                    {info.gender === "M" ? "Male" : info.gender === "F" ? "Female" : "Select"}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="#888" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.flexInput}>
                        <NumberStepper
                            label="Height"
                            value={info.height}
                            onChange={(num) => handleInputChange("height", num)}
                            min={100}
                            max={250}
                            step={1}
                            unit="cm"
                        />
                    </View>

                    <View style={styles.flexInput}>
                        <NumberStepper
                            label="Weight"
                            value={info.weight}
                            onChange={(num) => handleInputChange("weight", num)}
                            min={30}
                            max={250}
                            step={0.5}
                            precision={1}
                            unit="kg"
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: accentColor }]} onPress={() => console.log(info)}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.goBackContainer} onPress={() => router.back()}>
                <Text style={styles.goBackText}>Go back</Text>
            </TouchableOpacity>

            <ActionMenu
                visible={genderMenuAnchor !== null}
                anchorRect={genderMenuAnchor}
                onClose={() => setGenderMenuAnchor(null)}
                items={[
                    {
                        label: 'Male',
                        icon: 'male-outline',
                        onPress: () => handleInputChange("gender", "M"),
                    },
                    {
                        label: 'Female',
                        icon: 'female-outline',
                        onPress: () => handleInputChange("gender", "F"),
                    },
                ]}
            />
        </ScrollView>
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
        <View style={[styles.inputGroup, containerStyle]}>
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
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 60,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#aaa",
        textTransform: "uppercase",
        marginBottom: 12,
        letterSpacing: 1,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    inputGroup: {
        marginBottom: 12,
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
    flexInput: {
        flex: 1,
    },
    genderSelectButton: {
        backgroundColor: "#2A2A2A",
        borderWidth: 1,
        borderColor: "#3A3A3A",
        borderRadius: 8,
        paddingHorizontal: 14,
        height: 48,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    genderButtonText: {
        fontSize: 16,
        color: "#FFF",
    },
    labelText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 6,
        marginLeft: 4,
    },
    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    goBackContainer: {
        marginTop: 15,
        alignSelf: "center",
        padding: 10,
    },
    goBackText: {
        color: "#aaa",
        fontSize: 16,
        fontWeight: "600",
        textDecorationLine: "underline",
    }
});