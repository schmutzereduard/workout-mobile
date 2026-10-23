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
import {TemplateExerciseDTO, WorkoutTemplateDTO} from "@/types/workout";
import {testExercisesDTO} from "@/utils/TestData";

interface TemplateExerciseModalProps {
    visible: boolean;
    workoutTemplate?: WorkoutTemplateDTO;
    initialData?: TemplateExerciseDTO;
    onSave: (data: TemplateExerciseDTO) => void;
    onClose: () => void;
}

export default function TemplateExerciseModal({
                                                  visible,
                                                  workoutTemplate,
                                                  initialData,
                                                  onSave,
                                                  onClose
                                              }: TemplateExerciseModalProps) {

    const exercisesList = testExercisesDTO;
    const { accentColor } = useAppSelector((state: any) => state.theme);

    const [selectedExerciseId, setSelectedExerciseId] = useState<string>();
    const [searchQuery, setSearchQuery] = useState('');
    const [warmupSets, setWarmupSets] = useState<string>('0');
    const [targetSets, setTargetSets] = useState<string>('3');
    const [targetRepetitionsMin, setTargetRepetitionsMin] = useState<string>('8');
    const [targetRepetitionsMax, setTargetRepetitionsMax] = useState<string>('12');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setSelectedExerciseId(initialData.exerciseClientId);
            setTargetSets(initialData.targetSets.toString());
            setTargetRepetitionsMin(initialData.targetRepetitionsMin.toString());
            setTargetRepetitionsMax(initialData.targetRepetitionsMax.toString());
        }
    }, [initialData, visible]);


    const filteredExercises = exercisesList.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscleGroups.map(item => item.toLowerCase()).includes(searchQuery.toLowerCase())
    );

    const handleAddPress = () => {
        const parsedSets = parseInt(targetSets, 10);
        const parsedMin = parseInt(targetRepetitionsMin, 10);
        const parsedMax = parseInt(targetRepetitionsMax, 10);

        if (isNaN(parsedSets) || parsedSets <= 0) {
            setError('Target sets must be greater than 0');
            return;
        }
        if (isNaN(parsedMin) || parsedMin <= 0 || isNaN(parsedMax) || parsedMax <= 0) {
            setError('Repetition range must be greater than 0');
            return;
        }
        if (parsedMin > parsedMax) {
            setError('Min repetitions cannot be greater than max');
            return;
        }

        const templateExercise: TemplateExerciseDTO = {
            clientId: initialData?.clientId || Crypto.randomUUID(),
            workoutTemplateId: workoutTemplate?.metadata.id,
            workoutTemplateClientId: workoutTemplate?.metadata.clientId,
            exerciseId: exercisesList.find(ex => ex.metadata.clientId === selectedExerciseId)?.metadata.id,
            exerciseClientId: selectedExerciseId,
            exerciseOrder: initialData?.exerciseOrder ?? ((workoutTemplate?.templateExercises?.length ?? 0) + 1),
            targetSets: parsedSets,
            targetRepetitionsMin: parsedMin,
            targetRepetitionsMax: parsedMax,
        };

        onSave(templateExercise);
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

                    <View style={styles.headerRow}>
                        <Text style={styles.title}>
                            {initialData ? 'Edit Exercise Config' : 'Select Exercise'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>

                        <Text style={styles.label}>Choose Exercise *</Text>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={16} color="#777" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search exercises..."
                                placeholderTextColor="#666"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <View style={styles.exercisePickerWrapper}>
                            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                                {filteredExercises.length > 0 ? (
                                    filteredExercises.map((exercise) => {
                                        const isSelected = selectedExerciseId === exercise.metadata.clientId;
                                        return (
                                            <TouchableOpacity
                                                key={exercise.metadata.clientId}
                                                style={[
                                                    styles.exerciseOption,
                                                    isSelected && { backgroundColor: accentColor, borderColor: accentColor }
                                                ]}
                                                onPress={() => setSelectedExerciseId(exercise.metadata.clientId!)}
                                            >
                                                <Text style={[styles.exerciseOptionText, isSelected && styles.exerciseOptionTextSelected]}>
                                                    {exercise.name}
                                                </Text>
                                                <Text style={[styles.exerciseSubText, isSelected && styles.exerciseSubTextSelected]}>
                                                    {Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.join(', ') : exercise.muscleGroups}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })
                                ) : (
                                    <Text style={styles.noResultsText}>No exercises found</Text>
                                )}
                            </ScrollView>
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={styles.halfInputContainer}>
                                <Text style={styles.label}>Warmup Sets</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 0"
                                    placeholderTextColor="#555"
                                    keyboardType="numeric"
                                    value={warmupSets}
                                    onChangeText={(val) => { setWarmupSets(val); setError(''); }}
                                />
                            </View>
                            <View style={styles.halfInputContainer}>
                                <Text style={styles.label}>Target Sets *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 3"
                                    placeholderTextColor="#555"
                                    keyboardType="numeric"
                                    value={targetSets}
                                    onChangeText={(val) => { setTargetSets(val); setError(''); }}
                                />
                            </View>
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={styles.halfInputContainer}>
                                <Text style={styles.label}>Min Reps *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="8"
                                    placeholderTextColor="#555"
                                    keyboardType="numeric"
                                    value={targetRepetitionsMin}
                                    onChangeText={(val) => { setTargetRepetitionsMin(val); setError(''); }}
                                />
                            </View>

                            <View style={styles.halfInputContainer}>
                                <Text style={styles.label}>Max Reps *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="12"
                                    placeholderTextColor="#555"
                                    keyboardType="numeric"
                                    value={targetRepetitionsMax}
                                    onChangeText={(val) => { setTargetRepetitionsMax(val); setError(''); }}
                                />
                            </View>
                        </View>

                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: accentColor }]}
                            onPress={handleAddPress}
                        >
                            <Text style={styles.primaryButtonText}>
                                {initialData ? 'Update' : 'Add to Template'}
                            </Text>
                        </TouchableOpacity>

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
        maxHeight: 460,
    },
    label: {
        color: '#AAAAAA',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3A3A3A',
        paddingHorizontal: 10,
        marginBottom: 8,
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        color: '#FFFFFF',
        fontSize: 14,
    },
    exercisePickerWrapper: {
        height: 150,
        backgroundColor: '#222222',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333',
        padding: 6,
        marginBottom: 4,
    },
    exerciseOption: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 6,
        backgroundColor: '#2A2A2A',
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    exerciseOptionText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    exerciseOptionTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    exerciseSubText: {
        color: '#888888',
        fontSize: 11,
    },
    exerciseSubTextSelected: {
        color: '#DDDDDD',
    },
    noResultsText: {
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
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
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInputContainer: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: 16,
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
    cancelButton: {
        backgroundColor: '#2A2A2A',
    },
    cancelButtonText: {
        color: '#AAAAAA',
        fontWeight: '600',
        fontSize: 15,
    },
});