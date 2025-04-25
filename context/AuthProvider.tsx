"use client";
import { createContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

interface UserDetails {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    employee_number: string;
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
    employee_number: "",
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