"use client";
import { createContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

interface UserDetails {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    employee_number: string;
    role_name: string;
    date_hired: string;
    separation_date: string;
    current_position: any;
    employee_status: any;
    employment_status: string;
    status: string;
}

interface AuthContextType {
    userDetails: UserDetails;
    permissions: any[];
}

const defaultUserDetails: UserDetails = {
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    employee_number: "",
    role_name: "",
    date_hired: "",
    separation_date: "",
    current_position: {},
    employee_status: {},
    employment_status: "",
    status: "",
};

export const AuthContext = createContext<AuthContextType>({
    userDetails: defaultUserDetails,
    permissions: []
});

const AuthProvider = ({
    children
}: {children: React.ReactNode}) => {
    const pathName = usePathname();
    const [userDetails, setUserDetails] = useState<UserDetails>(defaultUserDetails);
    const [permissions, setPermissions] = useState<any>([]);
    
    useEffect(() => {
        const userDetails = Cookies.get('userDetails');
        const permissions = Cookies.get('permissions');

        if (userDetails) {
            setUserDetails(JSON.parse(userDetails ?? ""));
            setPermissions(JSON.parse(permissions ?? ""));
        }
    }, [pathName]);

    return (
        <AuthContext.Provider value={{
            userDetails,
            permissions
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;