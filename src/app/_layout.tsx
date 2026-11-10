import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Provider, useDispatch} from 'react-redux';
import { store, useAppSelector,} from '@/store/store';
import { refreshToken } from '@/store/authSlice';
import { LocalStorage, StorageKeys} from "@/utils/Storage";
import { refreshTheme } from "@/store/syncSlice";

function InitialLayout() {

    const router = useRouter();
    const segments = useSegments();
    const dispatch = useDispatch();

    const { token } = useAppSelector((state: any): any => state.auth);

    useEffect(() => {
        const savedToken = LocalStorage.getString(StorageKeys.AUTH_TOKEN);
        if (savedToken && !token) {
            dispatch(refreshToken());
        }

        dispatch(refreshTheme());
    }, []);

    //TODO -> uncomment
    // useEffect(() => {
    //     const inAuthGroup = segments[0] === 'login';
    //
    //     if (!token && !inAuthGroup) {
    //         router.replace('/login');
    //     } else if (token && inAuthGroup) {
    //         router.replace('/(tabs)');
    //     }
    // }, [token, segments]);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });

    Notifications.setNotificationChannelAsync('default', {
        name: 'Default Channel',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
    });

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="workout" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <InitialLayout />
        </Provider>
    );
}