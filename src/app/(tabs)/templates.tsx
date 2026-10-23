import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from "@/components/CustomHeader";
import GenericCard from "@/components/GenericCard";
import {useCallback, useState} from "react";
import { Ionicons } from "@expo/vector-icons";
import {useAppSelector} from "@/store/store";
import useModals from "@/hooks/useModals";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {useFocusEffect} from "expo-router";
import WorkoutTemplateModal from "@/components/modal/WorkoutTemplateModal";
import WorkoutUtils from "@/utils/Storage";

export default function WorkoutTemplatesScreen() {

    const { modals, modalControls } = useModals();
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { backgroundColor, accentColor } = useAppSelector((state: any) => state.theme);
    const [searchQuery, setSearchQuery] = useState('');

    const workoutTemplates = WorkoutUtils.getWorkoutTemplates();

    useFocusEffect(
        useCallback(() => {
            return () => {
                setIsSelectionMode(false);
                setSelectedIds([]);
            };
        }, [])
    );

    const handleAddPress = () => {
        modalControls.openModal("addTemplate")
    };

    const handleDeletePress = () => {
        modalControls.openModal("deleteTemplate");
    };

    const handleConfirmDeletePress = () => {
        WorkoutUtils.deleteWorkoutTemplates(selectedIds);
        setIsSelectionMode(false);
        setSelectedIds([]);
        modalControls.closeModal("deleteTemplate")
    };

    const handlePressCard = (id: string) => {
        modalControls.openModal("editTemplate", { templateId: id });
    };

    const handleAddTemplate = (templateData: any) => {
        WorkoutUtils.addWorkoutTemplate(templateData);
    };

    const handleEditTemplate = (templateData: any) => {
        WorkoutUtils.editWorkoutTemplate(templateData);
    };

    const handleDeleteTemplate = (id: string) => {
        WorkoutUtils.deleteWorkoutTemplates(Array.of(id));
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
        if (selectedIds.length === workoutTemplates.length) {
            setSelectedIds([]);
            setIsSelectionMode(false);
        } else {
            setSelectedIds(workoutTemplates.map(t => t.metadata.clientId));
        }
    };

    const handlePlayPress = () => {
        console.log("Open workout page");
    };

    const filteredTemplates = workoutTemplates.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAllSelected = selectedIds.length === filteredTemplates.length && filteredTemplates.length > 0;

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
                    keyExtractor={(item) => item.metadata.clientId}
                    renderItem={({ item }) => {
                        const isSelected = selectedIds.includes(item.metadata.clientId);
                        return (
                            <GenericCard
                                header={
                                    item.templateExercises
                                        ? item.templateExercises
                                            .map(tempEx => WorkoutUtils.getExercise(tempEx.exerciseClientId))
                                            .filter(Boolean)
                                            .flatMap(ex => ex!.muscleGroups)
                                            .filter((group, index, self) => self.indexOf(group) === index)
                                            .join(' • ')
                                        : ''
                                }                                title={item.name}
                                subtitle={`${item.templateExercises?.length || 0} Exercises${item.notes ? `\n${item.notes}` : ""}`}
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
                                onPlayPress={handlePlayPress}
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

            {modals.deleteTemplate?.isOpen &&
                <ConfirmDialog
                    visible={modals.deleteTemplate.isOpen}
                    title={"Delete Template(s)"}
                    message={"Are you sure you want to delete these template(s)?"}
                    onConfirm={handleConfirmDeletePress}
                    onCancel={() => modalControls.closeModal("deleteTemplate")}
                />
            }
            {modals.addTemplate?.isOpen &&
                <WorkoutTemplateModal
                    visible={modals.addTemplate.isOpen}
                    templates={workoutTemplates}
                    onSave={handleAddTemplate}
                    onDelete={handleDeleteTemplate}
                    onClose={() => modalControls.closeModal("addTemplate")}
                />
            }

            {modals.editTemplate?.isOpen &&
                <WorkoutTemplateModal
                    visible={modals.editTemplate.isOpen}
                    initialData={WorkoutUtils.getWorkoutTemplate(modals.editTemplate.templateId)}
                    templates={workoutTemplates}
                    onSave={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    onClose={() => modalControls.closeModal("editTemplate")}
                />
            }
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