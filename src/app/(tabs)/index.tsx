import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import MesocycleCalendar from '../../components/MesocycleCalendar';
import GenericCard from "@/components/GenericCard";
import {useAppSelector} from "@/store/store";

export default function MesocyclesScreen() {

    const { backgroundColor, accentColor } = useAppSelector((state: any): any => state.theme);
    const [activeMeso, setActiveMeso] = useState({
        name: 'Hypertrophy Block A',
        startDate: '2026-10-01',
        endDate: '2026-10-22', // 6 weeks later
    });

    const handleHistoryPress = () => {
        console.log('Open past mesocycles history modal');
    };

    const handleAddPress = () => {
        console.log("Opens add mesocycle modal");
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            <CustomHeader
                title={"Mesocycles"}
                onHistoryPress={handleHistoryPress}
            />

            <View style={styles.content}>
                <MesocycleCalendar
                    activeMesocycle={activeMeso}
                    onSelectDate={(date) => console.log('Selected date:', date)}
                />

                <GenericCard
                    header="NEXT UP • Week 2, Day 1"
                    title="Lower Body - Heavy"
                    subtitle="Tap to start tracking session"
                    onPress={() => console.log('Open session')}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingVertical: 20 },
});