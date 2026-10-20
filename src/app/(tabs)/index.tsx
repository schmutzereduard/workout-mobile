import { StyleSheet, View, ScrollView } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import MesocycleCalendar from '../../components/MesocycleCalendar';
import GenericCard from "@/components/GenericCard";
import {useAppSelector} from "@/store/store";
import useModals from "@/hooks/useModals";
import MesocycleModal from "@/components/modal/MesocycleModal";
import {MesocycleDTO} from "@/types/workout";

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
        //TODO: iterate through mesocycles and open Add / Edit Mesocycle modal
        modalControls.openModal("editMesocycle");
    };

    const handleSavePress = (mesocycleData: MesocycleDTO) => {
        console.log("Saving mesocycle: " + mesocycleData)
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

                <GenericCard
                    header="NEXT UP • Week 2, Day 1"
                    title="Lower Body - Heavy"
                    subtitle="Tap to start tracking session"
                    onPress={() => console.log('Open session')}
                />

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
                        //TODO - iterate through mesocycles and pass Edit Mesocycle / do this on handleDatePress and pass from modal.editMesoycles.obj
                        // initialData={}
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
});