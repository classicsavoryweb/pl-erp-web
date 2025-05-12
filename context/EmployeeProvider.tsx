"use client";

import { createContext, useState } from "react";
import { useParams } from "next/navigation";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getEmployee } from "@/api/employee";
import { toast } from "react-toastify";

interface EmployeeContextType {
    employee: any;
    loading: boolean;
    triggerReload: () => void;
}

export const EmployeeContext = createContext<EmployeeContextType>({
    employee: {},
    loading: true,
    triggerReload: () => {}
});

const EmployeeProvider = ({
    children
}: {children: React.ReactNode}) => {
    const [employee, setEmployee] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, setReload] = useState<boolean>(true);
    const params = useParams();
    const employeeNumber = params["employee-number"];

    const triggerReload = () => {
        setReload(prev => !prev);
    };

    useAsyncEffect(() => {
        if (employeeNumber) {
            setLoading(true);
            getEmployee(String(employeeNumber))
            .then((resp) => {
                if (!resp.error) {
                    setEmployee(resp.data.employee);
                } else {
                    toast.error(resp.data.message); 
                }
    
            }).catch(() => {
                toast.error("Error fetching employee details");
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [employeeNumber, reload]);

    return (
        <EmployeeContext.Provider value={{
            employee,
            loading,
            triggerReload
        }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export default EmployeeProvider;