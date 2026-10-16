import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";

interface GenericCardProps {
    header?: string;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    onPress?: () => void;
    onLongPress?: () => void;     // New: triggered when holding the card down
    selectable?: boolean;         // New: toggles whether selection mode is active
    selected?: boolean;           // New: tracks if this specific card is checked
    style?: ViewStyle;
}

export default function GenericCard({
                                        header,
                                        title,
                                        subtitle,
                                        children,
                                        onPress,
                                        onLongPress,
                                        selectable = false,
                                        selected = false,
                                        style
                                    }: GenericCardProps) {
    const { accentColor } = useAppSelector((state: any): any => state.theme);

    const Container = (onPress || onLongPress || selectable) ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            style={[
                styles.card,
                { borderLeftColor: accentColor },
                style
            ]}
        >
            <View style={styles.cardContent}>
                {/* Text and main body content */}
                <View style={styles.textContainer}>
                    {header ? <Text style={styles.header}>{header}</Text> : null}
                    <Text style={styles.title}>{title}</Text>
                    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                    {children ? <View style={styles.childrenContainer}>{children}</View> : null}
                </View>

                {/* Checkbox appears on the middle-right when selectable mode is active */}
                {selectable && (
                    <View style={styles.checkboxContainer}>
                        <Ionicons
                            name={selected ? "checkbox" : "square-outline"}
                            size={26}
                            color={selected ? accentColor : "#666"}
                        />
                    </View>
                )}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E1E1E',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 16,
        padding: 20,
        borderLeftWidth: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    header: {
        color: '#888888',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        color: '#AAAAAA',
        fontSize: 14,
    },
    childrenContainer: {
        marginTop: 12,
    },
    checkboxContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
    },
});