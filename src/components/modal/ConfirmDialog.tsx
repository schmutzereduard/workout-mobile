import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ConfirmDialogProps {
    visible: boolean;
    title?: string;
    message: string;          // Pass text like `Are you sure you want to delete ${itemName}?`
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDialog({
                                          visible,
                                          title = "Confirm Action",
                                          message,
                                          onConfirm,
                                          onCancel,
                                          confirmText = "Yes",
                                          cancelText = "No"
                                      }: ConfirmDialogProps) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel} // Required for Android hardware back button
        >
            <View style={styles.overlay}>
                <View style={styles.dialogBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onCancel}>
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.confirmBtn]} onPress={onConfirm}>
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#333333',
    },
    confirmBtn: {
        backgroundColor: '#E53935', // Red accent matching your header/cards
    },
    cancelText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    confirmText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});