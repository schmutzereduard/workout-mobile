import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    style?: ViewStyle;
}

export default function SearchBar({
                                      value,
                                      onChangeText,
                                      placeholder = "Search exercises...",
                                      onClear,
                                      style
                                  }: SearchBarProps) {

    return (
        <View style={[styles.container, style]}>
            <Ionicons name="search" size={20} color="#888888" style={styles.searchIcon} />

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#888888"
            />

            {value.length > 0 && (
                <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={18} color="#888888" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 10,
        paddingHorizontal: 16,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
    },
    clearButton: {
        padding: 4,
    },
});