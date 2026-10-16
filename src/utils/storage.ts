import { createMMKV } from 'react-native-mmkv';

export const StorageKeys = {
    AUTH_TOKEN: 'auth_token',
    USER_INFO: 'user_info',
    MESOCYCLES: 'mesocycles',
    WORKOUT_TEMPLATES: 'workout_templates',
    ACTIVE_WORKOUT_DRAFT: 'active_workout_draft',
    PENDING_WORKOUTS_QUEUE: 'pending_workouts_queue',
    LAST_SYNC_TIMESTAMP: 'last_sync_timestamp',
} as const;

export const storage = createMMKV();

export const LocalStorage = {
    set(key: string, value: string | number | boolean): void {
        storage.set(key, value);
    },

    getString(key: string): string | undefined {
        return storage.getString(key);
    },

    delete(key: string): void {
        storage.remove(key);
    },

    clearAll(): void {
        storage.clearAll();
    },
};