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
import { useAppSelector } from "@/store/store";
import { WorkoutTemplateDTO, TemplateExerciseDTO, ExerciseDTO } from "@/types/workout";
import useModals from "@/hooks/useModals";
import TemplateExerciseModal from "@/components/modal/TemplateExerciseModal";

interface WorkoutTemplateModalProps {
    visible: boolean;
    initialData?: WorkoutTemplateDTO | null;
    exercisesList: ExerciseDTO[];
    onSave: (data: WorkoutTemplateDTO) => void;
    onDelete?: (clientId: string) => void;
    onClose: () => void;
}

export default function WorkoutTemplateModal({
                                                 visible,
                                                 initialData,
                                                 exercisesList,
                                                 onSave,
                                                 onDelete,
                                                 onClose
                                             }: WorkoutTemplateModalProps) {
    const { accentColor } = useAppSelector((state: any) => state.theme);
    const { modals, modalControls } = useModals();

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [templateExercises, setTemplateExercises] = useState<TemplateExerciseDTO[]>([]);
    const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.name || '');
            setNotes(initialData.notes || '');
            setTemplateExercises((initialData as any).templateExercises || []);
        } else {
            setTitle('');
            setNotes('');
            setTemplateExercises([]);
        }
        setError('');
    }, [initialData, visible]);

    const handleSavePress = () => {
        if (!title.trim()) {
            setError('Template name cannot be empty');
            return;
        }

        const metadata = initialData?.metadata || {
            clientId: Crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        onSave({
            metadata,
            name: title.trim(),
            notes: notes.trim(),
            templateExercises
        });
        onClose();
    };

    const handleAddExerciseSave = (newExercise: TemplateExerciseDTO) => {
        setTemplateExercises([...templateExercises, { ...newExercise, exerciseOrder: templateExercises.length + 1 }]);
        modalControls.closeModal("addTemplateExercise");
    };

    const handleEditExerciseSave = (updatedExercise: TemplateExerciseDTO) => {
        const updatedList = templateExercises.map(item =>
            item.clientId === editingExerciseId
                ? { ...updatedExercise, clientId: editingExerciseId, exerciseOrder: item.exerciseOrder }
                : item
        );

        setTemplateExercises(updatedList);
        setEditingExerciseId(null);
        modalControls.closeModal("editTemplateExercise");
    };

    const handleRemoveExercise = (index: number) => {
        const updated = templateExercises.filter((_, i) => i !== index);
        const reordered = updated.map((item, idx) => ({ ...item, exerciseOrder: idx + 1 }));
        setTemplateExercises(reordered);
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...templateExercises];
        const temp = updated[index];
        updated[index] = updated[index - 1];
        updated[index - 1] = temp;

        const reordered = updated.map((item, idx) => ({ ...item, exerciseOrder: idx + 1 }));
        setTemplateExercises(reordered);
    };

    const handleMoveDown = (index: number) => {
        if (index === templateExercises.length - 1) return;
        const updated = [...templateExercises];
        const temp = updated[index];
        updated[index] = updated[index + 1];
        updated[index + 1] = temp;

        const reordered = updated.map((item, idx) => ({ ...item, exerciseOrder: idx + 1 }));
        setTemplateExercises(reordered);
    };

    const getExerciseName = (exerciseId: string) => {
        const found = exercisesList.find(e => e.metadata.clientId === exerciseId);
        return found ? found.name : `Exercise #${exerciseId}`;
    };

    const isEditMode = !!initialData?.metadata?.clientId;

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
                            {isEditMode ? 'Edit Template' : 'New Workout Template'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <ScrollView
                        showsVerticalScrollIndicator={true}
                        style={styles.formScroll}
                        contentContainerStyle={styles.formScrollContent}
                    >

                        <Text style={styles.label}>Template Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Upper Body A (Hypertrophy)"
                            placeholderTextColor="#555"
                            value={title}
                            onChangeText={(val) => { setTitle(val); setError(''); }}
                        />

                        <Text style={styles.label}>Description / Notes</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="e.g. Chest, Shoulders & Triceps"
                            placeholderTextColor="#555"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={2}
                        />

                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.label}>Assigned Exercises ({templateExercises.length})</Text>
                            <TouchableOpacity
                                style={[styles.inlineAddBtn, { borderColor: accentColor }]}
                                onPress={() => modalControls.openModal("addTemplateExercise")}
                            >
                                <Ionicons name="add" size={16} color={accentColor} />
                                <Text style={[styles.inlineAddBtnText, { color: accentColor }]}>Add Exercise</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.exercisesListContainer}>
                            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                                {templateExercises.length > 0 ? (
                                    templateExercises.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.exerciseCard}
                                            onPress={() => {
                                                setEditingExerciseId(item.clientId || "");
                                                modalControls.openModal("editTemplateExercise");
                                            }}
                                        >
                                            <View style={styles.exerciseCardInfo}>
                                                <Text style={styles.exerciseNameText}>
                                                    {index + 1}. {getExerciseName(item.exerciseClientId || "")}
                                                </Text>
                                                <Text style={styles.exerciseDetailsText}>
                                                    {item.targetSets}x{item.targetRepetitionsMin}-{item.targetRepetitionsMax} reps
                                                </Text>
                                            </View>

                                            {/* Action Buttons: Move Up, Move Down, Delete */}
                                            <View style={styles.cardActions}>
                                                <TouchableOpacity
                                                    style={[styles.actionIconBtn, index === 0 && styles.disabledIconBtn]}
                                                    onPress={() => handleMoveUp(index)}
                                                    disabled={index === 0}
                                                >
                                                    <Ionicons name="chevron-up" size={16} color={index === 0 ? "#444" : "#AAA"} />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={[styles.actionIconBtn, index === templateExercises.length - 1 && styles.disabledIconBtn]}
                                                    onPress={() => handleMoveDown(index)}
                                                    disabled={index === templateExercises.length - 1}
                                                >
                                                    <Ionicons name="chevron-down" size={16} color={index === templateExercises.length - 1 ? "#444" : "#AAA"} />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.actionIconBtn}
                                                    onPress={() => handleRemoveExercise(index)}
                                                >
                                                    <Ionicons name="trash-outline" size={16} color="#FF4D4D" />
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.noExercisesText}>No exercises assigned yet</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>

                        {/* Bottom spacing inside scroll */}
                        <View style={{ height: 20 }} />

                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: accentColor }]}
                            onPress={handleSavePress}
                        >
                            <Text style={styles.primaryButtonText}>
                                {isEditMode ? 'Update Template' : 'Save Template'}
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
                                <Text style={styles.deleteButtonText}>Delete Template</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                    {modals.addTemplateExercise?.isOpen &&
                        <TemplateExerciseModal
                            visible={modals.addTemplateExercise?.isOpen}
                            onSave={handleAddExerciseSave}
                            onClose={() => modalControls.closeModal("addTemplateExercise")}
                        />
                    }

                    {modals.editTemplateExercise?.isOpen &&
                        <TemplateExerciseModal
                            visible={modals.editTemplateExercise?.isOpen}
                            workoutTemplate={initialData || undefined}
                            initialData={templateExercises.find(item => item.clientId === editingExerciseId)}
                            onSave={handleEditExerciseSave}
                            onClose={() => {
                                setEditingExerciseId(null);
                                modalControls.closeModal("editTemplateExercise");
                            }}
                        />
                    }

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
        maxHeight: '90%',
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
        display: 'flex',
        flexDirection: 'column',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    errorText: {
        color: '#FF4D4D',
        fontSize: 13,
        marginBottom: 8,
        fontWeight: '600',
    },
    formScroll: {
        flexShrink: 1,
    },
    formScrollContent: {
        paddingBottom: 10,
    },
    label: {
        color: '#AAAAAA',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 10,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 6,
    },
    inlineAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: '#2A2A2A',
    },
    inlineAddBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    exercisesListContainer: {
        backgroundColor: '#222222',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333',
        padding: 6,
        marginBottom: 4,
    },
    emptyContainer: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noExercisesText: {
        color: '#777',
        fontSize: 13,
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
        height: 60,
        textAlignVertical: 'top',
    },
    exerciseCard: {
        backgroundColor: '#252525',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#333',
    },
    exerciseCardInfo: {
        flex: 1,
    },
    exerciseNameText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    exerciseDetailsText: {
        color: '#888888',
        fontSize: 12,
        marginTop: 2,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionIconBtn: {
        padding: 6,
        backgroundColor: '#2A2A2A',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    disabledIconBtn: {
        opacity: 0.4,
    },
    buttonContainer: {
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
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
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
});