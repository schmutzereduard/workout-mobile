import React, {useCallback, useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Switch
} from 'react-native';
import Slider from '@react-native-community/slider';
import CustomHeader from "@/components/CustomHeader";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setThemeColors } from "@/store/syncSlice";
import {LocalStorage, StorageKeys, UserUtils} from "@/utils/Storage";
import {router, useFocusEffect} from 'expo-router';
import NumberStepper from "@/components/NumberStepper";
import {UserPreferencesDTO, UserProfileDTO} from "@/types/workout";

const ACCENT_COLORS = ['#FF0000', '#6200EE', '#03DAC6', '#FF5722', '#4CAF50', '#2196F3'];
const BACKGROUND_COLORS = ['#121212', '#1E1E1E', '#0B0F19', '#222831'];

export default function SettingsScreen() {

    const dispatch = useAppDispatch();
    const { backgroundColor, accentColor } = useAppSelector((state: any) => state.sync);

    // @ts-ignore
    const [preferences, setPreferences] = useState<UserPreferencesDTO>(UserUtils.getUserPreferences);
    const [preferencesChanged, setPreferencesChanged] = useState(false);

    useFocusEffect(
        useCallback(() => {
            return () => {
                const userPreferences = UserUtils.getUserPreferences();
                // @ts-ignore
                setPreferences(userPreferences);
                setPreferencesChanged(false);
                dispatch(setThemeColors({
                    backgroundColor: userPreferences?.backgroundColor,
                    accentColor: userPreferences?.accentColor
                }));
            };
        }, [])
    );

    useEffect(() => {
        const saved = UserUtils.getUserPreferences();
        const hasChanged = JSON.stringify(preferences) !== JSON.stringify(saved);
        setPreferencesChanged(hasChanged);
    }, [preferences]);

    const handleChange = (key: keyof UserPreferencesDTO, value: any) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        UserUtils.updateUserPreferences(preferences);
        setPreferencesChanged(false);
    };

    const handleSync = () => {
        router.push("/register");
        console.log(UserUtils.getUserPreferences());
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <CustomHeader title="Settings" />

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.sectionHeader}>App Settings</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Accent Color</Text>
                    <View style={styles.colorRow}>
                        {ACCENT_COLORS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorCircle,
                                    { backgroundColor: color },
                                    accentColor === color && styles.selectedRing
                                ]}
                                onPress={() => {
                                    handleChange("accentColor", color);
                                    dispatch(setThemeColors({ backgroundColor, accentColor: color }));
                                }}
                            />
                        ))}
                    </View>

                    <Text style={[styles.label, { marginTop: 16 }]}>Background Color</Text>
                    <View style={styles.colorRow}>
                        {BACKGROUND_COLORS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorCircle,
                                    { backgroundColor: color },
                                    backgroundColor === color && styles.selectedRing
                                ]}
                                onPress={() => {
                                    handleChange("backgroundColor", color);
                                    dispatch(setThemeColors({ backgroundColor: color, accentColor }));
                                }}
                            />
                        ))}
                    </View>
                </View>


                <Text style={styles.sectionHeader}>User Preferences</Text>

                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.text}>Weight Unit ({preferences.weightUnit === "lbs" ? 'LBS' : 'KG'})</Text>
                        <Switch
                            value={preferences.weightUnit === "lbs"}
                            onValueChange={(val) => handleChange("weightUnit", val ? "lbs" : "kg")}
                            trackColor={{ false: '#555', true: accentColor }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingItem}>
                            <NumberStepper
                                label="Progressive Overload Increment"
                                value={preferences.progressiveOverloadIncrement}
                                onChange={(val) => handleChange("progressiveOverloadIncrement", val)}
                                min={0.5}
                                max={20}
                                step={0.5}
                                precision={1}
                                unit={preferences.weightUnit === "lbs" ? 'lbs' : 'kg'}
                            />
                            <Text style={[styles.subText, { marginTop: -4, marginLeft: 4 }]}>
                                Default weight jump for linear progression
                            </Text>
                        </View>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.sliderHeader}>
                            <Text style={styles.text}>Deload Volume Decrement</Text>
                            <Text style={[styles.sliderValue, { color: '#fff' }]}>{preferences.deloadVolumePercentage}%</Text>
                        </View>
                        <Text style={styles.subText}>Reduce working sets during deload</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={1}
                            maximumValue={100}
                            step={1}
                            value={preferences.deloadVolumePercentage}
                            onValueChange={(val) => handleChange("deloadVolumePercentage", val)}
                            minimumTrackTintColor={accentColor}
                            thumbTintColor={accentColor}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.sliderHeader}>
                            <Text style={styles.text}>Deload Intensity Decrement</Text>
                            <Text style={[styles.sliderValue, { color: '#fff' }]}>{preferences.deloadIntensityPercentage}%</Text>
                        </View>
                        <Text style={styles.subText}>Reduce working weight during deload</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={1}
                            maximumValue={100}
                            step={1}
                            value={preferences.deloadIntensityPercentage}
                            onValueChange={(val) => handleChange("deloadIntensityPercentage", val)}
                            minimumTrackTintColor={accentColor}
                            thumbTintColor={accentColor}
                        />
                    </View>
                </View>


                <Text style={styles.sectionHeader}>User Info & Account</Text>

                <View style={styles.card}>

                    {preferencesChanged && (
                        <TouchableOpacity style={[styles.saveButton, { backgroundColor: accentColor }]} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.simpleButton} onPress={() => router.push("/profile")}>
                        <Text style={styles.simpleButtonText}>Open Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: accentColor }]} onPress={handleSync}>
                        <Text style={styles.primaryButtonText}>
                            {LocalStorage.getString(StorageKeys.LAST_SYNC_TIMESTAMP) ?
                                `Last sync: ${LocalStorage.getString(StorageKeys.LAST_SYNC_TIMESTAMP)}` :
                                "Sync"}
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
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
    sectionHeader: {
        color: '#888',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 20,
        marginBottom: 8,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
    },
    label: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    subText: {
        color: '#aaa',
        fontSize: 13,
        marginTop: 2,
    },
    colorRow: {
        flexDirection: 'row',
        gap: 12,
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedRing: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    settingItem: {
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
        marginTop: 8,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputLabelContainer: {
        flex: 1,
        paddingRight: 12,
    },
    numberInput: {
        backgroundColor: '#2A2A2A',
        borderWidth: 1,
        borderColor: '#3A3A3A',
        borderRadius: 8,
        color: '#FFFFFF',
        fontSize: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: 70,
        textAlign: 'center',
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sliderValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    slider: {
        width: '100%',
        height: 40,
        marginTop: 4,
    },
    actionButton: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    simpleButton: {
        backgroundColor: '#2A2A2A',
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
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
});