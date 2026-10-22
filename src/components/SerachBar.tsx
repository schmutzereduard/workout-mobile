import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
}

export default function SearchBar({
                                      value,
                                      onChangeText,
                                      placeholder = "Search...",
                                      onClear,
                                  }: SearchBarProps) {
    return (
        <View style={[styles.container, styles.headerSearchBar]}>
            <Ionicons name="search" size={20} color="white" style={styles.searchIcon} />

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="lightgray"
            />

            {value.length > 0 && (
                <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                    <Ionicons name="close" size={18} color="#AAAAAA" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#212121',
        borderRadius: 20,
        marginHorizontal: 16,
        marginVertical: 10,
        paddingHorizontal: 16,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#303030',
    },
    headerSearchBar: {
        flex: 1,
        marginHorizontal: 0,
        marginVertical: 0,
        height: 40,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        paddingVertical: 0,
    },
    clearButton: {
        padding: 4,
        color: "white"
    },
});