import { useState } from "react";

export const useFilter = (filter?:{}) => {
    const [filters, setFilters] = useState<any>(filter);
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