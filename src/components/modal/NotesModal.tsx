import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from "@/store/store";

interface NotesModalProps {
    visible: boolean;
    title?: string;
    initialNotes?: string;
    placeholder?: string;
    onSave: (notes: string) => void;
    onClose: () => void;
}

export default function NotesModal({
                                       visible,
                                       title = 'Edit Notes',
                                       initialNotes = '',
                                       placeholder = 'Add notes here...',
                                       onSave,
                                       onClose,
                                   }: NotesModalProps) {
    const { accentColor } = useAppSelector((state: any) => state.sync);

    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (visible) {
            setNotes(initialNotes || '');
        }
    }, [visible, initialNotes]);

    const handleSavePress = () => {
        onSave(notes.trim());
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.dialogBox} onPress={(e) => e.stopPropagation()}>

                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    {/* Content / Text Input */}
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder={placeholder}
                            placeholderTextColor="#555"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            textAlignVertical="top"
                            autoFocus
                        />
                    </ScrollView>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: accentColor }]}
                            onPress={handleSavePress}
                        >
                            <Text style={styles.primaryButtonText}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>

                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    dialogBox: {
        width: '100%',
        maxHeight: '70%',
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    formScroll: {
        maxHeight: 250,
    },
    input: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: '#FFFFFF',
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    textArea: {
        height: 120,
    },
    buttonContainer: {
        marginTop: 20,
        gap: 10,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    cancelButton: {
        backgroundColor: '#2A2A2A',
    },
    cancelButtonText: {
        color: '#AAAAAA',
        fontWeight: '600',
        fontSize: 15,
    },
});