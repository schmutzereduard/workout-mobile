import { FlatList, StyleSheet, View } from 'react-native';
import CustomHeader from "@/components/CustomHeader";
import GenericCard from "@/components/GenericCard";
import { useState } from 'react';
import SearchBar from "@/components/SerachBar";
import {useAppSelector} from "@/store/store";

export default function WorkoutTemplatesScreen() {
    const templates = [
        { id: '1', title: 'Upper Body A (Hypertrophy)', subtitle: 'Chest, Shoulders & Triceps • 5 Exercises' },
        { id: '2', title: 'Lower Body A (Heavy)', subtitle: 'Squats, RDLs & Calves • 4 Exercises' },
        { id: '3', title: 'Push Day B', subtitle: 'Bench Press, Overhead Press • 5 Exercises' },
        { id: '4', title: 'Pull Day A', subtitle: 'Deadlifts, Rows & Pull-ups • 5 Exercises' },
        { id: '5', title: 'Leg Day B (Volume)', subtitle: 'Leg Press, Split Squats • 4 Exercises' },
    ];

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { backgroundColor } = useAppSelector((state: any) => state.theme);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddPress = () => {
        console.log("Opens create workout template modal");
    };

    const handleDeletePress = () => {
        console.log("Opens delete workout templates modal for IDs:", selectedIds);
    };

    const handleHistoryPress = () => {
        console.log("Opens completed workout history log");
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

    const filteredTemplates = templates.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <CustomHeader
                title="Workouts"
                onAddButtonPress={handleAddPress}
                onDeleteButtonPress={isSelectionMode ? handleDeletePress : undefined}
                onHistoryButtonPress={handleHistoryPress}
            />

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search templates by name..."
                onClear={() => setSearchQuery('')}
            />

            <View style={styles.content}>
                <FlatList
                    data={filteredTemplates}
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
                                        console.log('Start workout from template: ', item.title);
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