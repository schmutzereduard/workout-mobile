import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import CustomHeader from "@/components/CustomHeader";
import { useAppSelector } from "@/store/store";
import { UserUtils } from "@/utils/Storage";
import { UserProfileDTO } from "@/types/workout";

export default function ProfileScreen() {
    const { backgroundColor, accentColor } = useAppSelector((state: any) => state.sync);

    // @ts-ignore
    const [profile, setProfile] = useState<UserProfileDTO>(UserUtils.getUserProfile());
    const [profileChanged, setProfileChanged] = useState(false);

    useEffect(() => {
        const saved = UserUtils.getUserProfile();
        const hasChanged = JSON.stringify(profile) !== JSON.stringify(saved);
        setProfileChanged(hasChanged);
    }, [profile]);

    const handleChange = (key: keyof UserProfileDTO, value: any) => {
        setProfile(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        UserUtils.updateUserProfile(profile);
        setProfileChanged(false);
    };

    const handleLogout = () => {
        console.log("Open logout confirmation modal");
    };

    const handleDeleteAccount = () => {
        console.log("Open account deletion confirmation modal");
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <CustomHeader title="Profile" />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: accentColor }]}>
                        <Text style={styles.avatarText}>
                            {profile.firstName?.[0] || ''}{profile.lastName?.[0] || ''}
                        </Text>
                    </View>
                    <TextInput
                        style={styles.nameInput}
                        value={`${profile.firstName} ${profile.lastName}`}
                        editable={false}
                    />
                </View>

                <Text style={styles.sectionHeader}>Personal Details</Text>
                <View style={styles.card}>
                    <EditRow
                        label="First Name"
                        value={profile.firstName}
                        onChangeText={(val) => handleChange('firstName', val)}
                    />
                    <EditRow
                        label="Last Name"
                        value={profile.lastName}
                        onChangeText={(val) => handleChange('lastName', val)}
                    />
                    <EditRow
                        label="Date of Birth"
                        value={profile.dateOfBirth}
                        placeholder="YYYY-MM-DD"
                        onChangeText={(val) => handleChange('dateOfBirth', val)}
                    />
                    <EditRow
                        label="Gender"
                        value={profile.gender}
                        onChangeText={(val) => handleChange('gender', val)}
                        isLast
                    />
                </View>

                <Text style={styles.sectionHeader}>Body Metrics</Text>
                <View style={styles.card}>
                    <EditRow
                        label="Height (cm)"
                        value={profile.heightInCm?.toString()}
                        keyboardType="numeric"
                        onChangeText={(val) => handleChange('heightInCm', Number(val))}
                    />
                    <EditRow
                        label="Weight (kg)"
                        value={profile.weightInKg?.toString()}
                        keyboardType="numeric"
                        onChangeText={(val) => handleChange('weightInKg', Number(val))}
                        isLast
                    />
                </View>

                <View style={styles.buttonGroup}>
                {profileChanged && (
                    <TouchableOpacity style={[styles.saveButton, { backgroundColor: accentColor }]} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.simpleButton} onPress={handleLogout}>
                    <Text style={styles.simpleButtonText}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dangerButtonOutline} onPress={handleDeleteAccount}>
                    <Text style={styles.dangerButtonOutlineText}>Delete Account</Text>
                </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

function EditRow({ label, value, placeholder, keyboardType, onChangeText, isLast = false }: {
    label: string;
    value: string;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric';
    onChangeText: (text: string) => void;
    isLast?: boolean
}) {
    return (
        <View style={[styles.infoRow, !isLast && styles.rowBorder]}>
            <Text style={styles.infoLabel}>{label}</Text>
            <TextInput
                style={styles.infoInput}
                value={value}
                placeholder={placeholder || "Not set"}
                placeholderTextColor="#555"
                keyboardType={keyboardType || 'default'}
                onChangeText={onChangeText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    nameInput: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionHeader: {
        color: '#888',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 15,
        marginBottom: 8,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    },
    infoLabel: {
        color: '#aaa',
        fontSize: 16,
        flex: 1,
    },
    infoInput: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    saveButton: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    simpleButton: {
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: '#3A3A3A',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    simpleButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dangerButtonOutline: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D32F2F',
        backgroundColor: 'rgba(211, 47, 47, 0.05)',
    },
    dangerButtonOutlineText: {
        color: '#D32F2F',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonGroup: {
        marginTop: 10
    }
});