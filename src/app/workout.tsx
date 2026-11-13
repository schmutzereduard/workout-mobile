import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as Crypto from "expo-crypto";
import * as Notifications from 'expo-notifications';
import {BackHandler, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";
import CustomHeader from "@/components/CustomHeader";
import {useFocusEffect, useLocalSearchParams, useNavigation} from "expo-router";
import {UserUtils, WorkoutUtils} from "@/utils/Storage";
import useModals from "@/hooks/useModals";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {
    ExerciseDTO,
    ExerciseSetDTO,
    ExerciseSetType,
    TemplateExerciseDTO,
    WorkoutDTO,
    WorkoutExerciseDTO,
    WorkoutTemplateDTO
} from "@/types/workout";
import ActionMenu, {AnchorRect} from "@/components/ActionMenu";
import NotesModal from "@/components/modal/NotesModal";
import WorkoutExerciseModal from "@/components/modal/WorkoutExerciseModal";
import ExerciseModal from "@/components/modal/ExerciseModal";
import WorkoutHistoryModal from "@/components/modal/WorkoutHistoryModal";

const REST_TIME_OPTIONS = [60, 120, 180];

export default function ActiveWorkoutScreen() {

    const navigation = useNavigation();

    const { workoutTemplateId, mesocycleId, isDeload } = useLocalSearchParams();
    const templateId = Array.isArray(workoutTemplateId) ? workoutTemplateId[0] : workoutTemplateId;
    const mesoId = Array.isArray(mesocycleId) ? mesocycleId[0] : mesocycleId;
    const isDeloadBool = isDeload === 'true';

    const { modals, modalControls } = useModals();

    const { accentColor } = useAppSelector((state: any) => state.sync);

    const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
    const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
    const [workoutTitle, setWorkoutTitle] = useState<string>("");
    const [workoutNotes, setWorkoutNotes] = useState<string>("");
    const [workoutClientId, setWorkoutClientId] = useState<string>("");
    const [exercises, setExercises] = useState<WorkoutExerciseDTO[]>([]);
    const [restEndTime, setRestEndTime] = useState<number | null>(null);
    const [restTimeRemaining, setRestTimeRemaining] = useState<number>(0);
    const [isResting, setIsResting] = useState(false);
    const [expanded, setExpanded] = useState<string[]>([]);

    const [exerciseMenuAnchor, setExerciseMenuAnchor] = useState<AnchorRect | null>(null);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
    const exerciseButtonRefs = useRef<{ [key: number]: View | null }>({});

    const [exerciseSetMenuAnchor, setExerciseSetMenuAnchor] = useState<AnchorRect | null>(null);
    const [targetExerciseIndexForSet, setTargetExerciseIndexForSet] = useState<number | null>(null);
    const addExerciseSetButtonRefs = useRef<{ [key: string]: View | null }>({});

    const [addExerciseMenuAnchor, setAddExerciseMenuAnchor] = useState<AnchorRect | null>(null);
    const addExerciseButtonRef = useRef<View | null>(null);

    useEffect(() => {
        const onBackPress = () => {
            modalControls.openModal("discardChanges", {
                onConfirm: () => {
                    modalControls.closeModal("discardChanges");
                    navigation.goBack();
                }
            });

            return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
    }, [navigation]);

    useEffect(() => {
        if (workoutTemplateId) {
            const workoutTemplate = WorkoutUtils.getWorkoutTemplate(templateId);

            if (workoutTemplate) {
                setWorkoutTitle(workoutTemplate.name);

                if (workoutTemplate.templateExercises) {
                    const generatedWorkoutId = Crypto.randomUUID();
                    setWorkoutClientId(generatedWorkoutId);
                    setExercises(handleExercisesMapping(workoutTemplate));
                }
            }
        }
    }, [workoutTemplateId]);

    useEffect(() => {
        const startTime = Date.now();
        setWorkoutStartTime(startTime);

        const interval = setInterval(() => {
            const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
            setSecondsElapsed(currentElapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [workoutTemplateId]);

    useFocusEffect(
        useCallback(() => {
            if (workoutStartTime !== null) {
                const currentElapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
                setSecondsElapsed(currentElapsed);
            }
        }, [workoutStartTime])
    );

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout> | null = null;

        if (isResting && restEndTime !== null) {
            interval = setInterval(() => {
                const remaining = Math.max(0, Math.floor((restEndTime - Date.now()) / 1000));
                setRestTimeRemaining(remaining);

                if (remaining === 0) {
                    setIsResting(false);
                    setRestEndTime(null);
                    if (interval) clearInterval(interval);
                }
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isResting, restEndTime]);

    useFocusEffect(
        useCallback(() => {
            if (isResting && restEndTime !== null) {
                const remaining = Math.max(0, Math.floor((restEndTime - Date.now()) / 1000));
                setRestTimeRemaining(remaining);

                if (remaining === 0) {
                    setIsResting(false);
                    setRestEndTime(null);
                }
            }
        }, [isResting, restEndTime])
    );

    const handleExercisesMapping = (workoutTemplate: WorkoutTemplateDTO): WorkoutExerciseDTO[] => {

        const templateExercises = workoutTemplate.templateExercises || [];
        const completedWorkouts = WorkoutUtils.getCompletedWorkoutsInMesocycle(mesoId).filter(workout => workout.workoutTemplateClientId === workoutTemplateId);
        const lastCompletedWorkout = completedWorkouts.sort((a, b) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        )[0];

        return templateExercises.map((templateExercise) => {

            const userPreferences = UserUtils.getUserPreferences()!;

            let calculatedWarmupSets;
            if (templateExercise.warmupSets && isDeloadBool) {
                const deloadPercentage = userPreferences.deloadVolumePercentage;
                const reducedSets = templateExercise.warmupSets * (1 - deloadPercentage / 100);
                calculatedWarmupSets = Math.max(1, Math.round(reducedSets));
            }

            const warmupSets: ExerciseSetDTO[] = Array.from({ length: calculatedWarmupSets || 0 }, (_, setIdx) => ({
                setType: "Warmup" as ExerciseSetType,
                setNumber: setIdx + 1,
                weight: handleExerciseSetWeight(templateExercise, lastCompletedWorkout, setIdx + 1, "Warmup"),
                targetRepetitions: handleExerciseSetTargetReps(templateExercise, lastCompletedWorkout, setIdx + 1, "Warmup"),
                actualRepetitions: 0,
                repetitionsInReserve: 0
            }));

            let calculatedTargetSets = templateExercise.targetSets;
            if (isDeloadBool) {
                const deloadPercentage = userPreferences.deloadVolumePercentage;
                const reducedSets = templateExercise.targetSets * (1 - deloadPercentage / 100);
                calculatedTargetSets = Math.max(1, Math.round(reducedSets));
            }

            const workingSets: ExerciseSetDTO[] = Array.from({ length: calculatedTargetSets }, (_, setIdx) => ({
                setType: "Working" as ExerciseSetType,
                setNumber: setIdx + 1,
                weight: handleExerciseSetWeight(templateExercise, lastCompletedWorkout, setIdx + 1, "Working"),
                targetRepetitions: handleExerciseSetTargetReps(templateExercise, lastCompletedWorkout, setIdx + 1, "Working"),
                actualRepetitions: 0,
                repetitionsInReserve: 0
            }));

            return {
                workoutClientId: workoutClientId,
                exerciseClientId: templateExercise.exerciseClientId,
                targetSets: templateExercise.targetSets,
                targetRepetitionsMin: templateExercise.targetRepetitionsMin,
                targetRepetitionsMax: templateExercise.targetRepetitionsMax,
                orderInWorkout: templateExercise.exerciseOrder,
                notes: '',
                exerciseSets: [...warmupSets, ...workingSets],
            };
        });
    };

    const handleExerciseSetWeight = (
        templateExercise: TemplateExerciseDTO,
        lastCompletedWorkout: WorkoutDTO,
        setNumber: number,
        setType: ExerciseSetType
    ): number => {

        const defaultValue = 0;
        const userPreferences = UserUtils.getUserPreferences()!;

        if (!lastCompletedWorkout)
            return defaultValue;

        const lastCompletedExercise = lastCompletedWorkout.exercises?.find(
            exercise => exercise.exerciseClientId === templateExercise.exerciseClientId
        );

        if (!lastCompletedExercise || !lastCompletedExercise.exerciseSets || lastCompletedExercise.exerciseSets.length === 0)
            return defaultValue;

        const previousSet = lastCompletedExercise.exerciseSets.find(
            exerciseSet => exerciseSet.setType === setType && exerciseSet.setNumber === setNumber
        ) || lastCompletedExercise.exerciseSets[lastCompletedExercise.exerciseSets.length - 1];
        if (!previousSet)
            return defaultValue;

        const lastWeightUsed = previousSet.weight;
        if (isDeloadBool) {
            const deloadPercentage = userPreferences.deloadIntensityPercentage;
            if (deloadPercentage > 0) {
                const reducedWeight = lastWeightUsed * (1 - deloadPercentage / 100);
                return Math.max(0, Math.round(reducedWeight / 2.5) * 2.5);
            } else {
                return lastWeightUsed;
            }
        }

        if (templateExercise.targetRepetitionsMin === templateExercise.targetRepetitionsMax) { //Linear
            const targetReps = templateExercise.targetRepetitionsMax;

            const allSetsHitTarget = lastCompletedExercise.exerciseSets.every(
                exerciseSet => (exerciseSet.actualRepetitions) >= targetReps
            );

            if (allSetsHitTarget) {
                const increment = userPreferences.progressiveOverloadIncrement;
                return lastWeightUsed + increment;
            } else {
                return lastWeightUsed;
            }

        } else if (templateExercise.targetRepetitionsMax > templateExercise.targetRepetitionsMin) { //Double
            const maxRepRange = templateExercise.targetRepetitionsMax;

            const allSetsHitTopOfRange = lastCompletedExercise.exerciseSets.every(
                exerciseSet => (exerciseSet.actualRepetitions) >= maxRepRange
            );

            if (allSetsHitTopOfRange) {
                const increment = userPreferences.progressiveOverloadIncrement;
                return lastWeightUsed + increment;
            } else {
                return lastWeightUsed;
            }
        } else {
            return defaultValue;
        }
    };

    const handleExerciseSetTargetReps = (
        templateExercise: TemplateExerciseDTO,
        lastCompletedWorkout: WorkoutDTO,
        setNumber: number,
        setType: ExerciseSetType,
    ): number => {

        const defaultValue = templateExercise.targetRepetitionsMin;

        if (!lastCompletedWorkout)
            return defaultValue;

        const lastCompletedExercise = lastCompletedWorkout.exercises?.find(
            exercise => exercise.exerciseClientId === templateExercise.exerciseClientId
        );

        if (!lastCompletedExercise || !lastCompletedExercise.exerciseSets || lastCompletedExercise.exerciseSets.length === 0)
            return defaultValue;

        const previousSet = lastCompletedExercise.exerciseSets.find(
            exerciseSet => exerciseSet.setType === setType && exerciseSet.setNumber === setNumber
        ) || lastCompletedExercise.exerciseSets[lastCompletedExercise.exerciseSets.length - 1];

        if (!previousSet)
            return defaultValue;

        const actualRepsLastTime = previousSet.actualRepetitions;

        if (templateExercise.targetRepetitionsMin === templateExercise.targetRepetitionsMax) { // Linear
            return templateExercise.targetRepetitionsMax;
        } else if ((templateExercise.targetRepetitionsMax) > (templateExercise.targetRepetitionsMin)) { //Double
            const maxRepRange = templateExercise.targetRepetitionsMax;
            const minRepRange = templateExercise.targetRepetitionsMin;

            const allSetsHitTopOfRange = lastCompletedExercise.exerciseSets.every(
                exerciseSet => exerciseSet.actualRepetitions >= maxRepRange
            );

            if (allSetsHitTopOfRange) {
                return minRepRange;
            } else {
                return Math.min(maxRepRange, Math.max(minRepRange, actualRepsLastTime + 1));
            }
        }

        return defaultValue;
    };

    const toggleExerciseExpand = (cardKey: string) => {
        if (expanded.includes(cardKey)) {
            setExpanded(expanded.filter(key => key !== cardKey));
        } else {
            setExpanded([...expanded, cardKey]);
        }
    };

    const handleWeightChange = (exIndex: number, setIndex: number, val: string) => {
        const updated = [...exercises];
        const parsedReps = val === '' ? 0 : parseFloat(val);
        if (updated[exIndex].exerciseSets) {
            updated[exIndex].exerciseSets![setIndex].weight = parsedReps;
            setExercises(updated);
        }
    };

    const handleTargetRepsChange = (exIndex: number, setIndex: number, val: string) => {
        const updated = [...exercises];
        const parsedReps = val === '' ? 0 : parseInt(val, 10);
        if (updated[exIndex].exerciseSets) {
            updated[exIndex].exerciseSets![setIndex].targetRepetitions = parsedReps;
            setExercises(updated);
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

    const handleReserveRepsChange = (exIndex: number, setIndex: number, val: string) => {
        const updated = [...exercises];
        const parsedReps = val === '' ? 0 : parseInt(val, 10);
        if (updated[exIndex].exerciseSets) {
            updated[exIndex].exerciseSets![setIndex].repetitionsInReserve = parsedReps;
            setExercises(updated);
        }
    };

    const handleAddSet = (setType: ExerciseSetType) => {
        if (targetExerciseIndexForSet === null) return;
        const exIndex = targetExerciseIndexForSet;
        const updated = [...exercises];
        const currentSets = [...(updated[exIndex].exerciseSets || [])];

        const referenceSet = currentSets.reverse().find(s => s.setType === setType) || currentSets[0];

        const newSet: ExerciseSetDTO = {
            setType: setType,
            setNumber: 0,
            weight: referenceSet ? referenceSet.weight : 0,
            targetRepetitions: referenceSet ? referenceSet.targetRepetitions : (setType === "Warmup" ? 12 : 10),
            actualRepetitions: 0,
            repetitionsInReserve: 0
        };

        currentSets.push(newSet);

        currentSets.sort((a, b) => {
            if (a.setType === "Warmup" && b.setType !== "Warmup") return -1;
            if (a.setType !== "Warmup" && b.setType === "Warmup") return 1;
            return 0;
        });

        let warmupCount = 0;
        let workingCount = 0;

        updated[exIndex].exerciseSets = currentSets.map((s) => {
            if (s.setType === "Warmup") {
                warmupCount += 1;
                return {...s, setNumber: warmupCount};
            } else {
                workingCount += 1;
                return {...s, setNumber: workingCount};
            }
        });
        setExercises(updated);
        setExerciseSetMenuAnchor(null);
        setTargetExerciseIndexForSet(null);
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

    const handleMoveExercise = (direction: number) => {
        if (selectedExerciseIndex === null) return;
        const newIndex = selectedExerciseIndex + direction;
        if (newIndex < 0 || newIndex >= exercises.length) return;

        const updated = [...exercises];
        const temp = updated[selectedExerciseIndex];
        updated[selectedExerciseIndex] = updated[newIndex];
        updated[newIndex] = temp;

        updated.forEach((ex, idx) => { ex.orderInWorkout = idx + 1; });

        setExercises(updated);
        setSelectedExerciseIndex(newIndex);
        setExerciseMenuAnchor(null);
    };

    const handleRemoveExercise = () => {
        if (selectedExerciseIndex === null) return;
        const updated = exercises.filter((_, i) => i !== selectedExerciseIndex);
        updated.forEach((ex, idx) => { ex.orderInWorkout = idx + 1; });
        setExercises(updated);
        setSelectedExerciseIndex(null);
        setExerciseMenuAnchor(null);
    };

    const handleAddExercise = (addedExercise: WorkoutExerciseDTO) => {
        const updated = [...exercises];
        updated.push(addedExercise);
        setExercises(updated);
    };

    const handleCreateExercise = (exerciseData: ExerciseDTO) => {
        WorkoutUtils.addExercise(exerciseData);
        modalControls.closeModal("createExercise");
        modalControls.openModal("addExercise");
    };

    const handleHistoryPress = () => {
        modalControls.openModal("workoutHistory", { workoutTemplateId: workoutTemplateId });
    };

    const handleCompleteWorkout = () => {

        const completedWorkout: WorkoutDTO = {
            metadata: {
                clientId: workoutClientId
            },
            startedAt: new Date(workoutStartTime!).toISOString(),
            completedAt: new Date().toISOString(),
            mesocycleClientId: mesoId,
            workoutTemplateClientId: templateId,
            exercises: exercises,
            notes: workoutNotes,
            isDeload: isDeloadBool,
            name: workoutTitle
        };

        WorkoutUtils.addWorkout(completedWorkout);
        navigation.goBack();
    };

    const handleOpenAddExerciseMenu = () => {
        addExerciseButtonRef.current?.measureInWindow((x, y, width, height) => {
            setAddExerciseMenuAnchor({ x, y, width, height });
        });
    };

    const handleOpenExerciseMenu = (exIndex: number) => {
        setSelectedExerciseIndex(exIndex);
        const refNode = exerciseButtonRefs.current[exIndex];
        refNode?.measureInWindow((x, y, width, height) => {
            setExerciseMenuAnchor({ x, y, width, height });
        });
    };

    const handleOpenAddSetMenu = (exIndex: number, setKey: string) => {
        setTargetExerciseIndexForSet(exIndex);
        const refNode = addExerciseSetButtonRefs.current[setKey];
        refNode?.measureInWindow((x, y, width, height) => {
            setExerciseSetMenuAnchor({ x, y, width, height });
        });
    };

    const startRestTimerWithNotification = async (durationInSeconds: number) => {
        const targetTime = Date.now() + (durationInSeconds * 1000);
        setRestEndTime(targetTime);
        setRestTimeRemaining(durationInSeconds);
        setIsResting(true);

        await Notifications.dismissAllNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Rest Over! 🏋️‍♂️",
                body: "Time for your next set.",
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: durationInSeconds,
                repeats: false,
            },
        });
    };

    const resetRestTimer = async () => {
        setIsResting(false);
        setRestTimeRemaining(0);
        await Notifications.dismissAllNotificationsAsync();
    };

    const formatToMinutes = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        if (secs === 0) {
            return `${mins}m`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatElapsedTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const paddedMins = mins.toString().padStart(2, '0');
        const paddedSecs = secs.toString().padStart(2, '0');

        if (hours > 0) {
            return `${hours}:${paddedMins}:${paddedSecs}`;
        }

        return `${paddedMins}:${paddedSecs}`;
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
                    <TouchableOpacity
                        style={styles.notesBadge}
                        onPress={() => modalControls.openModal("notes", {
                            title: "Workout Notes",
                            initialNotes: workoutNotes,
                            onSave: setWorkoutNotes,
                        })}>
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
                                onPress={() => startRestTimerWithNotification(option)}
                            >
                                <Text style={styles.restBtnText}>{formatToMinutes(option)}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.restBtnSecondary}
                            onPress={resetRestTimer}
                        >
                            <Text style={styles.restBtnSecondaryText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {exercises.map((exercise, exIndex) => {
                    const exerciseInfo = WorkoutUtils.getExercise(exercise.exerciseClientId);
                    const exerciseName = exerciseInfo!.name;
                    const exerciseVariation = exerciseInfo!.variation;
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
                                    <Text style={styles.exerciseTitleText}>{exerciseVariation ? exerciseName.concat(" • ").concat(exerciseVariation) : exerciseName}</Text>
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
                                    {Boolean(exercise.exerciseSets?.length) &&
                                        <View style={styles.setHeaderRow}>
                                            <Text style={[styles.setHeaderText, { width: 28 }]}>Set</Text>
                                            <Text style={[styles.setHeaderText, { width: 55 }]}>Type</Text>
                                            <Text style={[styles.setHeaderText, { flex: 1, textAlign: 'center' }]}>{UserUtils.getUserPreferences()!.weightUnit}*</Text>
                                            <Text style={[styles.setHeaderText, { flex: 1, textAlign: 'center' }]}>Target*</Text>
                                            <Text style={[styles.setHeaderText, { flex: 1, textAlign: 'center' }]}>Actual*</Text>
                                            <Text style={[styles.setHeaderText, { flex: 1, textAlign: 'center' }]}>Reserve</Text>
                                            <View style={{ width: 28 }} />
                                        </View>}

                                    {exercise.exerciseSets?.map((set, setIndex) => (
                                        <View key={setIndex} style={styles.setRow}>
                                            <Text style={[styles.setText, { width: 28, textAlign: 'center' }]}>{set.setNumber}</Text>
                                            <Text style={[styles.setText, { width: 55, color: set.setType === "Working" ? accentColor : '#888', fontSize: 11, fontWeight: '600' }]}>
                                                {set.setType}
                                            </Text>
                                            <TextInput
                                                style={styles.actualInput}
                                                placeholder="—"
                                                placeholderTextColor="#666"
                                                keyboardType="numeric"
                                                value={set.weight.toString()}
                                                onChangeText={(val) => handleWeightChange(exIndex, setIndex, val)}
                                            />
                                            <TextInput
                                                style={styles.actualInput}
                                                placeholder="—"
                                                placeholderTextColor="#666"
                                                keyboardType="numeric"
                                                value={set.targetRepetitions.toString()}
                                                onChangeText={(val) => handleTargetRepsChange(exIndex, setIndex, val)}
                                            />
                                            <TextInput
                                                style={styles.actualInput}
                                                placeholder="—"
                                                placeholderTextColor="#666"
                                                keyboardType="numeric"
                                                value={set.actualRepetitions !== undefined && set.actualRepetitions !== null ? set.actualRepetitions.toString() : ''}
                                                onChangeText={(val) => handleActualRepsChange(exIndex, setIndex, val)}
                                            />
                                            <TextInput
                                                style={styles.actualInput}
                                                placeholder="—"
                                                placeholderTextColor="#666"
                                                keyboardType="numeric"
                                                value={set.repetitionsInReserve?.toString()}
                                                onChangeText={(val) => handleReserveRepsChange(exIndex, setIndex, val)}
                                            />

                                            <TouchableOpacity
                                                style={styles.removeSetBtn}
                                                onPress={() => handleRemoveSet(exIndex, setIndex)}
                                            >
                                                <Ionicons name="trash-outline" size={18} color="#ff5252" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}

                                    <TouchableOpacity
                                        ref={(el) => { addExerciseSetButtonRefs.current[`ex-${exIndex}`] = el; }}
                                        style={styles.addSetButton}
                                        onPress={() => handleOpenAddSetMenu(exIndex, `ex-${exIndex}`)}
                                    >
                                        <Ionicons name="add" size={16} color={accentColor} />
                                        <Text style={[styles.addSetText, { color: accentColor }]}>Add Set</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}

                <View style={styles.footerButtonsRow}>
                    <TouchableOpacity
                        ref={(el) => { addExerciseButtonRef.current = el; }}
                        style={styles.addExerciseButton}
                        onPress={handleOpenAddExerciseMenu}
                    >
                        <Ionicons name="add-circle" size={20} color="#FFF" />
                        <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.completeButton, { backgroundColor: accentColor }]}
                        onPress={() => modalControls.openModal("completeWorkout")}
                    >
                        <Text style={styles.completeButtonText}>Complete Workout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {modals.discardChanges?.isOpen &&
                <ConfirmDialog
                    title={"Discard workout"}
                    visible={modals.discardChanges.isOpen}
                    message={"All progress in this session will be lost."}
                    onConfirm={modals.discardChanges.onConfirm}
                    onCancel={() => {
                        modalControls.closeModal("discardChanges");
                    }}
                />
            }

            {modals.completeWorkout?.isOpen &&
                <ConfirmDialog
                    title={"Complete workout"}
                    visible={modals.completeWorkout.isOpen}
                    message={"This will end and save the current workout session."}
                    onConfirm={handleCompleteWorkout}
                    onCancel={() => {
                        modalControls.closeModal("completeWorkout");
                    }}
                />
            }

            {modals.notes?.isOpen &&
                <NotesModal
                    visible={modals.notes.isOpen}
                    title={modals.notes.title}
                    initialNotes={modals.notes.initialNotes}
                    onClose={() => modalControls.closeModal("notes")}
                    onSave={modals.notes.onSave}
                />
            }

            {modals.addExercise?.isOpen &&
                <WorkoutExerciseModal
                    visible={modals.addExercise.isOpen}
                    workoutClientId={workoutClientId}
                    orderInWorkout={exercises.length + 1}
                    onClose={() => modalControls.closeModal("addExercise")}
                    onSave={handleAddExercise}
                />
            }

            {modals.createExercise?.isOpen &&
                <ExerciseModal
                    visible={modals.createExercise.isOpen}
                    exercises={WorkoutUtils.getExercises()}
                    onSave={handleCreateExercise}
                    onClose={() => modalControls.closeModal("createExercise")}
                />
            }

            {modals.workoutHistory?.isOpen &&
                <WorkoutHistoryModal
                    visible={modals.workoutHistory.isOpen}
                    workoutTemplateId={modals.workoutHistory.workoutTemplateId}
                    onClose={() => modalControls.closeModal("workoutHistory")}
                />
            }

            <ActionMenu
                visible={exerciseMenuAnchor !== null}
                anchorRect={exerciseMenuAnchor}
                onClose={() => setExerciseMenuAnchor(null)}
                items={[
                    {
                        label: 'Notes',
                        icon: 'document-text',
                        onPress: () => modalControls.openModal("notes", {
                            title: "Exercise Notes",
                            initialNotes: exercises[selectedExerciseIndex!].notes,
                            onSave: (updatedNotes: string) => {
                                const updated = [...exercises];
                                updated[selectedExerciseIndex!].notes = updatedNotes;
                                setExercises(updated);
                            }
                        })
                    },
                    ...(selectedExerciseIndex !== null && selectedExerciseIndex > 0 ? [{
                        label: 'Move Up',
                        icon: 'chevron-up' as const,
                        onPress: () => handleMoveExercise(-1)
                    }] : []),
                    ...(selectedExerciseIndex !== null && selectedExerciseIndex < exercises.length - 1 ? [{
                        label: 'Move Down',
                        icon: 'chevron-down' as const,
                        onPress: () => handleMoveExercise(1),
                    }] : []),
                    {
                        label: 'Remove Exercise',
                        icon: 'trash',
                        onPress: () => handleRemoveExercise(),
                    },
                ]}
            />

            <ActionMenu
                visible={addExerciseMenuAnchor !== null}
                anchorRect={addExerciseMenuAnchor}
                onClose={() => setAddExerciseMenuAnchor(null)}
                items={[
                    {
                        label: 'Existing',
                        icon: 'list',
                        onPress: () => {
                            setAddExerciseMenuAnchor(null);
                            modalControls.openModal("addExercise");
                        }
                    },
                    {
                        label: 'Create New',
                        icon: 'add',
                        onPress: () => {
                            setAddExerciseMenuAnchor(null);
                            modalControls.openModal("createExercise");
                        }
                    }
                ]}
            />

            <ActionMenu
                visible={exerciseSetMenuAnchor !== null}
                anchorRect={exerciseSetMenuAnchor}
                onClose={() => {
                    setExerciseSetMenuAnchor(null);
                    setTargetExerciseIndexForSet(null);
                }}
                items={[
                    {
                        label: 'Warmup Set',
                        icon: 'sunny-outline',
                        onPress: () => handleAddSet("Warmup")
                    },
                    {
                        label: 'Working Set',
                        icon: 'barbell-outline',
                        color: accentColor,
                        onPress: () => handleAddSet("Working")
                    },
                ]}
            />
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
        padding: 8,
    },
    setHeaderRow: {
        flexDirection: 'row',
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginBottom: 6,
    },
    setHeaderText: {
        color: '#777',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        gap: 4
    },
    setText: {
        color: '#FFFFFF',
        fontSize: 13,
    },
    actualInput: {
        flex: 1,
        height: 36,
        backgroundColor: '#2A2A2A',
        color: '#FFFFFF',
        paddingVertical: 0,
        paddingHorizontal: 4,
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
    },
    addExerciseButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
    footerButtonsRow: {
        gap: 8,
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