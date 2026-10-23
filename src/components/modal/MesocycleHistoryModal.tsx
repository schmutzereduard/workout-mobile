import React, {useMemo, useState} from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    ScrollView, TextInput,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";
import {MesocycleDTO} from "@/types/workout";
import WorkoutUtils from "@/utils/Storage";

interface MesocycleHistoryModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function MesocycleHistoryModal({
                                                  visible,
                                                  onClose,
                                              }: MesocycleHistoryModalProps) {
    const {accentColor} = useAppSelector((state: any) => state.theme);

    const [selectedMeso, setSelectedMeso] = useState<MesocycleDTO | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleBack = () => {
        if (selectedMeso) {
            setSelectedMeso(null);
        } else {
            onClose();
        }
    };

    const filteredHistory = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];

        const pastMesos = WorkoutUtils.getMesocycles().filter(meso => today >= meso.endDate);

        if (!searchQuery.trim()) return pastMesos;

        const query = searchQuery.toLowerCase();
        return pastMesos.filter(meso =>
            meso.name.toLowerCase().includes(query) ||
            meso.startDate.includes(query) ||
            meso.endDate.includes(query)
        );
    }, [searchQuery]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>

                    <View style={styles.headerContainer}>
                        <View style={styles.headerTitleRow}>
                            {selectedMeso && (
                                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={22} color="#FFFFFF"/>
                                </TouchableOpacity>
                            )}
                            <Text style={styles.modalTitle}>
                                {selectedMeso ? selectedMeso.name : "Mesocycle History"}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={26} color="#888888"/>
                        </TouchableOpacity>
                    </View>

                    {!selectedMeso ? (
                        <View style={styles.listContainer}>
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={18} color="#888888" style={styles.searchIcon}/>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search by name or date..."
                                    placeholderTextColor="#666666"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                                        <Ionicons name="close-circle" size={16} color="#888888"/>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
                                {filteredHistory && filteredHistory.length > 0 ? (
                                    filteredHistory.map((meso, index) => (
                                        <TouchableOpacity
                                            key={meso.metadata?.clientId || index}
                                            style={styles.card}
                                            onPress={() => setSelectedMeso(meso)}
                                        >
                                            <View style={styles.cardHeader}>
                                                <Text style={styles.cardTitle}>{meso.name}</Text>
                                                <View style={[styles.badge, {backgroundColor: '#2C2C2E'}]}>
                                                    <Text style={styles.badgeText}>Completed</Text>
                                                </View>
                                            </View>

                                            <View style={styles.dateRow}>
                                                <Ionicons name="calendar-outline" size={16} color="#AAAAAA"/>
                                                <Text style={styles.dateText}>
                                                    {meso.startDate || 'N/A'} — {meso.endDate || 'N/A'}
                                                </Text>
                                            </View>

                                            <View style={styles.metaRow}>
                                                <Text style={styles.metaText}>
                                                    Weeks: <Text style={{
                                                    color: accentColor,
                                                    fontWeight: 'bold'
                                                }}>{meso.targetWeeks || 0}</Text>
                                                </Text>
                                                <Ionicons name="chevron-forward" size={18} color="#888888"/>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Ionicons name="time-outline" size={48} color="#555555"/>
                                        <Text style={styles.emptyText}>No past mesocycles found.</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    ) : (
                        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
                            <View style={styles.detailBox}>
                                <Text style={styles.detailLabel}>Date Range</Text>
                                <Text style={styles.detailValue}>
                                    {selectedMeso.startDate || 'N/A'} — {selectedMeso.endDate || 'N/A'}
                                </Text>
                            </View>

                            <View style={styles.detailBox}>
                                <Text style={styles.detailLabel}>Duration & Structure</Text>
                                <Text style={styles.detailValue}>
                                    {selectedMeso.targetWeeks || 0} Weeks Target
                                </Text>
                            </View>

                            {selectedMeso.mesocycleTemplates && selectedMeso.mesocycleTemplates.length > 0 && (
                                <View style={styles.detailBox}>
                                    <Text style={styles.detailLabel}>Assigned Templates</Text>
                                    {selectedMeso.mesocycleTemplates.map((temp, i) => (
                                        <View key={i} style={styles.templateItem}>
                                            <Ionicons name="fitness-outline" size={16} color={accentColor}/>
                                            <Text style={styles.templateText}>
                                                Week {temp.weekNumber} -
                                                Day {temp.dayNumber}: {temp.workoutTemplateClientId}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <View style={styles.viewOnlyBadge}>
                                <Ionicons name="lock-closed-outline" size={16} color="#888888"/>
                                <Text style={styles.viewOnlyText}>Past mesocycles are view-only</Text>
                            </View>
                        </ScrollView>
                    )}

                    {/* Bottom Action */}
                    <TouchableOpacity
                        style={[styles.closeBtn, {backgroundColor: '#2C2C2E'}]}
                        onPress={selectedMeso ? () => setSelectedMeso(null) : onClose}
                    >
                        <Text style={styles.closeBtnText}>
                            {selectedMeso ? "Back to History List" : "Close"}
                        </Text>
                    </TouchableOpacity>

                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    backButton: {
        marginRight: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
        paddingVertical: 0,
    },
    listContainer: {

    },
    scrollArea: {
        marginVertical: 8,
    },
    card: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333333',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 12,
        color: '#AAAAAA',
        fontWeight: '600',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 13,
        color: '#AAAAAA',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    metaText: {
        fontSize: 13,
        color: '#888888',
    },
    detailBox: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: '#888888',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    templateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    templateText: {
        fontSize: 14,
        color: '#DDDDDD',
    },
    viewOnlyBadge: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginVertical: 12,
    },
    viewOnlyText: {
        color: '#888888',
        fontSize: 13,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#888888',
        fontSize: 15,
        marginTop: 10,
    },
    closeBtn: {
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
});