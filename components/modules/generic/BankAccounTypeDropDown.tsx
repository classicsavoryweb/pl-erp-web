"use cient";

import Dropdown from "@/components/common/Dropdown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useBankAccountStore } from "@/stores/useBankAccountStore";
import { useState } from "react";
interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    withCashOption?: boolean;
    withAllOption?: boolean; 
}

const BankAccountTypeDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false,
    disabled = false,
    withCashOption = false,
    withAllOption = false,
}: SelectInterface) => {

    const [bankAccountTypes, setBankAccountTypeData] = useState<any>([]);
    const {account_types, loading, getBankAccountType} = useBankAccountStore();

    useAsyncEffect(() => {        
        getBankAccountType();
        if (account_types.length > 0) {
            const newDataset = account_types.map((account: any) => ({
                label: account.description,
                value: account.id,
                obj: account,
            }));
            setBankAccountTypeData(newDataset);
        }
    }, [account_types]);

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
             options={
            [
                ...bankAccountTypes,
                ...(withCashOption ? [{ label: "Cash or Check", value: 0 }] : []),
                ...(withAllOption ? [{ label: "All", value: "ALL" }] : [])
            ]
                } 
            required={required}
            disabled={disabled}
        />
    );
};

export default BankAccountTypeDropDown;