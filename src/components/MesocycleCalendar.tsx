import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from "@/store/store";
import {DAYS_NAMES_SHORT, MONTH_NAMES} from "@/utils/Constants";
import { MesocycleDTO } from "@/types/workout";
import WorkoutUtils from "@/utils/Storage";

interface MesocycleCalendarProps {
    onSelectDate?: (dateString: string, matchedMesocycle?: MesocycleDTO) => void;
    onAddPress?: () => void;
}

export default function MesocycleCalendar({ onSelectDate, onAddPress }: MesocycleCalendarProps) {
    const { accentColor } = useAppSelector((state: any): any => state.theme);
    const [currentDate, setCurrentDate] = useState(new Date());

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
        days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    for (let day = 1; day <= totalDays; day++) {
        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const dateString = `${year}-${formattedMonth}-${formattedDay}`;

        const currentTime = new Date(dateString).getTime();

        const matchedMesocycle = WorkoutUtils.getMesocycles().find(meso => {
            const start = new Date(meso.startDate).getTime();
            const end = new Date(meso.endDate).getTime();
            return currentTime >= start && currentTime <= end;
        });

        const isInMesocycle = !!matchedMesocycle;

        days.push(
            <TouchableOpacity
                key={dateString}
                style={[
                    styles.dayCell,
                    isInMesocycle && {
                        backgroundColor: `${accentColor}33`,
                        borderRadius: 8
                    },
                ]}
                onPress={() => onSelectDate && onSelectDate(dateString, matchedMesocycle)}
            >
                <Text style={styles.dayText}>
                    {day}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
                <View style={styles.buttonsGroup}>
                    <TouchableOpacity onPress={onAddPress} style={styles.addBtn}>
                        <Ionicons name="add-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
                        <Ionicons name="chevron-back" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
                        <Ionicons name="chevron-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.weekDaysRow}>
                {DAYS_NAMES_SHORT.map((d, index) => (
                    <Text key={index} style={styles.weekDayText}>{d}</Text>
                ))}
            </View>

            <View style={styles.grid}>
                {days}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonsGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    addBtn: {
        backgroundColor: '#333333',
        padding: 6,
        borderRadius: 8,
    },
    arrowBtn: {
        backgroundColor: '#333333',
        padding: 6,
        borderRadius: 8,
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    weekDayText: {
        color: '#888888',
        fontSize: 12,
        fontWeight: 'bold',
        width: 36,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    emptyDay: {
        width: '14.28%',
        height: 40,
    },
    dayCell: {
        width: '14.28%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
    },
    dayText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
});