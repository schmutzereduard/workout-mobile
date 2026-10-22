import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import MesocycleCalendar from '../../components/MesocycleCalendar';
import GenericCard from "@/components/GenericCard";
import {useAppSelector} from "@/store/store";
import useModals from "@/hooks/useModals";
import MesocycleModal from "@/components/modal/MesocycleModal";
import {MesocycleDTO, WorkoutTemplateDTO} from "@/types/workout";
import {testExercisesDTO, testMesocyclesDTO, testWorkoutTemplatesDTO} from "@/utils/TestData";

const { width: screenWidth } = Dimensions.get('window');

export default function MesocyclesScreen() {

    const { backgroundColor } = useAppSelector((state: any): any => state.theme);
    const { modals, modalControls } = useModals();

    const handleHistoryPress = () => {
        console.log('Open past mesocycles history modal');
    };

    const handleAddPress = () => {
        modalControls.openModal("addMesocycle");
    };

    const handleDatePress = (date: string) => {
        const existingMeso = testMesocyclesDTO.find(meso => date >= meso.startDate && date <= meso.endDate);
        if (existingMeso) {
            modalControls.openModal("editMesocycle", { mesocycle: existingMeso })
        } else {
            modalControls.openModal("addMesocycle", { initialDate: date });
        }
    };

    const handleSavePress = (mesocycleData: MesocycleDTO) => {
        console.log("Saving mesocycle: " + mesocycleData)
    };

    const handlePlayPress = () => {
        console.log("Starting session");
    };

    const getActiveMesocycleTemplates = () => {
        const today = new Date().toISOString().split('T')[0];
        const activeMesoTemplates = testMesocyclesDTO.find(
            meso => today >= meso.startDate && today <= meso.endDate
        )?.mesocycleTemplates;

        if (!activeMesoTemplates)
            return [];

        //TODO: Check last workouts performed linked to this Meso and skip them.
        return activeMesoTemplates
            .filter(mesoTemp => mesoTemp)
            .sort((a, b) => {
                if (a.weekNumber !== b.weekNumber) {
                    return a.weekNumber - b.weekNumber;
                }
                return a.dayNumber - b.dayNumber;
            });
    };

    const getWorkoutTemplate = (workoutTemplateClientId: string | undefined): WorkoutTemplateDTO | undefined => {
        return testWorkoutTemplatesDTO.find(temp => temp.metadata.clientId === workoutTemplateClientId);
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
                    {getActiveMesocycleTemplates().map((mesoTemp, index) => {
                        const template = getWorkoutTemplate(mesoTemp.workoutTemplateClientId);

                        return (
                            <View key={index} style={[styles.carouselCardPage, { width: screenWidth }]}>
                                <GenericCard
                                    style={styles.carouselCard}
                                    header={(index === 0 ? "NEXT-UP - " : "") + `Week ${mesoTemp.weekNumber} • Day ${mesoTemp.dayNumber}`}
                                    title={template?.name || ""}
                                    subtitle={
                                        template?.templateExercises
                                            ? `${template.templateExercises.map(tempEx => testExercisesDTO.find(ex => ex.metadata.clientId === tempEx.exerciseClientId)).filter(Boolean).flatMap(ex => ex!.muscleGroups).filter((group, index, self) => self.indexOf(group) === index).join(' • ')} - ${template.templateExercises.length} Exercises${template?.notes ? `\n${template.notes}` : ""}`
                                            : `${template?.templateExercises?.length || 0} Exercises${template?.notes ? `\n${template.notes}` : ""}`
                                    }
                                    onPlayPress={handlePlayPress}
                                />
                            </View>
                        );
                    })}
                </ScrollView>

                {modals.addMesocycle?.isOpen &&
                    <MesocycleModal
                        visible={modals.addMesocycle.isOpen}
                        initialDate={modals.addMesocycle.initialDate}
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