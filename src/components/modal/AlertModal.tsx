import React from 'react';
import { Modal, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';

interface AlertModalProps {
    visible: boolean;
    title?: string;
    message: string;
    onClose: () => void;
    buttonText?: string;
}

export default function AlertModal({
                                       visible,
                                       title = "Oops..",
                                       message,
                                       onClose,
                                       buttonText = "OK"
                                   }: AlertModalProps) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose} // Required for Android hardware back button
        >
            <Pressable style={styles.overlay} onPress={onClose}>

                <Pressable style={styles.dialogBox} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </Pressable>

            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent backdrop
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogBox: {
        width: '80%',
        backgroundColor: '#1E1E1E', // Matches your dark theme cards
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#AAAAAA',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    button: {
        width: '100%',
        backgroundColor: '#333333',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
});