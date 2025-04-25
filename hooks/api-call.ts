import { useState } from "react";

export const useApiCall = () => {
    const [dataSet, setDataSet] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, setReload] = useState<boolean>(true);

    const triggerReload = () => {
        setReload(prev => !prev);
    }
    return {
        dataSet,
        setDataSet,
        loading,
        setLoading,
        reload,
        triggerReload
    };
};