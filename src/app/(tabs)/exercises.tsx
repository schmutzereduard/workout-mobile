import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from "react-redux";
import CustomHeader from "@/components/CustomHeader";
import GenericCard from "@/components/GenericCard";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ExercisesScreen() {
    const exercises = [
        { id: '1', name: 'Barbell Bench Press', notes: 'Chest • Compound', muscleGroups: 'Chest' },
        { id: '2', name: 'Dumbbell Bench Press', notes: 'Chest • Compound', muscleGroups: 'Chest' },
        { id: '3', name: 'Incline Dumbbell Press', notes: 'Upper Chest • Compound', muscleGroups: 'Chest' },
        { id: '4', name: 'Chest Flyes (Cable/Dumbbell)', notes: 'Chest • Isolation', muscleGroups: 'Chest' },
        { id: '5', name: 'Push-ups', notes: 'Chest • Bodyweight', muscleGroups: 'Chest' },

        // Back
        { id: '6', name: 'Barbell Deadlift', notes: 'Back / Posterior • Compound', muscleGroups: 'Back' },
        { id: '7', name: 'Pull-ups', notes: 'Lats / Upper Back • Compound', muscleGroups: 'Back' },
        { id: '8', name: 'Lat Pulldown', notes: 'Lats • Isolation/Machine', muscleGroups: 'Back' },
        { id: '9', name: 'Barbell Row', notes: 'Mid Back • Compound', muscleGroups: 'Back' },
        { id: '10', name: 'Seated Cable Row', notes: 'Mid Back • Compound', muscleGroups: 'Back' },

        // Legs
        { id: '11', name: 'Barbell Back Squat', notes: 'Quads / Glutes • Compound', muscleGroups: 'Quads' },
        { id: '12', name: 'Romanian Deadlift (RDL)', notes: 'Hamstrings • Compound', muscleGroups: 'Hamstrings' },
        { id: '13', name: 'Leg Press', notes: 'Quads • Machine', muscleGroups: 'Quads' },
        { id: '14', name: 'Bulgarian Split Squat', notes: 'Quads / Glutes • Unilateral', muscleGroups: 'Glutes' },
        { id: '15', name: 'Standing Calf Raises', notes: 'Calves • Isolation', muscleGroups: 'Calves' },

        // Shoulders
        { id: '16', name: 'Overhead Press (OHP)', notes: 'Shoulders • Compound', muscleGroups: 'Shoulders' },
        { id: '17', name: 'Dumbbell Lateral Raises', notes: 'Side Delts • Isolation', muscleGroups: 'Shoulders' },
        { id: '18', name: 'Face Pulls', notes: 'Rear Delts • Isolation', muscleGroups: 'Shoulders' },
        { id: '19', name: 'Dumbbell Shoulder Press', notes: 'Shoulders • Compound', muscleGroups: 'Shoulders' },

        // Arms
        { id: '20', name: 'Barbell Bicep Curl', notes: 'Biceps • Isolation', muscleGroups: 'Biceps' },
        { id: '21', name: 'Hammer Curls', notes: 'Biceps / Forearms • Isolation', muscleGroups: 'Biceps' },
        { id: '22', name: 'Tricep Pushdowns', notes: 'Triceps • Isolation', muscleGroups: 'Triceps' },
        { id: '23', name: 'Skull Crushers', notes: 'Triceps • Isolation', muscleGroups: 'Triceps' },

        // Core
        { id: '24', name: 'Hanging Leg Raises', notes: 'Abs • Bodyweight', muscleGroups: 'Core' },
        { id: '25', name: 'Plank', notes: 'Core • Isometric', muscleGroups: 'Core' },
    ];

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { backgroundColor } = useSelector((state: any) => state.theme);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddPress = () => {
        console.log("Opens add exercise modal");
    };

    const handleDeletePress = () => {
        console.log("Delete exercises for IDs:", selectedIds);
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const handleLongPressCard = (id: string) => {
        setIsSelectionMode(true);
        toggleSelectId(id);
    };

    const toggleSelectId = (id: string) => {
        if (selectedIds.includes(id)) {
            const updated = selectedIds.filter(item => item !== id);
            setSelectedIds(updated);
            if (updated.length === 0) setIsSelectionMode(false);
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === exercises.length) {
            setSelectedIds([]);
            setIsSelectionMode(false);
        } else {
            setSelectedIds(exercises.map(e => e.id));
        }
    };

    const filteredExercises = exercises.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.muscleGroups.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAllSelected = selectedIds.length === exercises.length && exercises.length > 0;

    return (
        <View style={[styles.container, { backgroundColor }]}>

            <CustomHeader
                showSearch={true}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search exercises..."
                onClearSearch={() => setSearchQuery('')}
            />

            {isSelectionMode ? (
                <View style={styles.selectionBar}>
                    <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllContainer}>
                        <Ionicons
                            name={isAllSelected ? "checkbox" : "square-outline"}
                            size={22}
                            color="#FFF"
                        />
                        <Text style={styles.selectionText}>
                            {selectedIds.length} Selected
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleDeletePress} style={styles.deleteActionBtn}>
                        <Ionicons name="trash-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            ) : null}

            <View style={styles.content}>
                <FlatList
                    data={filteredExercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                            <GenericCard
                                header={item.muscleGroups}
                                title={item.name}
                                subtitle={item.notes}
                                selectable={isSelectionMode}
                                selected={isSelected}
                                onLongPress={() => handleLongPressCard(item.id)}
                                onPress={() => {
                                    if (isSelectionMode) {
                                        toggleSelectId(item.id);
                                    } else {
                                        console.log('Selected Exercise: ', item.name);
                                    }
                                }}
                            />
                        );
                    }}
                />
            </View>

            {!isSelectionMode && (
                <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
                    <Ionicons name="add" size={30} color="#FFF" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContentWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    headerSearchBar: {
        flex: 1,
        marginHorizontal: 0,
        marginVertical: 0,
        height: 42,
    },
    content: {
        flex: 1,
        paddingVertical: 10,
    },
    selectionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1E1E1E',
        marginHorizontal: 16,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    selectionText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteActionBtn: {
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    deleteActionText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: 'red',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});