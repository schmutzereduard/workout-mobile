import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import {Provider, useDispatch} from 'react-redux';
import {store, useAppSelector,} from '@/store/store';
import { storage } from '@/utils/storage';
import { refreshToken } from '@/store/authSlice';

function InitialLayout() {

    const router = useRouter();
    const segments = useSegments();
    const dispatch = useDispatch();

    const { token } = useAppSelector((state: any): any => state.auth);

    useEffect(() => {
        const savedToken = storage.getString('auth_token');
        if (savedToken && !token) {
            dispatch(refreshToken());
        }
    }, []);

    useEffect(() => {
        const inAuthGroup = segments[0] === 'login';

        if (!token && !inAuthGroup) {
            router.replace('/login');
        } else if (token && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [token, segments]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
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