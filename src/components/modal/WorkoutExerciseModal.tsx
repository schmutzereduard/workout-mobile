import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from "@/store/store";
import {ExerciseSetDTO, ExerciseSetType, WorkoutExerciseDTO} from "@/types/workout";
import {WorkoutUtils} from "@/utils/Storage";
import NumberStepper from "@/components/NumberStepper";

interface WorkoutExerciseModalProps {
    visible: boolean;
    workoutClientId : string;
    orderInWorkout: number;
    onSave: (data: WorkoutExerciseDTO) => void;
    onClose: () => void;
}

export default function WorkoutExerciseModal({
                                                 visible,
                                                 workoutClientId,
                                                 orderInWorkout,
                                                 onSave,
                                                 onClose
                                              }: WorkoutExerciseModalProps) {

    const { accentColor } = useAppSelector((state: any) => state.sync);

    const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [warmupSets, setWarmupSets] = useState<number>(0);
    const [targetSets, setTargetSets] = useState<number>(3);
    const [targetRepetitionsMin, setTargetRepetitionsMin] = useState<number>(8);
    const [targetRepetitionsMax, setTargetRepetitionsMax] = useState<number>(12);
    const [error, setError] = useState("");


    const filteredExercises = WorkoutUtils.getExercises().filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.variation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.notes?.toLowerCase().includes(searchQuery) ||
        ex.muscleGroups.map(item => item.toLowerCase()).includes(searchQuery.toLowerCase())
    );

    const handleAddPress = () => {
        const parsedSets = targetSets;
        const parsedMin = targetRepetitionsMin;
        const parsedMax = targetRepetitionsMax;

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

        const warmupExerciseSets: ExerciseSetDTO[] = Array.from({ length: warmupSets || 0 }, (_, setIdx) => ({
            setType: "Warmup" as ExerciseSetType,
            setNumber: setIdx + 1,
            weight: 0,
            targetRepetitions: 0,
            actualRepetitions: 0,
            repetitionsInReserve: 0
        }));

        const workingExerciseSets: ExerciseSetDTO[] = Array.from({ length: targetSets }, (_, setIdx) => ({
            setType: "Working" as ExerciseSetType,
            setNumber: setIdx + 1,
            weight: 0,
            targetRepetitions: 0,
            actualRepetitions: 0,
            repetitionsInReserve: 0
        }));

        const workoutExerciseDTO: WorkoutExerciseDTO = {

            workoutClientId: workoutClientId,
            exerciseClientId: selectedExerciseId,
            orderInWorkout: orderInWorkout,
            targetSets: parsedSets,
            targetRepetitionsMin: parsedMin,
            targetRepetitionsMax: parsedMax,
            notes: "",
            exerciseSets: [...warmupExerciseSets, ...workingExerciseSets]
        };

        onSave(workoutExerciseDTO);
        onClose();
    };

    const handleRepetitionsMinChange = (val: number) => {
        setTargetRepetitionsMin(val);
        setError("");
        if (val > targetRepetitionsMax)
            setTargetRepetitionsMax(val);
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
                            {'Select Exercise'}
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
                                                onPress={() => setSelectedExerciseId(exercise.metadata.clientId)}
                                            >
                                                <Text style={[styles.exerciseOptionText, isSelected && styles.exerciseOptionTextSelected]}>
                                                    {exercise.name + (exercise.variation ? ` • ${exercise.variation}` : "")}
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
                                <NumberStepper
                                    value={warmupSets}
                                    onChange={(val) => { setWarmupSets(val); setError(""); }}
                                    label={"Warmup Sets"}
                                    labelStyle={styles.label}
                                />
                            </View>
                            <View style={styles.halfInputContainer}>
                                <NumberStepper
                                    value={targetSets}
                                    onChange={(val) => { setTargetSets(val); setError(""); }}
                                    label={"Target Sets*"}
                                    labelStyle={styles.label}
                                    min={1}
                                />
                            </View>
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={styles.halfInputContainer}>
                                <NumberStepper
                                    value={targetRepetitionsMin}
                                    onChange={handleRepetitionsMinChange}
                                    label={"Min Reps*"}
                                    labelStyle={styles.label}
                                />
                            </View>

                            <View style={styles.halfInputContainer}>
                                <NumberStepper
                                    value={targetRepetitionsMax}
                                    onChange={(val) => { setTargetRepetitionsMax(val); setError(""); }}
                                    label={"Max Reps*"}
                                    labelStyle={styles.label}
                                    min={targetRepetitionsMin}
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
                                {'Add to Workout'}
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