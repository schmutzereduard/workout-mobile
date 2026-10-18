import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from "react-redux";
import CustomHeader from "@/components/CustomHeader";
import GenericCard from "@/components/GenericCard";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function WorkoutTemplatesScreen() {
    const templates = [
        { id: '1', name: 'Upper Body A', notes: 'Chest, Shoulders & Triceps • 5 Exercises' },
        { id: '2', name: 'Lower Body A', notes: 'Quads, Hamstrings & Calves • 4 Exercises' },
        { id: '3', name: 'Push Day B', notes: 'Bench Press, Overhead Press • 5 Exercises' },
        { id: '4', name: 'Pull Day A', notes: 'Deadlifts, Rows & Pull-ups • 5 Exercises' },
        { id: '5', name: 'Leg Day B', notes: 'Squats, RDLs & Core • 4 Exercises' },
    ];

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { backgroundColor, accentColor } = useSelector((state: any) => state.theme);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddPress = () => {
        console.log("Opens create workout template modal");
    };

    const handleDeletePress = () => {
        console.log("Delete workout templates for IDs:", selectedIds);
        // Reset after delete action if desired
        setIsSelectionMode(false);
        setSelectedIds([]);
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

    const handleSelectAll = () => {
        if (selectedIds.length === templates.length) {
            setSelectedIds([]);
            setIsSelectionMode(false);
        } else {
            setSelectedIds(templates.map(t => t.id));
        }
    };

    const filteredTemplates = templates.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAllSelected = selectedIds.length === templates.length && templates.length > 0;

    return (
        <View style={[styles.container, { backgroundColor }]}>

            <CustomHeader
                showSearch={true}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search templates..."
                onClearSearch={() => setSearchQuery('')}
                onHistoryPress={handleHistoryPress}
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
                    data={filteredTemplates}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                            <GenericCard
                                title={item.name}
                                subtitle={item.notes}
                                selectable={isSelectionMode}
                                selected={isSelected}
                                onLongPress={() => handleLongPressCard(item.id)}
                                onPress={() => {
                                    if (isSelectionMode) {
                                        toggleSelectId(item.id);
                                    } else {
                                        console.log('Selected Template: ', item.name);
                                    }
                                }}
                            />
                        );
                    }}
                />
            </View>

            {!isSelectionMode && (
                <TouchableOpacity style={[styles.addBtn, { backgroundColor: accentColor}]} onPress={handleAddPress}>
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
        color: '#FF4D4D',
        fontWeight: 'bold',
        fontSize: 18,
    },
    addBtn: {
        position: 'absolute',
        bottom: 24,
        right: 24,
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