import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import MesocycleCalendar from '../../components/MesocycleCalendar';
import GenericCard from "@/components/GenericCard";
import {useAppSelector} from "@/store/store";
import useModals from "@/hooks/useModals";
import MesocycleModal from "@/components/modal/MesocycleModal";
import {MesocycleDTO, WorkoutTemplateDTO} from "@/types/workout";
import MesocycleHistoryModal from "@/components/modal/MesocycleHistoryModal";
import WorkoutUtils from "@/utils/Storage";

const { width: screenWidth } = Dimensions.get('window');

export default function MesocyclesScreen() {

    const { backgroundColor } = useAppSelector((state: any): any => state.theme);
    const { modals, modalControls } = useModals();

    const handleHistoryPress = () => {
        modalControls.openModal("mesocyclesHistory")
    };

    const handleAddPress = () => {
        modalControls.openModal("addMesocycle");
    };

    const handleDatePress = (date: string) => {
        //TODO -> Open View only workout
        const existingMeso = WorkoutUtils.getMesocycles().find(meso => date >= meso.startDate && date <= meso.endDate);
        if (existingMeso) {
            modalControls.openModal("editMesocycle", { mesocycle: existingMeso })
        } else {
            modalControls.openModal("addMesocycle", { initialDate: date });
        }
    };

    const handleSavePress = (mesocycleData: MesocycleDTO) => {
        console.log("Saving mesocycle: " + JSON.stringify(mesocycleData));
    };

    const handlePlayPress = (workoutTemplate: WorkoutTemplateDTO | null) => {
        console.log("Starting session" + JSON.stringify(workoutTemplate));
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            <CustomHeader
                title={"Mesocycles"}
                onHistoryPress={handleHistoryPress}
            />

            <View style={styles.content}>
                <MesocycleCalendar
                    onAddPress={handleAddPress}
                    onSelectDate={handleDatePress}
                />

                <ScrollView
                    horizontal={true}
                    pagingEnabled={true}
                    snapToInterval={screenWidth}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                >
                    {WorkoutUtils.getOrderedRemainingMesocycleTemplatesInActiveMesocycle().map((mesoTemp, index) => {
                        const template = WorkoutUtils.getWorkoutTemplate(mesoTemp.workoutTemplateClientId);

                        return (
                            <View key={index} style={[styles.carouselCardPage, { width: screenWidth }]}>
                                <GenericCard
                                    style={styles.carouselCard}
                                    header={(index === 0 ? "NEXT-UP - " : "") + `Week ${mesoTemp.weekNumber} • Day ${mesoTemp.dayNumber}`}
                                    title={template?.name || ""}
                                    subtitle={
                                        template?.templateExercises
                                            ? `${template.templateExercises.map(tempEx => WorkoutUtils.getExercises().find(ex => ex.metadata.clientId === tempEx.exerciseClientId)).filter(Boolean).flatMap(ex => ex!.muscleGroups).filter((group, index, self) => self.indexOf(group) === index).join(' • ')} - ${template.templateExercises.length} Exercises${template?.notes ? `\n${template.notes}` : ""}`
                                            : `${template?.templateExercises?.length || 0} Exercises${template?.notes ? `\n${template.notes}` : ""}`
                                    }
                                    onPlayPress={() => handlePlayPress(template)}
                                />
                            </View>
                        );
                    })}
                </ScrollView>

                {modals.addMesocycle?.isOpen &&
                    <MesocycleModal
                        visible={modals.addMesocycle.isOpen}
                        onSave={handleSavePress}
                        onClose={() => modalControls.closeModal("addMesocycle")}
                    />
                }

                {modals.editMesocycle?.isOpen &&
                    <MesocycleModal
                        visible={modals.editMesocycle.isOpen}
                        initialData={modals.editMesocycle.mesocycle}
                        onSave={handleSavePress}
                        onClose={() => modalControls.closeModal("editMesocycle")}
                    />
                }

                {modals.mesocyclesHistory?.isOpen &&
                    <MesocycleHistoryModal
                        visible={modals.mesocyclesHistory?.isOpen}
                        onClose={() => modalControls.closeModal("mesocyclesHistory")}
                    />
                }
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