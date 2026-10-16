import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";

interface CustomHeaderProps {
    title: string;
    onAddButtonPress?: () => void;
    onHistoryButtonPress?: () => void;
    onDeleteButtonPress?: () => void;
}

export default function CustomHeader({
                                         title,
                                         onAddButtonPress,
                                         onHistoryButtonPress,
                                         onDeleteButtonPress,
}: CustomHeaderProps) {
    const {accentColor} = useAppSelector((state: any): any => state.theme);

    return (
        <View style={[styles.headerContainer, {backgroundColor: accentColor}]}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.controls}>
                {onHistoryButtonPress &&
                    <TouchableOpacity onPress={onHistoryButtonPress} style={styles.button}>
                        <Ionicons name="time-outline" size={28} color="#FFFFFF"/>
                    </TouchableOpacity>}
                {onAddButtonPress &&
                    <TouchableOpacity onPress={onHistoryButtonPress} style={styles.button}>
                        <Ionicons name="add-outline" size={28} color="#FFFFFF"/>
                    </TouchableOpacity>}
                {onDeleteButtonPress &&
                    <TouchableOpacity onPress={onDeleteButtonPress} style={styles.button}>
                        <Ionicons name="trash-outline" size={28} color="#FFFFFF"/>
                    </TouchableOpacity>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 110,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    controls: {
        flexDirection: 'row',
        gap: 5,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        padding: 4,
    },
});