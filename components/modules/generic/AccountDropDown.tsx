"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAccountStore } from "@/stores/useAccountStore";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useState } from "react";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
    status?: "active" | "inactive";
    disabled?: boolean;
}

const AccountDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false
}: SelectInterface) => {

    const [accountData, setAccountData] = useState<any>([]);
    const {accounts, loading, getAccount} = useAccountStore();

    useAsyncEffect(() => {        
        getAccount();
        if (accounts.length > 0) {
            const newDataset = accounts.map((account: any) => ({
                label: account.acc_name,
                value: account.acc_no,
                obj: account,
            }));
            setAccountData(newDataset);
        }
    }, [accounts]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={accountData}
            required={required}
            disabled={disabled}
        />
    );
};

export default AccountDropDown;
