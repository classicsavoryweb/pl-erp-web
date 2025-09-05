"use client";

import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useTransactionTypeStore } from "@/stores/useTransactionTypeStore";
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
}

const TransactionTypeDropdown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false
}: SelectInterface) => {

    const [transactionData, setTransactionData] = useState<any>([]);
    const {transactions, loading, getTransType} = useTransactionTypeStore();

    useAsyncEffect(() => {        
        getTransType();
        if (transactions.length > 0) {
            const newDataset = transactions.map((transaction: any) => ({
                label: transaction.description,
                value: transaction.id,
                obj: transaction,
            }));
            setTransactionData(newDataset);
        }
    }, [transactions]);

    return (
        <SearchableDropDown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            loading={loading}
            options={transactionData}
            required={required}
        />
    );
};

export default TransactionTypeDropdown;