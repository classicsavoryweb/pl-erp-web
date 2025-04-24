import { useState } from "react";

export const useApiCall = () => {
    const [dataSet, setDataSet] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    return {
        dataSet,
        setDataSet,
        loading,
        setLoading
    };
};