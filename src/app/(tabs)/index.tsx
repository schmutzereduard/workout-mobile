import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import MesocycleCalendar from '../../components/MesocycleCalendar';
import GenericCard from "@/components/GenericCard";
import { useAppSelector } from "@/store/store";
import useModals from "@/hooks/useModals";
import MesocycleModal from "@/components/modal/MesocycleModal";
import { MesocycleDTO } from "@/types/workout";
import MesocycleHistoryModal from "@/components/modal/MesocycleHistoryModal";
import {WorkoutUtils, StorageKeys} from "@/utils/Storage";
import ActionMenu, { AnchorRect } from "@/components/ActionMenu";
import React, { useState } from "react";
import AlertModal from "@/components/modal/AlertModal";
import { useStorageListener } from "@/hooks/useStorageListener";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {router} from "expo-router";
import WorkoutDetailModal from "@/components/modal/WorkoutDetailsModal";

const { width: screenWidth } = Dimensions.get('window');

export default function MesocyclesScreen() {

    const { backgroundColor, accentColor } = useAppSelector((state: any): any => state.sync);
    const { modals, modalControls } = useModals();

    const [menuAnchor, setMenuAnchor] = useState<AnchorRect | null>(null);

    const handleHistoryPress = () => {
        modalControls.openModal("mesocyclesHistory")
    };

    const handleElipsisPress = () => {
        setMenuAnchor({ x: screenWidth - 60, y: 100, width: 40, height: 40 });
    };

    const handleDatePress = (date: string) => {
        let workoutByDate = WorkoutUtils.getWorkoutByDate(date);
        if (workoutByDate) {
            modalControls.openModal("viewWorkout", { selectedWorkout: workoutByDate });
        }
    };

    const handleAddPress = () => {
        if (WorkoutUtils.getActiveMesocycle()) {
            modalControls.openModal("addWarning");
        } else {
            modalControls.openModal("addMesocycle");
        }
    };

    const handleEditPress = () => {
        if (WorkoutUtils.getActiveMesocycle()) {
            modalControls.openModal("editMesocycle");
        } else {
            modalControls.openModal("editWarning");
        }
    };

    const handleAddMesocycle = (mesocycleData: MesocycleDTO) => {
        WorkoutUtils.addMesocycle(mesocycleData);
    };

    const handleEditMesocycle = (mesocycleData: MesocycleDTO) => {
        WorkoutUtils.editMesocycle(mesocycleData);
    };

    let upcomingWorkouts = useStorageListener(
        [StorageKeys.MESOCYCLES, StorageKeys.WORKOUT_TEMPLATES, StorageKeys.WORKOUTS, StorageKeys.MESOCYCLES],
        () => WorkoutUtils.getOrderedRemainingMesocycleTemplatesInActiveMesocycle()
    );

    const canStartWorkout = (): boolean => {

        const activeMeso = WorkoutUtils.getActiveMesocycle();
        if (!activeMeso)
            return false;

        return new Date().toISOString().split("T")[0] >= activeMeso.startDate;
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            <CustomHeader
                title={"Mesocycles"}
                onHistoryPress={handleHistoryPress}
            />

            <View style={styles.content}>
                <MesocycleCalendar
                    onElipsisPress={handleElipsisPress}
                    onSelectDate={handleDatePress}
                />

                <ScrollView
                    horizontal={true}
                    pagingEnabled={true}
                    snapToInterval={screenWidth}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                >
                    {upcomingWorkouts.map((mesoTemp, index) => {
                        const template = WorkoutUtils.getWorkoutTemplatesIncludingDeleted().find(
                            workoutTemplate=> workoutTemplate.metadata.clientId === mesoTemp.workoutTemplateClientId
                        );

                        if (!template)
                            return null;

                        const isDeleted = template.metadata.deletedAt;

                        return (
                            <View key={index} style={[styles.carouselCardPage, { width: screenWidth }]}>
                                <GenericCard
                                    style={styles.carouselCard}
                                    header={(index === 0 ? "NEXT-UP - " : "") + `Week ${mesoTemp.weekNumber} Day ${mesoTemp.dayNumber}`}
                                    title={template.name}
                                    subtitle={
                                        isDeleted
                                            ? "This workout template has been deleted."
                                            : template?.templateExercises
                                                ? `${template.templateExercises.map(tempEx => WorkoutUtils.getExercises().find(ex => ex.metadata.clientId === tempEx.exerciseClientId)).filter(Boolean).flatMap(ex => ex!.muscleGroups).filter((group, index, self) => self.indexOf(group) === index).join(' • ')}\n${template.templateExercises.length} Exercises${template?.notes ? `\n${template.notes}` : ""}`
                                                : `0 Exercises${template?.notes ? `\n${template.notes}` : ""}`
                                    }
                                    onPlayPress={isDeleted || !canStartWorkout() ? undefined : () => modalControls.openModal("startWorkout", {
                                        workoutTemplateId: template.metadata.clientId,
                                        mesocycleId: WorkoutUtils.getActiveMesocycle()!.metadata.clientId,
                                        isDeload: mesoTemp.weekNumber === WorkoutUtils.getMesocycle(mesoTemp.mesocycleClientId)!.deloadWeek
                                    })}
                                />
                            </View>
                        );
                    })}
                </ScrollView>

                {modals.addMesocycle?.isOpen &&
                    <MesocycleModal
                        visible={modals.addMesocycle.isOpen}
                        onSave={handleAddMesocycle}
                        onClose={() => modalControls.closeModal("addMesocycle")}
                    />
                }

                {modals.editMesocycle?.isOpen &&
                    <MesocycleModal
                        visible={modals.editMesocycle.isOpen}
                        initialData={WorkoutUtils.getActiveMesocycle()}
                        onSave={handleEditMesocycle}
                        onClose={() => modalControls.closeModal("editMesocycle")}
                    />
                }

                {modals.mesocyclesHistory?.isOpen &&
                    <MesocycleHistoryModal
                        visible={modals.mesocyclesHistory?.isOpen}
                        onClose={() => modalControls.closeModal("mesocyclesHistory")}
                    />
                }

                {modals.addWarning?.isOpen &&
                    <AlertModal
                        visible={modals.addWarning.isOpen}
                        message={"There can only be 1 active mesocycles at a time"}
                        onClose={() => modalControls.closeModal("addWarning")}
                    />
                }

                {modals.editWarning?.isOpen &&
                    <AlertModal
                        visible={modals.editWarning.isOpen}
                        message={"No active mesocycles present"}
                        onClose={() => modalControls.closeModal("editWarning")}
                    />
                }

                {modals.startWorkout?.isOpen &&
                    <ConfirmDialog
                        title={"Start Workout"}
                        visible={modals.startWorkout.isOpen}
                        message={"Do you want to start the workout?"}
                        onConfirm={() => { router.push({ pathname: "/workout", params: {
                            workoutTemplateId: modals.startWorkout.workoutTemplateId,
                                mesocycleId: modals.startWorkout.mesocycleId,
                                isDeload: modals.startWorkout.isDeload
                        }}); modalControls.closeModal("startWorkout") }}
                        onCancel={() => modalControls.closeModal("startWorkout")}
                    />
                }

                {modals.viewWorkout?.isOpen &&
                    <WorkoutDetailModal
                        visible={modals.viewWorkout.isOpen}
                        workout={modals.viewWorkout.selectedWorkout}
                        onClose={() => modalControls.closeModal("viewWorkout")}
                    />
                }

                <ActionMenu
                    visible={menuAnchor !== null}
                    anchorRect={menuAnchor}
                    onClose={() => setMenuAnchor(null)}
                    items={[
                        {
                            label: 'Add Mesocycle',
                            icon: 'add-outline',
                            color: accentColor,
                            onPress: handleAddPress,
                        },
                        {
                            label: 'Edit Current',
                            icon: 'pencil-sharp',
                            onPress: handleEditPress,
                        },
                    ]}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingVertical: 20 },
    carouselCardPage: {
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    carouselCard: {
        marginHorizontal: 0,
        marginVertical: 0,
    },
});