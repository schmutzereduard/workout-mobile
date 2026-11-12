import React, {useMemo, useState} from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    ScrollView,
    TextInput,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";
import {WorkoutDTO} from "@/types/workout";
import {WorkoutUtils} from "@/utils/Storage";

interface WorkoutHistoryModalProps {
    visible: boolean;
    workoutTemplateId?: string;
    onClose: () => void;
}

export default function WorkoutHistoryModal({
                                                visible,
                                                workoutTemplateId,
                                                onClose,
                                            }: WorkoutHistoryModalProps) {
    const {accentColor} = useAppSelector((state: any) => state.sync);

    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDTO | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleBack = () => {
        if (selectedWorkout) {
            setSelectedWorkout(null);
        } else {
            onClose();
        }
    };

    const filteredHistory = useMemo(() => {
        const pastWorkouts = workoutTemplateId
            ? WorkoutUtils.getWorkoutsByWorkoutTemplate(workoutTemplateId)
            : WorkoutUtils.getWorkouts();

        if (!searchQuery.trim()) return pastWorkouts;

        const query = searchQuery.toLowerCase();
        return pastWorkouts.filter(workout =>
            (workout.name && workout.name.toLowerCase().includes(query)) ||
            (workout.completedAt && workout.completedAt.toLowerCase().includes(query)) ||
            (workout.notes && workout.notes.toLowerCase().includes(query))
        );
    }, [searchQuery, workoutTemplateId]);

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
                            {selectedWorkout && (
                                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={22} color="#FFFFFF"/>
                                </TouchableOpacity>
                            )}
                            <Text style={styles.modalTitle}>
                                {selectedWorkout ? selectedWorkout.name : "Workout History"}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={26} color="#888888"/>
                        </TouchableOpacity>
                    </View>

                    {!selectedWorkout ? (
                        <View style={styles.listContainer}>
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={18} color="#888888" style={styles.searchIcon}/>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search by workout name or date..."
                                    placeholderTextColor="#666666"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                                        <Ionicons name="close-circle" size={16} color="#888888"/>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
                                {filteredHistory && filteredHistory.length > 0 ? (
                                    filteredHistory.map((workout, index) => (
                                        <TouchableOpacity
                                            key={workout.metadata?.clientId || index}
                                            style={styles.card}
                                            onPress={() => setSelectedWorkout(workout)}
                                        >
                                            <View style={styles.cardHeader}>
                                                <Text style={styles.cardTitle}>{workout.name || "Workout Session"}</Text>
                                                <View style={[styles.badge, {backgroundColor: workout.isDeload ? '#3A2E1E' : '#2C2C2E'}]}>
                                                    <Text style={[styles.badgeText, workout.isDeload && {color: '#F0AD4E'}]}>
                                                        {workout.isDeload ? 'Deload' : 'Completed'}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.dateRow}>
                                                <Ionicons name="calendar-outline" size={16} color="#AAAAAA"/>
                                                <Text style={styles.dateText}>
                                                    {workout.completedAt ? new Date(workout.completedAt).toLocaleDateString() : 'N/A'}
                                                </Text>
                                            </View>

                                            <View style={styles.metaRow}>
                                                <Text style={styles.metaText}>
                                                    Exercises: <Text style={{
                                                    color: accentColor,
                                                    fontWeight: 'bold'
                                                }}>{workout.exercises?.length || 0}</Text>
                                                </Text>
                                                <Ionicons name="chevron-forward" size={18} color="#888888"/>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Ionicons name="fitness-outline" size={48} color="#555555"/>
                                        <Text style={styles.emptyText}>No past workouts found.</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    ) : (
                        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
                            <View style={styles.detailBox}>
                                <Text style={styles.detailLabel}>Completed Date</Text>
                                <Text style={styles.detailValue}>
                                    {selectedWorkout.completedAt ? new Date(selectedWorkout.completedAt).toLocaleString() : 'N/A'}
                                </Text>
                            </View>

                            {selectedWorkout.notes ? (
                                <View style={styles.detailBox}>
                                    <Text style={styles.detailLabel}>Workout Notes</Text>
                                    <Text style={styles.detailValue}>{selectedWorkout.notes}</Text>
                                </View>
                            ) : null}

                            <View style={styles.detailBox}>
                                <Text style={styles.detailLabel}>Exercises Performed ({selectedWorkout.exercises?.length || 0})</Text>
                                {selectedWorkout.exercises && selectedWorkout.exercises.map((exercise, i) => {
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
                    )}

                    <TouchableOpacity
                        style={[styles.closeBtn, {backgroundColor: '#2C2C2E'}]}
                        onPress={selectedWorkout ? () => setSelectedWorkout(null) : onClose}
                    >
                        <Text style={styles.closeBtnText}>
                            {selectedWorkout ? "Back to Workout History" : "Close"}
                        </Text>
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
    backButton: {
        marginRight: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
        paddingVertical: 0,
    },
    listContainer: {},
    scrollArea: {
        marginVertical: 8,
    },
    card: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333333',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 12,
        color: '#AAAAAA',
        fontWeight: '600',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 13,
        color: '#AAAAAA',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    metaText: {
        fontSize: 13,
        color: '#888888',
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#888888',
        fontSize: 15,
        marginTop: 10,
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