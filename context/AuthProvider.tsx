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
});

const AuthProvider = ({
    children
}: {children: React.ReactNode}) => {
    const pathName = usePathname();
    const [userDetails, setUserDetails] = useState<UserDetails>(defaultUserDetails);

    
    useEffect(() => {
        const userDetails = Cookies.get('userDetails');

        if (userDetails) {
            setUserDetails(JSON.parse(userDetails ?? ""));
        }
    }, [pathName]);

    return (
        <AuthContext.Provider value={{
            userDetails
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;