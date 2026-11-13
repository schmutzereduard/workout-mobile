import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";
import {WorkoutDTO} from "@/types/workout";
import {WorkoutUtils} from "@/utils/Storage";

interface WorkoutDetailModalProps {
    visible: boolean;
    workout: WorkoutDTO | null;
    onClose: () => void;
}

const formatDuration = (totalSeconds: number) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return 'N/A';
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

export default function WorkoutDetailModal({
                                               visible,
                                               workout,
                                               onClose,
                                           }: WorkoutDetailModalProps) {
    const {accentColor} = useAppSelector((state: any) => state.sync);

    if (!workout) return null;

    let durationString = 'N/A';
    if (workout.startedAt && workout.completedAt) {
        const startMs = new Date(workout.startedAt).getTime();
        const endMs = new Date(workout.completedAt).getTime();
        const diffInSeconds = Math.floor((endMs - startMs) / 1000);
        durationString = formatDuration(diffInSeconds);
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>

                    <View style={styles.headerContainer}>
                        <View style={styles.headerTitleRow}>
                            <Text style={styles.modalTitle}>{workout.name || "Workout Details"}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={26} color="#888888"/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Completed Date</Text>
                            <Text style={styles.detailValue}>
                                {workout.completedAt ? new Date(workout.completedAt).toLocaleString() : 'N/A'}
                            </Text>
                        </View>

                        {/* Duration Row Added Here */}
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Workout Duration</Text>
                            <Text style={styles.detailValue}>{durationString}</Text>
                        </View>

                        {workout.notes ? (
                            <View style={styles.detailBox}>
                                <Text style={styles.detailLabel}>Workout Notes</Text>
                                <Text style={styles.detailValue}>{workout.notes}</Text>
                            </View>
                        ) : null}

                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Exercises Performed ({workout.exercises?.length || 0})</Text>
                            {workout.exercises && workout.exercises.map((exercise, i) => {
                                const exerciseInfo = WorkoutUtils.getExercise(exercise.exerciseClientId);
                                const exerciseName = exerciseInfo ? exerciseInfo.name : 'Exercise';
                                const variation = exerciseInfo?.variation ? ` • ${exerciseInfo.variation}` : '';

                                return (
                                    <View key={i} style={styles.exerciseDetailItem}>
                                        <View style={styles.exerciseHeaderRow}>
                                            <Ionicons name="barbell-outline" size={16} color={accentColor}/>
                                            <Text style={styles.exerciseTitleText}>
                                                {i + 1}. {exerciseName}{variation}
                                            </Text>
                                        </View>
                                        {exercise.exerciseSets && exercise.exerciseSets.map((set, sIdx) => (
                                            <View key={sIdx} style={styles.setDetailRow}>
                                                <Text style={styles.setText}>
                                                    Set {set.setNumber} ({set.setType}):
                                                </Text>
                                                <Text style={styles.setValueText}>
                                                    {set.weight}kg × {set.actualRepetitions ?? 0} reps {set.repetitionsInReserve !== undefined ? `(RIR: ${set.repetitionsInReserve})` : ''}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.viewOnlyBadge}>
                            <Ionicons name="lock-closed-outline" size={16} color="#888888"/>
                            <Text style={styles.viewOnlyText}>Past workouts are view-only</Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.closeBtn, {backgroundColor: '#2C2C2E'}]}
                        onPress={onClose}
                    >
                        <Text style={styles.closeBtnText}>Close</Text>
                    </TouchableOpacity>

                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    scrollArea: {
        marginVertical: 8,
    },
    detailBox: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: '#888888',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    exerciseDetailItem: {
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#333333',
    },
    exerciseHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    exerciseTitleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    setDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 24,
        marginVertical: 2,
    },
    setText: {
        fontSize: 13,
        color: '#888888',
    },
    setValueText: {
        fontSize: 13,
        color: '#DDDDDD',
    },
    viewOnlyBadge: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginVertical: 12,
    },
    viewOnlyText: {
        color: '#888888',
        fontSize: 13,
        fontStyle: 'italic',
    },
    closeBtn: {
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
});