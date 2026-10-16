import {FlatList, StyleSheet, View} from 'react-native';
import CustomHeader from "@/components/CustomHeader";
import GenericCard from "@/components/GenericCard";
import {useState} from "react";
import SearchBar from "@/components/SerachBar";
import {useAppSelector} from "@/store/store";

export default function ExercisesScreen() {

    const exercises = [
        { id: '1', title: 'Barbell Bench Press', subtitle: 'Chest • Compound', category: 'Chest' },
        { id: '2', title: 'Dumbbell Bench Press', subtitle: 'Chest • Compound', category: 'Chest' },
        { id: '3', title: 'Incline Dumbbell Press', subtitle: 'Upper Chest • Compound', category: 'Chest' },
        { id: '4', title: 'Chest Flyes (Cable/Dumbbell)', subtitle: 'Chest • Isolation', category: 'Chest' },
        { id: '5', title: 'Push-ups', subtitle: 'Chest • Bodyweight', category: 'Chest' },

        // Back
        { id: '6', title: 'Barbell Deadlift', subtitle: 'Back / Posterior • Compound', category: 'Back' },
        { id: '7', title: 'Pull-ups', subtitle: 'Lats / Upper Back • Compound', category: 'Back' },
        { id: '8', title: 'Lat Pulldown', subtitle: 'Lats • Isolation/Machine', category: 'Back' },
        { id: '9', title: 'Barbell Row', subtitle: 'Mid Back • Compound', category: 'Back' },
        { id: '10', title: 'Seated Cable Row', subtitle: 'Mid Back • Compound', category: 'Back' },

        // Legs
        { id: '11', title: 'Barbell Back Squat', subtitle: 'Quads / Glutes • Compound', category: 'Legs' },
        { id: '12', title: 'Romanian Deadlift (RDL)', subtitle: 'Hamstrings • Compound', category: 'Legs' },
        { id: '13', title: 'Leg Press', subtitle: 'Quads • Machine', category: 'Legs' },
        { id: '14', title: 'Bulgarian Split Squat', subtitle: 'Quads / Glutes • Unilateral', category: 'Legs' },
        { id: '15', title: 'Standing Calf Raises', subtitle: 'Calves • Isolation', category: 'Legs' },

        // Shoulders
        { id: '16', title: 'Overhead Press (OHP)', subtitle: 'Shoulders • Compound', category: 'Shoulders' },
        { id: '17', title: 'Dumbbell Lateral Raises', subtitle: 'Side Delts • Isolation', category: 'Shoulders' },
        { id: '18', title: 'Face Pulls', subtitle: 'Rear Delts • Isolation', category: 'Shoulders' },
        { id: '19', title: 'Dumbbell Shoulder Press', subtitle: 'Shoulders • Compound', category: 'Shoulders' },

        // Arms
        { id: '20', title: 'Barbell Bicep Curl', subtitle: 'Biceps • Isolation', category: 'Arms' },
        { id: '21', title: 'Hammer Curls', subtitle: 'Biceps / Forearms • Isolation', category: 'Arms' },
        { id: '22', title: 'Tricep Pushdowns', subtitle: 'Triceps • Isolation', category: 'Arms' },
        { id: '23', title: 'Skull Crushers', subtitle: 'Triceps • Isolation', category: 'Arms' },

        // Core
        { id: '24', title: 'Hanging Leg Raises', subtitle: 'Abs • Bodyweight', category: 'Core' },
        { id: '25', title: 'Plank', subtitle: 'Core • Isometric - This is how it would look like if the user inputed a very long set of notes', category: 'Core' },
    ];

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { backgroundColor} = useAppSelector((state: any): any => state.theme);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleAddPress = () => {
        console.log("Opens add exercise modal");
    };

    const handleDeletePress = () => {
        console.log("Opens delete exercises modal");
    };

    const handleLongPressCard = (id: string) => {
        setIsSelectionMode(true);
        toggleSelectId(id);
    };

    const toggleSelectId = (id: string) => {
        if (selectedIds.includes(id)) {
            const updated = selectedIds.filter(item => item !== id);
            setSelectedIds(updated);
            if (updated.length === 0) setIsSelectionMode(false); // Exit selection mode if none selected
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const filteredExercises = exercises.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <CustomHeader
                title="Exercises"
                onAddButtonPress={handleAddPress}
                onDeleteButtonPress={isSelectionMode ? handleDeletePress : undefined}
            />

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search exercises by name or notes..."
                onClear={() => setSearchQuery('')}
            />

            <View style={styles.content}>
                <FlatList
                    data={filteredExercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                            <GenericCard
                                title={item.title}
                                subtitle={item.subtitle}
                                selectable={isSelectionMode}
                                selected={isSelected}
                                onLongPress={() => handleLongPressCard(item.id)}
                                onPress={() => {
                                    if (isSelectionMode) {
                                        toggleSelectId(item.id);
                                    } else {
                                        console.log('Selected: ', item.title);
                                    }
                                }}
                            />
                        );
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingVertical: 20,
    },
});