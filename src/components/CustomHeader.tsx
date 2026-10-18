import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import SearchBar from './SerachBar'; // Adjust path as needed

export interface CustomHeaderProps {
    title?: string;                       // Optional title (if not using search)
    showSearch?: boolean;                 // Toggle whether search bar appears
    searchQuery?: string;                 // Search query value
    onSearchChange?: (text: string) => void; // Search input handler
    searchPlaceholder?: string;           // Custom search placeholder
    onClearSearch?: () => void;           // Clear search handler

    // Optional Action Buttons
    onHistoryPress?: () => void;

    style?: ViewStyle;
}

export default function CustomHeader({
                                         title,
                                         showSearch = false,
                                         searchQuery = '',
                                         onSearchChange,
                                         searchPlaceholder = "Search...",
                                         onClearSearch,
                                         onHistoryPress,
                                         style,
                                     }: CustomHeaderProps) {
    const { accentColor } = useSelector((state: any) => state.theme);

    return (
        <View style={[styles.headerContainer, { backgroundColor: accentColor }, style]}>
            {showSearch ? (
                <View style={styles.searchHeaderWrapper}>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={onSearchChange || (() => {})}
                        placeholder={searchPlaceholder}
                        onClear={onClearSearch}
                    />
                    {onHistoryPress && (
                        <TouchableOpacity onPress={onHistoryPress} style={styles.iconButton}>
                            <Ionicons name="time-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <View style={styles.titleHeaderWrapper}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.actionGroup}>
                        {onHistoryPress && (
                            <TouchableOpacity onPress={onHistoryPress} style={styles.iconButton}>
                                <Ionicons name="time-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
        paddingHorizontal: 16,
        paddingBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        justifyContent: 'center',
    },
    titleHeaderWrapper: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 'bold',
    },
    searchHeaderWrapper: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});