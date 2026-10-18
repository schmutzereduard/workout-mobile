import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {useAppSelector} from "@/store/store";

export default function TabLayout() {

    const { accentColor } = useAppSelector((state :any): any => state.theme);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: accentColor,
                tabBarInactiveTintColor: 'lightgray',
                tabBarStyle: {
                    backgroundColor: 'black',
                    borderTopColor: '#222',
                    height: 70,
                    paddingBottom: 10,
                }
            }}
        >
            <Tabs.Screen
                name="exercises"
                options={{
                    title: 'Exercises',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="templates"
                options={{
                    title: 'Workouts',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="barbell-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Mesocycles',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}