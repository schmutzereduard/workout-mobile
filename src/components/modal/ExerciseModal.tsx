import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    ScrollView
} from 'react-native';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";
import {AVAILABLE_MUSCLE_GROUPS} from "@/utils/Constants";
import {ExerciseDTO, MuscleGroupName} from "@/types/workout";

interface ExerciseModalProps {
    visible: boolean;
    initialData?: ExerciseDTO | null;
    exercises: ExerciseDTO[];
    onSave: (data: ExerciseDTO) => void;
    onDelete?: (id: string) => void;
    onClose: () => void;
}

export default function ExerciseModal({
                                          visible,
                                          initialData,
                                          exercises,
                                          onSave,
                                          onDelete,
                                          onClose
                                      }: ExerciseModalProps) {
    const { accentColor } = useAppSelector((state: any) => state.theme);

    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroupName[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setNotes(initialData.notes || '');
            setSelectedMuscles(initialData.muscleGroups || []);
        } else {
            setName('');
            setNotes('');
            setSelectedMuscles([]);
        }
        setError('');
    }, [initialData, visible]);

    const toggleMuscleGroup = (group: MuscleGroupName) => {
        if (selectedMuscles.includes(group)) {
            setSelectedMuscles(selectedMuscles.filter(m => m !== group));
        } else {
            setSelectedMuscles([...selectedMuscles, group]);
        }
    };

    const handleSavePress = () => {
        if (!name.trim()) {
            setError('Exercise name cannot be empty');
            return;
        }
        if (selectedMuscles.length === 0) {
            setError('Select at least one muscle group');
            return;
        }
        if (exercises.find(exercise => exercise.metadata.clientId !== initialData?.metadata.clientId && exercise.name.toLowerCase() === name.toLowerCase())) {
            setError('Exercise name already exists');
            return;
        }

        const metadata = {
            id: initialData?.metadata.id,
            clientId: initialData?.metadata.clientId || Crypto.randomUUID(),
        };

        onSave({
            metadata,
            name: name.trim(),
            notes: notes.trim(),
            muscleGroups: selectedMuscles
        });
        onClose();
    };

    const isEditMode = !!initialData?.metadata.clientId;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.dialogBox} onPress={(e) => e.stopPropagation()}>

                    <View style={styles.headerRow}>
                        <Text style={styles.title}>
                            {isEditMode ? 'Edit Exercise' : 'New Exercise'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>

                        <Text style={styles.label}>Exercise Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Barbell Bench Press"
                            placeholderTextColor="#555"
                            value={name}
                            onChangeText={(val) => { setName(val); setError(''); }}
                        />

                        <Text style={styles.label}>Notes / Cues</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="e.g. Keep elbows tucked at 45 degrees"
                            placeholderTextColor="#555"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={3}
                        />

                        <Text style={styles.label}>Muscle Groups *</Text>
                        <View style={styles.chipsContainer}>
                            {AVAILABLE_MUSCLE_GROUPS.map((group) => {
                                const isSelected = selectedMuscles.includes(group);
                                return (
                                    <TouchableOpacity
                                        key={group}
                                        style={[
                                            styles.chip,
                                            isSelected && { backgroundColor: accentColor, borderColor: accentColor }
                                        ]}
                                        onPress={() => toggleMuscleGroup(group)}
                                    >
                                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                            {group}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: accentColor }]}
                            onPress={handleSavePress}
                        >
                            <Text style={styles.primaryButtonText}>
                                {isEditMode ? 'Update Exercise' : 'Save Exercise'}
                            </Text>
                        </TouchableOpacity>

                        {isEditMode && onDelete && initialData?.metadata.clientId && (
                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton]}
                                onPress={() => {
                                    onDelete(initialData.metadata.clientId!);
                                    onClose();
                                }}
                            >
                                <Text style={styles.deleteButtonText}>Delete Exercise</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
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
        maxHeight: '85%',
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
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    errorText: {
        color: '#FF4D4D',
        fontSize: 13,
        marginBottom: 10,
        fontWeight: '600',
    },
    formScroll: {
        maxHeight: 400,
    },
    label: {
        color: '#AAAAAA',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 12,
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
        height: 80,
        textAlignVertical: 'top',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
        marginBottom: 10,
    },
    chip: {
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    chipText: {
        color: '#AAAAAA',
        fontSize: 13,
        fontWeight: '500',
    },
    chipTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 77, 77, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 77, 0.4)',
    },
    deleteButtonText: {
        color: '#FF4D4D',
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