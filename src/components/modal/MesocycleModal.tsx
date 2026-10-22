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
import { MesocycleDTO, MesocycleTemplateDTO } from "@/types/workout";
import {testMesocyclesDTO, testWorkoutTemplatesDTO} from "@/utils/TestData";
import MesocycleTemplateModal from "@/components/modal/MesocycleTemplateModal";
import useModals from "@/hooks/useModals";

interface MesocycleModalProps {
    visible: boolean;
    initialData?: MesocycleDTO | null;
    initialDate? : string | null;
    onSave: (mesocycleData: MesocycleDTO) => void;
    onDelete?: (clientId: string) => void;
    onClose: () => void;
}

export default function MesocycleModal({
                                           visible,
                                           initialData,
                                           initialDate,
                                           onSave,
                                           onDelete,
                                           onClose
                                       }: MesocycleModalProps) {
    const { accentColor } = useAppSelector((state: any) => state.theme);

    const { modals, modalControls } = useModals();

    const [name, setName] = useState('');
    const [targetWeeks, setTargetWeeks] = useState('4');
    const [deloadWeek, setDeloadWeek] = useState('4');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [scheduledWorkouts, setScheduledWorkouts] = useState<MesocycleTemplateDTO[]>([]);

    const [editingTemplateIndex, setEditingTemplateIndex] = useState<number | null>(null);

    const [error, setError] = useState('');

    useEffect(() => {

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (startDate && dateRegex.test(startDate)) {
            const weeks = parseInt(targetWeeks, 10) || 4;
            const start = new Date(startDate);
            if (!isNaN(start.getTime())) {
                const calculatedEnd = new Date(start);
                calculatedEnd.setDate(calculatedEnd.getDate() + (weeks * 7 - 1));
                setEndDate(calculatedEnd.toISOString().split('T')[0]);
            }
        } else {
            setEndDate("");
        }
    }, [startDate, targetWeeks]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setTargetWeeks(String(initialData.targetWeeks || 4));
            setDeloadWeek(String(initialData.deloadWeek || 4));
            setStartDate(initialData.startDate || '');
            setEndDate(initialData.endDate || '');
            setScheduledWorkouts(initialData.mesocycleTemplates || []);
        } else {
            setName('');
            setTargetWeeks('4');
            setDeloadWeek('4');
            setStartDate(initialDate || "");
            setScheduledWorkouts([]);
        }
        setError('');
    }, [initialData, visible]);

    const getNextWeekAndDay = () => {
        if (scheduledWorkouts.length === 0) return { week: 1, day: 1 };
        const last = scheduledWorkouts[scheduledWorkouts.length - 1];
        let nextDay = last.dayNumber + 1;
        let nextWeek = last.weekNumber;
        if (nextDay > 7) {
            nextDay = 1;
            nextWeek += 1;
        }
        return { week: nextWeek, day: nextDay };
    };

    const handleSaveTemplateSlot = (slotData: MesocycleTemplateDTO) => {
        if (editingTemplateIndex !== null) {
            const updated = [...scheduledWorkouts];
            updated[editingTemplateIndex] = {
                ...updated[editingTemplateIndex],
                workoutTemplateId: slotData.workoutTemplateId,
                weekNumber: slotData.weekNumber,
                dayNumber: slotData.dayNumber,
            };
            setScheduledWorkouts(updated);
            setEditingTemplateIndex(null);
        } else {
            setScheduledWorkouts([...scheduledWorkouts, slotData]);
        }
        modalControls.closeModal("addTemplate");
    };

    const handleRemoveScheduledWorkout = (index: number) => {
        const filtered = scheduledWorkouts.filter((_, i) => i !== index);

        const weeksMap = new Map<number, MesocycleTemplateDTO[]>();

        filtered.forEach(item => {
            const week = item.weekNumber || 1;
            if (!weeksMap.has(week)) {
                weeksMap.set(week, []);
            }
            weeksMap.get(week)!.push(item);
        });

        const resequenced: MesocycleTemplateDTO[] = [];

        weeksMap.forEach((templatesInWeek, weekNum) => {
            templatesInWeek.forEach((item, dayIndex) => {
                resequenced.push({
                    ...item,
                    weekNumber: weekNum,
                    dayNumber: dayIndex + 1, // Reset days to 1, 2, 3... within this week
                });
            });
        });

        setScheduledWorkouts(resequenced);
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...scheduledWorkouts];

        const currentWeek = updated[index].weekNumber;
        const currentDay = updated[index].dayNumber;

        const targetWeek = updated[index - 1].weekNumber;
        const targetDay = updated[index - 1].dayNumber;

        const temp = updated[index];
        updated[index] = updated[index - 1];
        updated[index - 1] = temp;

        updated[index].weekNumber = currentWeek;
        updated[index].dayNumber = currentDay;
        updated[index - 1].weekNumber = targetWeek;
        updated[index - 1].dayNumber = targetDay;

        setScheduledWorkouts(updated);
    };

    const handleMoveDown = (index: number) => {
        if (index === scheduledWorkouts.length - 1) return;
        const updated = [...scheduledWorkouts];

        const currentWeek = updated[index].weekNumber;
        const currentDay = updated[index].dayNumber;

        const targetWeek = updated[index + 1].weekNumber;
        const targetDay = updated[index + 1].dayNumber;

        const temp = updated[index];
        updated[index] = updated[index + 1];
        updated[index + 1] = temp;

        updated[index].weekNumber = currentWeek;
        updated[index].dayNumber = currentDay;
        updated[index + 1].weekNumber = targetWeek;
        updated[index + 1].dayNumber = targetDay;

        setScheduledWorkouts(updated);
    };

    const handleSavePress = () => {
        if (!name.trim()) {
            setError('Mesocycle name cannot be empty');
            return;
        }
        if (!startDate || !endDate) {
            setError('Start and end dates are required');
            return;
        }
        if (testMesocyclesDTO.find(meso => meso.metadata.clientId !== initialData?.metadata.clientId && endDate >= meso.startDate && endDate <= meso.endDate)) {
            setError('Mesocycle already exists in interval');
            return;
        }

        const metadata = initialData?.metadata || {
            clientId: Crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        const payload: MesocycleDTO = {
            metadata,
            name: name.trim(),
            targetWeeks: parseInt(targetWeeks, 10),
            deloadWeek: parseInt(deloadWeek, 10),
            startDate,
            endDate,
            mesocycleTemplates: scheduledWorkouts,
        };

        onSave(payload);
        onClose();
    };

    const getTemplateName = (templateClientId: string) => {
        const found = testWorkoutTemplatesDTO.find(
            t => t.metadata?.clientId === String(templateClientId)
        );
        return found ? found.name : `Template #${templateClientId}`;
    };

    const handleRepeatLastWeek = () => {
        if (scheduledWorkouts.length === 0) {
            setError('Add workouts for Week 1 before repeating.');
            return;
        }

        // Find the highest week number currently scheduled
        const maxWeek = Math.max(...scheduledWorkouts.map(w => w.weekNumber));
        const targetWeeksNum = parseInt(targetWeeks, 10) || 4;

        if (maxWeek >= targetWeeksNum) {
            setError(`Cannot repeat past target weeks limit (${targetWeeksNum} weeks).`);
            return;
        }

        const nextWeekNumber = maxWeek + 1;

        // Grab all templates belonging to the latest week
        const lastWeekTemplates = scheduledWorkouts.filter(w => w.weekNumber === maxWeek);

        // Duplicate them with the new weekNumber
        const duplicatedTemplates: MesocycleTemplateDTO[] = lastWeekTemplates.map(item => ({
            ...item,
            id: undefined, // Clear id so backend/state treats it as a new slot entry
            weekNumber: nextWeekNumber,
        }));

        setScheduledWorkouts([...scheduledWorkouts, ...duplicatedTemplates]);
        setError('');
    };

    const isEditMode = !!initialData?.metadata?.clientId;
    const nextDefaults = getNextWeekAndDay();

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.dialogBox} onPress={(e) => e.stopPropagation()}>

                    <View style={styles.headerRow}>
                        <Text style={styles.title}>
                            {isEditMode ? 'Edit Mesocycle' : 'New Mesocycle'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>

                        <Text style={styles.label}>Mesocycle Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Hypertrophy Block 1"
                            placeholderTextColor="#555"
                            value={name}
                            onChangeText={(val) => { setName(val); setError(''); }}
                        />

                        <View style={styles.rowDates}>
                            <View style={styles.dateCol}>
                                <Text style={styles.label}>Target Weeks *</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={targetWeeks}
                                    onChangeText={setTargetWeeks}
                                />
                            </View>
                            <View style={styles.dateCol}>
                                <Text style={styles.label}>Deload Week *</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={deloadWeek}
                                    onChangeText={setDeloadWeek}
                                />
                            </View>
                        </View>

                        <View style={styles.rowDates}>
                            <View style={styles.dateCol}>
                                <Text style={styles.label}>{`Start Date\n(YYYY-MM-DD)`}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="2026-10-20"
                                    placeholderTextColor="#555"
                                    value={startDate}
                                    onChangeText={setStartDate}
                                />
                            </View>
                            <View style={styles.dateCol}>
                                <Text style={styles.label}>{`End Date\n(Calculated)`}</Text>
                                <TextInput
                                    style={[styles.input, styles.disabledInput]}
                                    value={endDate}
                                    editable={false}
                                />
                            </View>
                        </View>

                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.label}>Scheduled Templates ({scheduledWorkouts.length})</Text>

                            <View style={styles.headerButtonRow}>
                                <TouchableOpacity
                                    style={[styles.addSlotHeaderBtn, { borderColor: '#555' }]}
                                    onPress={handleRepeatLastWeek}
                                >
                                    <Ionicons name="copy-outline" size={14} color="#AAA" />
                                    <Text style={[styles.addSlotHeaderText, { color: '#AAA' }]}>Repeat Week</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.addSlotHeaderBtn, { borderColor: accentColor }]}
                                    press-feedback="none"
                                    onPress={() => {
                                        setEditingTemplateIndex(null);
                                        modalControls.openModal("addTemplate");
                                    }}
                                >
                                    <Ionicons name="add" size={16} color={accentColor} />
                                    <Text style={[styles.addSlotHeaderText, { color: accentColor }]}>Add Workout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {scheduledWorkouts.length > 0 && (
                            <View style={styles.slotsList}>
                                {scheduledWorkouts.map((slot, index) => (
                                    <View key={slot.id || index} style={styles.slotItem}>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() => {
                                                setEditingTemplateIndex(index);
                                                modalControls.openModal("addTemplate");
                                            }}
                                        >
                                            <Text style={styles.slotTitle}>{getTemplateName(slot.workoutTemplateClientId || "")}</Text>
                                            <Text style={styles.slotSub}>Week {slot.weekNumber} • Day {slot.dayNumber}</Text>
                                        </TouchableOpacity>
                                        <View style={styles.slotActions}>
                                            <TouchableOpacity onPress={() => handleMoveUp(index)} disabled={index === 0}>
                                                <Ionicons name="arrow-up" size={16} color={index === 0 ? '#444' : '#CCC'} style={{ marginRight: 8 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleMoveDown(index)} disabled={index === scheduledWorkouts.length - 1}>
                                                <Ionicons name="arrow-down" size={16} color={index === scheduledWorkouts.length - 1 ? '#444' : '#CCC'} style={{ marginRight: 12 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleRemoveScheduledWorkout(index)}>
                                                <Ionicons name="trash-outline" size={18} color="#FF4D4D" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: accentColor }]}
                            onPress={handleSavePress}
                        >
                            <Text style={styles.primaryButtonText}>
                                {isEditMode ? 'Update Mesocycle' : 'Save Mesocycle'}
                            </Text>
                        </TouchableOpacity>

                        {isEditMode && onDelete && initialData?.metadata?.clientId && (
                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton]}
                                onPress={() => {
                                    onDelete(initialData.metadata.clientId!);
                                    onClose();
                                }}
                            >
                                <Text style={styles.deleteButtonText}>Delete Mesocycle</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </Pressable>
            </Pressable>

            {modals.addTemplate?.isOpen && (
                <MesocycleTemplateModal
                    visible={modals.addTemplate.isOpen}
                    templatesList={testWorkoutTemplatesDTO}
                    existingSlots={scheduledWorkouts}
                    initialData={editingTemplateIndex !== null ? scheduledWorkouts[editingTemplateIndex] : undefined}
                    defaultWeek={nextDefaults.week}
                    defaultDay={nextDefaults.day}
                    onSave={handleSaveTemplateSlot}
                    onClose={() => modalControls.closeModal("addTemplate")}
                />
            )}
        </Modal>
    );
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
        marginBottom: 10,
        fontWeight: '600',
    },
    formScroll: {
        maxHeight: 480,
    },
    label: {
        color: '#AAAAAA',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        height: 42,
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: '#FFFFFF',
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#3A3A3A',
        flex: 1,
    },
    disabledInput: {
        backgroundColor: '#222',
        color: '#777',
        borderColor: '#2D2D2D',
    },
    rowDates: {
        flexDirection: 'row',
        gap: 10,
    },
    dateCol: {
        flex: 1,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 6,
    },
    headerButtonRow: {
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
    },
    addSlotHeaderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: '#2A2A2A',
    },
    addSlotHeaderText: {
        fontSize: 12,
        fontWeight: '700',
    },
    slotsList: {
        marginTop: 8,
    },
    slotItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#252525',
        padding: 10,
        borderRadius: 8,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#333',
    },
    slotActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slotTitle: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    slotSub: {
        color: '#888',
        fontSize: 11,
    },
    buttonContainer: {
        marginTop: 16,
        gap: 8,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 77, 77, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 77, 0.4)',
    },
    deleteButtonText: {
        color: '#FF4D4D',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelButton: {
        backgroundColor: '#2A2A2A',
    },
    cancelButtonText: {
        color: '#AAAAAA',
        fontWeight: '600',
        fontSize: 14,
    },
});