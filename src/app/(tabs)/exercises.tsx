import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from "@/components/CustomHeader";
import GenericCard from "@/components/GenericCard";
import {useCallback, useState} from "react";
import { Ionicons } from "@expo/vector-icons";
import useModals from "@/hooks/useModals";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {useFocusEffect} from "expo-router";
import ExerciseModal from "@/components/modal/ExerciseModal";
import {testExercisesDTO} from "@/utils/TestData";
import {useAppSelector} from "@/store/store";

export default function ExercisesScreen() {

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { backgroundColor, accentColor } = useAppSelector((state: any) => state.theme);
    const [searchQuery, setSearchQuery] = useState('');
    const { modals, modalControls } = useModals();

    useFocusEffect(
        useCallback(() => {
            return () => {
                setIsSelectionMode(false);
                setSelectedIds([]);
            };
        }, [])
    );

    const handleAddPress = () => {
        modalControls.openModal("addExercise")
    };

    const handleDeletePress = () => {
        modalControls.openModal("deleteExercise");
    };

    const handleConfirmDeletePress = () => {
        console.log("Delete testExercisesDTO for IDs:", selectedIds);
        setIsSelectionMode(false);
        setSelectedIds([]);
        modalControls.closeModal("deleteExercise")
    };

    const handlePressCard = (id: string) => {
        modalControls.openModal("editExercise", { exerciseId: id });
    };

    const handleSaveExercise = (exerciseData: any) => {
        console.log("Updating exercise in backend/state:", exerciseData);
    };

    const handleDeleteExercise = (id: string) => {
        console.log("Deleting exercise ID:", id);
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
        if (selectedIds.length === testExercisesDTO.length) {
            setSelectedIds([]);
            setIsSelectionMode(false);
        } else {
            setSelectedIds(testExercisesDTO.map(e => e.metadata.clientId));
        }
    };

    const filteredExercises = testExercisesDTO.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.muscleGroups.map(item => item.toLowerCase()).includes(searchQuery.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAllSelected = selectedIds.length === testExercisesDTO.length && testExercisesDTO.length > 0;

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
                    keyExtractor={(item) => item.metadata.clientId}
                    renderItem={({ item }) => {
                        const isSelected = selectedIds.includes(item.metadata.clientId);
                        return (
                            <GenericCard
                                header={item.muscleGroups.join(",")}
                                title={item.name}
                                subtitle={item.notes}
                                selectable={isSelectionMode}
                                selected={isSelected}
                                onLongPress={() => handleLongPressCard(item.metadata.clientId)}
                                onPress={() => {
                                    if (isSelectionMode) {
                                        toggleSelectId(item.metadata.clientId);
                                    } else {
                                        handlePressCard(item.metadata.clientId);
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

            {modals.deleteExercise?.isOpen &&
                <ConfirmDialog
                    visible={modals.deleteExercise.isOpen}
                    title="Delete Exercise(s)"
                    message={"Are you sure you want to delete these exercise(s)?"}
                    onConfirm={handleConfirmDeletePress}
                    onCancel={() => modalControls.closeModal("deleteExercise")}
                />
            }

            {modals.addExercise?.isOpen &&
                <ExerciseModal
                    visible={modals.addExercise.isOpen}
                    onSave={handleSaveExercise}
                    onDelete={handleDeleteExercise}
                    onClose={() => modalControls.closeModal("addExercise")}
                />
            }

            {modals.editExercise?.isOpen &&
                <ExerciseModal
                    visible={modals.editExercise.isOpen}
                    initialData={testExercisesDTO.find(item => item.metadata.clientId === modals.editExercise.exerciseId)}
                    onSave={handleSaveExercise}
                    onDelete={handleDeleteExercise}
                    onClose={() => modalControls.closeModal("editExercise")}
                />
            }
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