import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";

interface MesocycleCalendarProps {
    activeMesocycle?: {
        startDate: string;
        endDate: string;
        name: string;
    } | null;
    onSelectDate?: (dateString: string) => void;
    accentColor?: string;
}

export default function MesocycleCalendar({activeMesocycle, onSelectDate}: MesocycleCalendarProps) {

    const { accentColor } = useAppSelector((state: any):any => state.theme);
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

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
        days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    for (let day = 1; day <= totalDays; day++) {
        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const dateString = `${year}-${formattedMonth}-${formattedDay}`;

        let isInMesocycle = false;
        let isStart = false;
        let isEnd = false;

        if (activeMesocycle) {
            const current = new Date(dateString).getTime();
            const start = new Date(activeMesocycle.startDate).getTime();
            const end = new Date(activeMesocycle.endDate).getTime();

            isInMesocycle = current >= start && current <= end;
            isStart = current === start;
            isEnd = current === end;
        }

        days.push(
            <TouchableOpacity
                key={dateString}
                style={[
                    styles.dayCell,
                    isInMesocycle && { backgroundColor: `${accentColor}33` },
                    isStart && { borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: accentColor },
                    isEnd && { borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: accentColor },
                ]}
                onPress={() => onSelectDate && onSelectDate(dateString)}
            >
                <Text style={[styles.dayText, (isStart || isEnd) && styles.endpointText]}>
                    {day}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.monthTitle}>{monthNames[month]} {year}</Text>
                <View style={styles.arrowGroup}>
                    <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
                        <Ionicons name="chevron-back" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
                        <Ionicons name="chevron-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.weekDaysRow}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, index) => (
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
    arrowGroup: {
        flexDirection: 'row',
        gap: 8,
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
    endpointText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});