import { useState } from "react";

export interface ModalState {
    isOpen: boolean;
    [key: string]: any;
}

export type ModalsMap = Record<string, ModalState>;

export default function useModals() {
    const [modals, setModals] = useState<ModalsMap>({});

    const openModal = (modalKey: string, config: Record<string, any> = {}) => {
        setModals((prev) => ({
            ...prev,
            [modalKey]: { isOpen: true, ...config },
        }));
    };

    const closeModal = (modalKey: string) => {
        setModals((prev) => ({
            ...prev,
            [modalKey]: { ...prev[modalKey], isOpen: false },
        }));
    };

    return {
        modals,
        openModal,
        closeModal,
        modalControls: {
            openModal,
            closeModal,
        }
    };
}