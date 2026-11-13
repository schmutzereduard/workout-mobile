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
import useModals from "@/hooks/useModals";
import WorkoutDetailModal from "@/components/modal/WorkoutDetailsModal";

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

    const [searchQuery, setSearchQuery] = useState('');

    const { modals, modalControls } = useModals();

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

    const handleSelectWorkout = (workout: WorkoutDTO) => {
        modalControls.openModal("workoutDetails", { selectedWorkout: workout });
    };

    const handleCloseDetails = () => {
        modalControls.closeModal("workoutDetails");
    };

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
                            <Text style={styles.modalTitle}>Workout History</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={26} color="#888888"/>
                        </TouchableOpacity>
                    </View>

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
                                        onPress={() => handleSelectWorkout(workout)}
                                    >
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.cardTitle}>{workout.name}</Text>
                                            <View style={[styles.badge, {backgroundColor: workout.isDeload ? '#3A2E1E' : '#2C2C2E'}]}>
                                                <Text style={[styles.badgeText, workout.isDeload && {color: '#F0AD4E'}]}>
                                                    {workout.isDeload ? 'Deload' : 'Completed'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.dateRow}>
                                            <Ionicons name="calendar-outline" size={16} color="#AAAAAA"/>
                                            <Text style={styles.dateText}>
                                                {new Date(workout.completedAt).toLocaleDateString()}
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

                    <TouchableOpacity
                        style={[styles.closeBtn, {backgroundColor: '#2C2C2E'}]}
                        onPress={onClose}
                    >
                        <Text style={styles.closeBtnText}>Close</Text>
                    </TouchableOpacity>

                </Pressable>
            </Pressable>

            {modals.workoutDetails?.isOpen &&
                <WorkoutDetailModal
                    visible={modals.workoutDetails.isOpen}
                    workout={modals.workoutDetails.selectedWorkout}
                    onClose={handleCloseDetails}
                />
            }
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
    listContainer: {
        flexShrink: 1,
    },
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