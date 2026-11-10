import React, {useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";
import CustomHeader from "@/components/CustomHeader";
import {useLocalSearchParams, useNavigation} from "expo-router";
import {WorkoutUtils} from "@/utils/Storage";
import useModals from "@/hooks/useModals";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {ExerciseSetDTO, ExerciseSetType, WorkoutExerciseDTO} from "@/types/workout";
import * as Crypto from "expo-crypto";
import ActionMenu, {AnchorRect} from "@/components/ActionMenu";

const REST_TIME_OPTIONS = [60, 120, 180];

export default function ActiveWorkoutScreen() {

    const navigation = useNavigation();

    const { templateId } = useLocalSearchParams();

    const { modals, modalControls } = useModals();

    const { accentColor } = useAppSelector((state: any) => state.sync);

    const [workoutTitle, setWorkoutTitle] = useState<string>("");
    const [workoutClientId, setWorkoutClientId] = useState<string>("");
    const [exercises, setExercises] = useState<WorkoutExerciseDTO[]>([]);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
    const [isResting, setIsResting] = useState(false);
    const [expanded, setExpanded] = useState<string[]>([]);

    // State to manage ActionMenu state and target exercise index
    const [menuAnchor, setMenuAnchor] = useState<AnchorRect | null>(null);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);

    // Reference mapping for button coordinates
    const exerciseButtonRefs = useRef<{ [key: number]: View | null }>({});

    useEffect(() => {
        if (templateId) {
            const idString = Array.isArray(templateId) ? templateId[0] : templateId;
            const workoutTemplate = WorkoutUtils.getWorkoutTemplate(idString);

            if (workoutTemplate) {
                setWorkoutTitle(workoutTemplate.name);

                if (workoutTemplate.templateExercises) {
                    const generatedWorkoutId = Crypto.randomUUID();
                    setWorkoutClientId(generatedWorkoutId);

                    const mappedExercises: WorkoutExerciseDTO[] = workoutTemplate.templateExercises.map((templateExercise, index) => {
                        const exerciseDto = WorkoutUtils.getExercise(templateExercise.exerciseClientId);

                        const warmupSets: ExerciseSetDTO[] = Array.from({ length: templateExercise.warmupSets || 0 }, (_, setIdx) => ({
                            setType: "Warmup" as ExerciseSetType,
                            setNumber: setIdx + 1,
                            weight: 0,
                            targetRepetitions: templateExercise.targetRepetitionsMin,
                            actualRepetitions: 0,
                            repetitionsInReserve: 0
                        }));

                        const workingSets: ExerciseSetDTO[] = Array.from({ length: templateExercise.targetSets }, (_, setIdx) => ({
                            setType: "Working" as ExerciseSetType,
                            setNumber: warmupSets.length + setIdx + 1,
                            weight: 0,
                            targetRepetitions: templateExercise.targetRepetitionsMin,
                            actualRepetitions: 0,
                            repetitionsInReserve: 0
                        }));

                        return {
                            workoutClientId: generatedWorkoutId,
                            exerciseClientId: templateExercise.exerciseClientId,
                            targetSets: templateExercise.targetSets,
                            targetRepetitionsMin: templateExercise.targetRepetitionsMin,
                            targetRepetitionsMax: templateExercise.targetRepetitionsMax,
                            exercise: exerciseDto,
                            orderInWorkout: templateExercise.exerciseOrder,
                            notes: '',
                            exerciseSets: [...warmupSets, ...workingSets],
                        };
                    });

                    setExercises(mappedExercises);
                }
            }
        }
    }, [templateId]);

    useEffect(() => {
        return navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            modalControls.openModal("discardChanges", {
                onConfirm: () => {
                    navigation.dispatch(e.data.action);
                    modalControls.closeModal("discardChanges");
                }
            });
        });
    }, [navigation]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let restInterval: ReturnType<typeof setTimeout> | null = null;
        if (isResting && restTimeRemaining !== null && restTimeRemaining > 0) {
            restInterval = setInterval(() => {
                setRestTimeRemaining(prev => {
                    if (prev === null || prev <= 1) {
                        setIsResting(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (restInterval) clearInterval(restInterval);
        };
    }, [isResting, restTimeRemaining]);

    const formatElapsedTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleExerciseExpand = (cardKey: string) => {
        if (expanded.includes(cardKey)) {
            setExpanded(expanded.filter(key => key !== cardKey));
        } else {
            setExpanded([...expanded, cardKey]);
        }
    };

    const handleActualRepsChange = (exIndex: number, setIndex: number, val: string) => {
        const updated = [...exercises];
        const parsedReps = val === '' ? 0 : parseInt(val, 10);
        if (updated[exIndex].exerciseSets) {
            updated[exIndex].exerciseSets![setIndex].actualRepetitions = parsedReps;
            setExercises(updated);
        }
    };

    const handleAddSet = (exIndex: number) => {
        const updated = [...exercises];
        const currentSets = updated[exIndex].exerciseSets || [];
        const lastSet = currentSets[currentSets.length - 1];

        const newSet: ExerciseSetDTO = {
            setType: "Working",
            setNumber: currentSets.length + 1,
            weight: lastSet ? lastSet.weight : 0,
            targetRepetitions: lastSet ? lastSet.targetRepetitions : 10,
            actualRepetitions: 0,
            repetitionsInReserve: 0
        };

        updated[exIndex].exerciseSets = [...currentSets, newSet];
        setExercises(updated);
    };

    const handleRemoveSet = (exIndex: number, setIndex: number) => {
        const updated = [...exercises];
        if (updated[exIndex].exerciseSets) {
            updated[exIndex].exerciseSets = updated[exIndex].exerciseSets
                .filter((_, idx) => idx !== setIndex)
                .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
            setExercises(updated);
        }
    };

    const moveExercise = (direction: number) => {
        if (selectedExerciseIndex === null) return;
        const newIndex = selectedExerciseIndex + direction;
        if (newIndex < 0 || newIndex >= exercises.length) return;

        const updated = [...exercises];
        const temp = updated[selectedExerciseIndex];
        updated[selectedExerciseIndex] = updated[newIndex];
        updated[newIndex] = temp;

        // Recalculate order numbers
        updated.forEach((ex, idx) => { ex.orderInWorkout = idx + 1; });

        setExercises(updated);
        setSelectedExerciseIndex(newIndex);
        setMenuAnchor(null);
    };

    const removeExercise = () => {
        if (selectedExerciseIndex === null) return;
        const updated = exercises.filter((_, i) => i !== selectedExerciseIndex);
        updated.forEach((ex, idx) => { ex.orderInWorkout = idx + 1; });
        setExercises(updated);
        setSelectedExerciseIndex(null);
        setMenuAnchor(null);
    };

    const handleAddExercise = () => {
        const newEx: WorkoutExerciseDTO = {
            workoutClientId: workoutClientId,
            exerciseClientId: '', // Assign selected exercise ID from your exercise picker flow
            targetSets: 3,
            targetRepetitionsMin: 10,
            targetRepetitionsMax: 12,
            orderInWorkout: exercises.length + 1,
            notes: '',
            exerciseSets: [
                { setType: 'Working', setNumber: 1, weight: 0, targetRepetitions: 10, actualRepetitions: 0, repetitionsInReserve: 0 }
            ]
        };
        setExercises([...exercises, newEx]);
    };

    const handleHistoryPress = () => {
        // Open exercise/workout history modal or route
    };

    const handleOpenExerciseMenu = (exIndex: number) => {
        setSelectedExerciseIndex(exIndex);
        const refNode = exerciseButtonRefs.current[exIndex];
        refNode?.measureInWindow((x, y, width, height) => {
            setMenuAnchor({ x, y, width, height });
        });
    };

    return (
        <View style={styles.container}>
            <CustomHeader
                title={formatElapsedTime(secondsElapsed)}
                onHistoryPress={handleHistoryPress}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.workoutMetaContainer}>
                    <View>
                        <Text style={styles.workoutTitle}>{workoutTitle}</Text>
                        <Text style={styles.workoutDate}>Today, {new Date().toLocaleDateString()}</Text>
                    </View>
                    <TouchableOpacity style={styles.notesBadge} onPress={() => modalControls.openModal("workoutNotes")}>
                        <Text style={styles.timerText}>Notes</Text>
                        <Ionicons name="document-text" size={20} color={accentColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.restTimerCard}>
                    <View>
                        <Text style={styles.restTimerLabel}>Rest Timer</Text>
                        <Text style={styles.restTimerValue}>
                            {restTimeRemaining !== null ? formatElapsedTime(restTimeRemaining) : '00:00'}
                        </Text>
                    </View>
                    <View style={styles.restTimerButtons}>
                        {REST_TIME_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.restBtn, { backgroundColor: accentColor }]}
                                onPress={() => { setRestTimeRemaining(option); setIsResting(true); }}
                            >
                                <Text style={styles.restBtnText}>{option}s</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.restBtnSecondary}
                            onPress={() => { setIsResting(false); setRestTimeRemaining(null); }}
                        >
                            <Text style={styles.restBtnSecondaryText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {exercises.map((exercise, exIndex) => {
                    const exerciseInfo = WorkoutUtils.getExercise(exercise.exerciseClientId);
                    const exerciseName = exerciseInfo?.name || "Custom Exercise";
                    const cardKey = exercise.workoutClientId + "-" + exercise.exerciseClientId + "-" + exIndex;
                    const isExpanded = expanded.includes(cardKey);

                    return (
                        <View key={cardKey} style={styles.exerciseCard}>
                            <TouchableOpacity
                                style={styles.exerciseHeaderRow}
                                onPress={() => toggleExerciseExpand(cardKey)}
                            >
                                <View style={styles.exerciseTitleWrapper}>
                                    <Text style={styles.exerciseIndexNumber}>{exIndex + 1}.</Text>
                                    <Text style={styles.exerciseTitleText}>{exerciseName}</Text>
                                </View>
                                <View style={styles.exerciseHeaderActions}>
                                    <TouchableOpacity
                                        ref={(el) => { exerciseButtonRefs.current[exIndex] = el; }}
                                        onPress={() => handleOpenExerciseMenu(exIndex)}
                                        style={styles.ellipsisBtn}
                                    >
                                        <Ionicons name="ellipsis-horizontal" size={18} color="#888" />
                                    </TouchableOpacity>
                                    <Ionicons
                                        name={isExpanded ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color="#FFF"
                                    />
                                </View>
                            </TouchableOpacity>

                            {isExpanded && (
                                <View style={styles.setsContainer}>
                                    <View style={styles.setHeaderRow}>
                                        <Text style={[styles.setHeaderText, { flex: 0.8 }]}>Set</Text>
                                        <Text style={[styles.setHeaderText, { flex: 1.2 }]}>Type</Text>
                                        <Text style={[styles.setHeaderText, { flex: 1 }]}>Target</Text>
                                        <Text style={[styles.setHeaderText, { flex: 1 }]}>Actual</Text>
                                        <View style={{ width: 30 }} />
                                    </View>

                                    {exercise.exerciseSets?.map((set, setIndex) => (
                                        <View key={setIndex} style={styles.setRow}>
                                            <Text style={[styles.setText, { flex: 0.8 }]}>{set.setNumber}</Text>
                                            <Text style={[styles.setText, { flex: 1.2, color: accentColor, fontSize: 12 }]}>{set.setType}</Text>
                                            <Text style={[styles.setText, { flex: 1 }]}>{set.targetRepetitions}</Text>

                                            <TextInput
                                                style={styles.actualInput}
                                                placeholder="—"
                                                placeholderTextColor="#666"
                                                keyboardType="numeric"
                                                value={set.actualRepetitions !== undefined && set.actualRepetitions !== null ? set.actualRepetitions.toString() : ''}
                                                onChangeText={(val) => handleActualRepsChange(exIndex, setIndex, val)}
                                            />

                                            <TouchableOpacity
                                                style={styles.removeSetBtn}
                                                onPress={() => handleRemoveSet(exIndex, setIndex)}
                                            >
                                                <Ionicons name="close-circle-outline" size={18} color="#ff5252" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}

                                    <TouchableOpacity
                                        style={styles.addSetButton}
                                        onPress={() => handleAddSet(exIndex)}
                                    >
                                        <Ionicons name="add" size={16} color={accentColor} />
                                        <Text style={[styles.addSetText, { color: accentColor }]}>Add Set</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}

                <TouchableOpacity style={styles.addExerciseButton} onPress={handleAddExercise}>
                    <Ionicons name="add-circle" size={20} color="#FFF" />
                    <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
                </TouchableOpacity>

                <View style={styles.footerButtonsRow}>
                    <TouchableOpacity
                        style={styles.discardButton}
                        onPress={() => modalControls.openModal("discardChanges", { onConfirm: () => navigation.goBack()})}
                    >
                        <Text style={styles.discardButtonText}>Discard Workout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.completeButton, { backgroundColor: accentColor }]}
                        onPress={() => console.log("Complete Workout Payload Sent", JSON.stringify(exercises, null, 2))}
                    >
                        <Text style={styles.completeButtonText}>Complete Workout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ActionMenu
                visible={menuAnchor !== null}
                anchorRect={menuAnchor}
                onClose={() => setMenuAnchor(null)}
                items={[
                    {
                        label: 'Notes',
                        icon: 'document-text',
                        onPress: () => modalControls.openModal("exerciseNotes")
                    },
                    {
                        label: 'Move Up',
                        icon: 'chevron-up',
                        onPress: () => moveExercise(-1)
                    },
                    {
                        label: 'Move Down',
                        icon: 'chevron-down',
                        onPress: () => moveExercise(1),
                    },
                    {
                        label: 'Remove Exercise',
                        icon: 'trash',
                        onPress: () => removeExercise(),
                    },
                ]}
            />

            {modals.discardChanges?.isOpen &&
                <ConfirmDialog
                    title={"Discard workout"}
                    visible={modals.discardChanges.isOpen}
                    message={"All progress in this session will be lost."}
                    onConfirm={modals.discardChanges.onConfirm}
                    onCancel={() => modalControls.closeModal("discardChanges")}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    workoutMetaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#1E1E1E',
        padding: 16,
        borderRadius: 12,
    },
    workoutTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    workoutDate: {
        color: '#888888',
        fontSize: 13,
        marginTop: 2,
    },
    notesBadge: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    timerText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    restTimerCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    restTimerLabel: {
        color: '#888888',
        fontSize: 12,
    },
    restTimerValue: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    restTimerButtons: {
        flexDirection: 'row',
        gap: 4,
    },
    restBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    restBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
    restBtnSecondary: {
        backgroundColor: '#333333',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    restBtnSecondaryText: {
        color: '#CCCCCC',
        fontSize: 13,
    },
    exerciseCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    exerciseHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#252525',
    },
    exerciseTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    exerciseIndexNumber: {
        color: '#888888',
        fontWeight: 'bold',
        fontSize: 15,
    },
    exerciseTitleText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
    exerciseHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ellipsisBtn: {
        padding: 4,
    },
    setsContainer: {
        padding: 12,
    },
    setHeaderRow: {
        flexDirection: 'row',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginBottom: 8,
    },
    setHeaderText: {
        color: '#777',
        fontSize: 12,
        fontWeight: 'bold',
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    setText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    actualInput: {
        flex: 1,
        backgroundColor: '#2A2A2A',
        color: '#FFFFFF',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        textAlign: 'center',
        fontSize: 14,
    },
    removeSetBtn: {
        width: 30,
        alignItems: 'flex-end',
    },
    addSetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        marginTop: 6,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
    },
    addSetText: {
        fontWeight: '600',
        fontSize: 13,
    },
    addExerciseButton: {
        flexDirection: 'row',
        backgroundColor: '#252525',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 12,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    addExerciseButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
    footerButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    discardButton: {
        flex: 1,
        backgroundColor: '#2A2A2A',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    discardButtonText: {
        color: '#ff5252',
        fontWeight: 'bold',
        fontSize: 15,
    },
    completeButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
});