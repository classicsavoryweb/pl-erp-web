"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useAccountStore } from "@/stores/useAccountStore";
import { useState } from "react";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
    disabled?: boolean;
}

const BranchAccountDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
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

export default BranchAccountDropDown;
