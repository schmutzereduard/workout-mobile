import { useState, useEffect } from 'react';
import { storage } from '@/utils/Storage';

export function useStorageListener<T>(
    storageKeys: string | string[],
    fetcher: () => T
): T {
    const [data, setData] = useState<T>(fetcher);

    useEffect(() => {
        const keysArray = Array.isArray(storageKeys) ? storageKeys : [storageKeys];

        const listener = storage.addOnValueChangedListener((changedKey: string) => {
            if (keysArray.includes(changedKey)) {
                setData(fetcher());
            }
        });

        return () => listener.remove();
    }, [storageKeys, fetcher]);

    return data;
}