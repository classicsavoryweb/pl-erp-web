import { useState } from "react";

export const useFilter = () => {
    const [filters, setFilters] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);

    const onReload = () => {
        setReload(prev => !prev);
    }
    
    return {
        filters,
        setFilters,
        reload,
        onReload
    };
};