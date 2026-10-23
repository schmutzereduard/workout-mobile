import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    ScrollView
} from 'react-native';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from "@/store/store";
import { MesocycleTemplateDTO, WorkoutTemplateDTO } from "@/types/workout";
import WorkoutUtils from "@/utils/Storage";

interface MesocycleTemplateModalProps {
    visible: boolean;
    existingSlots: MesocycleTemplateDTO[];
    initialData?: MesocycleTemplateDTO;
    defaultWeek: number;
    defaultDay: number;
    onSave: (data: MesocycleTemplateDTO) => void;
    onClose: () => void;
}

export default function MesocycleTemplateModal({
                                                   visible,
                                                   existingSlots,
                                                   initialData,
                                                   defaultWeek,
                                                   defaultDay,
                                                   onSave,
                                                   onClose
                                               }: MesocycleTemplateModalProps) {
    const { accentColor } = useAppSelector((state: any) => state.theme);

    const [selectedTemplateClientId, setSelectedTemplateClientId] = useState<string>();
    const [searchQuery, setSearchQuery] = useState('');
    const [weekNumber, setWeekNumber] = useState(String(defaultWeek));
    const [dayNumber, setDayNumber] = useState(String(defaultDay));
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setSelectedTemplateClientId(initialData.workoutTemplateClientId);
            setWeekNumber(String(initialData.weekNumber));
            setDayNumber(String(initialData.dayNumber));
        } else {
            setWeekNumber(String(defaultWeek));
            setDayNumber(String(defaultDay));
        }
    }, [initialData, visible, defaultWeek, defaultDay]);

    const filteredTemplates = WorkoutUtils.getWorkoutTemplates().filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddPress = () => {
        if (!selectedTemplateClientId) {
            setError('Please select a workout template');
            return;
        }

        const parsedWeek = parseInt(weekNumber, 10);
        const parsedDay = parseInt(dayNumber, 10);

        if (isNaN(parsedWeek) || parsedWeek < 1) {
            setError('Week number must be at least 1');
            return;
        }
        if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 7) {
            setError('Day number must be between 1 and 7');
            return;
        }

        const conflict = existingSlots.some(
            (slot, idx) =>
                slot.weekNumber === parsedWeek &&
                slot.dayNumber === parsedDay &&
                (!initialData || existingSlots.indexOf(initialData) !== idx)
        );

        if (conflict) {
            setError(`A template is already scheduled for Week ${parsedWeek}, Day ${parsedDay}`);
            return;
        }

        const templateSlot: MesocycleTemplateDTO = {
            id: initialData?.id,
            clientId: initialData?.clientId || Crypto.randomUUID(),
            mesocycleClientId: initialData?.mesocycleClientId || Crypto.randomUUID(),
            workoutTemplateClientId: selectedTemplateClientId,
            weekNumber: parsedWeek,
            dayNumber: parsedDay,
        };

        onSave(templateSlot);
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.dialogBox} onPress={(e) => e.stopPropagation()}>

                    <View style={styles.headerRow}>
                        <Text style={styles.title}>
                            {initialData ? 'Edit Template' : 'Select Template'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>

                        <Text style={styles.label}>Choose Template *</Text>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={16} color="#777" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search templates..."
                                placeholderTextColor="#666"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <View style={styles.pickerWrapper}>
                            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                                {filteredTemplates.length > 0 ? (
                                    filteredTemplates.map((template) => {
                                        const tId = template.metadata?.id || template.metadata?.clientId;
                                        const isSelected = selectedTemplateClientId === template.metadata?.clientId;
                                        return (
                                            <TouchableOpacity
                                                key={template.metadata?.clientId || tId}
                                                style={[
                                                    styles.optionRow,
                                                    isSelected && { backgroundColor: accentColor, borderColor: accentColor }
                                                ]}
                                                onPress={() => setSelectedExerciseIdOrTemplate(template, tId)}
                                            >
                                                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                                    {template.name}
                                                </Text>
                                                {template.notes ? (
                                                    <Text style={[styles.optionSubText, isSelected && styles.optionSubTextSelected]} numberOfLines={1}>
                                                        {template.notes}
                                                    </Text>
                                                ) : null}
                                            </TouchableOpacity>
                                        );
                                    })
                                ) : (
                                    <Text style={styles.noResultsText}>No templates found</Text>
                                )}
                            </ScrollView>
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={styles.halfInputContainer}>
                                <Text style={styles.label}>Week # *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="1"
                                    placeholderTextColor="#555"
                                    keyboardType="numeric"
                                    value={weekNumber}
                                    onChangeText={(val) => { setWeekNumber(val); setError(''); }}
                                />
                            </View>

                            <View style={styles.halfInputContainer}>
                                <Text style={styles.label}>Day # (1-7) *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="1"
                                    placeholderTextColor="#555"
                                    keyboardType="numeric"
                                    value={dayNumber}
                                    onChangeText={(val) => { setDayNumber(val); setError(''); }}
                                />
                            </View>
                        </View>

                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: accentColor }]}
                            onPress={handleAddPress}
                        >
                            <Text style={styles.primaryButtonText}>
                                {initialData ? 'Update Slot' : 'Add to Schedule'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </Pressable>
            </Pressable>
        </Modal>
    );

    function setSelectedExerciseIdOrTemplate(template: WorkoutTemplateDTO, tId: any) {
        setSelectedTemplateClientId(template.metadata?.clientId || tId);
        setError('');
    }
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    dialogBox: {
        width: '100%',
        maxHeight: '90%',
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    errorText: {
        color: '#FF4D4D',
        fontSize: 13,
        marginBottom: 8,
        fontWeight: '600',
    },
    formScroll: {
        maxHeight: 440,
    },
    label: {
        color: '#AAAAAA',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3A3A3A',
        paddingHorizontal: 10,
        marginBottom: 8,
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        color: '#FFFFFF',
        fontSize: 14,
    },
    pickerWrapper: {
        height: 160,
        backgroundColor: '#222222',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333',
        padding: 6,
        marginBottom: 4,
    },
    optionRow: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 6,
        backgroundColor: '#2A2A2A',
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    optionText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    optionTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    optionSubText: {
        color: '#888888',
        fontSize: 11,
    },
    optionSubTextSelected: {
        color: '#DDDDDD',
    },
    noResultsText: {
        color: '#777',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 13,
    },
    input: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: '#FFFFFF',
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInputContainer: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: 16,
        gap: 10,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#2A2A2A',
    },
    cancelButtonText: {
        color: '#AAAAAA',
        fontWeight: '600',
        fontSize: 15,
    },
});