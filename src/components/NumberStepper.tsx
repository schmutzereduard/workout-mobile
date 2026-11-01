import React from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";

interface NumberStepperProps {
    label?: string;
    value: number;
    onChange: (val: number) => void;
    step?: number;
    min?: number;
    max?: number;
    precision?: number;
    unit?: string;
    accentColor?: string;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
}

export default function NumberStepper({
                                          label,
                                          value,
                                          onChange,
                                          step = 1,
                                          min = 0,
                                          max = 999,
                                          precision = 0,
                                          unit,
                                          containerStyle,
                                          labelStyle
                                      }: NumberStepperProps) {

    const { accentColor } = useAppSelector(state => state.sync);

    const handleDecrement = () => {
        const newValue = Math.max(min, Number((value - step).toFixed(precision)));
        onChange(newValue);
    };

    const handleIncrement = () => {
        const newValue = Math.min(max, Number((value + step).toFixed(precision)));
        onChange(newValue);
    };

    const handleTextChange = (text: string) => {
        const parsed = parseFloat(text);
        if (isNaN(parsed)) {
            onChange(min);
        } else {
            onChange(Math.min(max, Math.max(min, parsed)));
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.labelText, labelStyle]}>{label}</Text>}
            <View style={styles.stepperRow}>
                <TouchableOpacity style={styles.button} onPress={handleDecrement}>
                    <Ionicons name="remove" size={20} color="#fff" />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, unit ? { textAlign: "right" } : { textAlign: "center" }]}
                        keyboardType="numeric"
                        value={value !== undefined ? value.toString() : ''}
                        onChangeText={handleTextChange}
                        maxLength={3}
                    />
                    {unit && <Text style={styles.unitText}>{unit}</Text>}
                </View>

                <TouchableOpacity style={[styles.button, { backgroundColor: accentColor }]} onPress={handleIncrement}>
                    <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 12,
    },
    labelText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        marginLeft: 4,
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3A3A3A',
        overflow: 'hidden',
        height: 48,
    },
    button: {
        width: 44,
        height: '100%',
        backgroundColor: '#3A3A3A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    input: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        minWidth: 40,
    },
    unitText: {
        color: '#888',
        fontSize: 15,
        marginLeft: 4,
    },
});