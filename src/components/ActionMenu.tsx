import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ActionMenuItem {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    color?: string;
    onPress: () => void;
}

export interface AnchorRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ActionMenuProps {
    visible: boolean;
    onClose: () => void;
    anchorRect: AnchorRect | null;
    items: ActionMenuItem[];
}

const MENU_WIDTH = 180;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ActionMenu({
                                       visible,
                                       onClose,
                                       anchorRect,
                                       items,
                                   }: ActionMenuProps) {
    if (!visible || !anchorRect) return null;

    let left = anchorRect.x;//
    if (left + MENU_WIDTH > SCREEN_WIDTH - 16) {
        left = Math.max(16, anchorRect.x + anchorRect.width - MENU_WIDTH);
    }

    const estimatedMenuHeight = items.length * 44 + 8;
    let top = anchorRect.y + anchorRect.height + 6;

    if (top + estimatedMenuHeight > SCREEN_HEIGHT - 20) {
        top = Math.max(20, anchorRect.y - estimatedMenuHeight - 6);
    }

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={[styles.menuBox, { top, left }]}>
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuItem,
                                index < items.length - 1 && styles.menuItemBorder,
                            ]}
                            onPress={() => {
                                onClose();
                                item.onPress();
                            }}
                        >
                            {item.icon && (
                                <Ionicons
                                    name={item.icon}
                                    size={18}
                                    color={item.color || '#FFF'}
                                    style={styles.menuIcon}
                                />
                            )}
                            <Text style={[styles.menuLabel, { color: item.color || '#FFF' }]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)', // Subtle backdrop so user can tap outside
    },
    menuBox: {
        position: 'absolute',
        width: MENU_WIDTH,
        backgroundColor: '#2B2B2B',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#444',
        paddingVertical: 4,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#383838',
    },
    menuIcon: {
        marginRight: 10,
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
});