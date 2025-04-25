import { useState } from "react";

export const useModal = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isShowing, setShowing] = useState<boolean>(false);

    const onOpen = () => {
        setShowing(true);
    };

    const onClose = () => {
        setShowing(false);
    };

    return {
        loading,
        setLoading,
        isShowing,
        setShowing,
        onClose,
        onOpen
    };
};