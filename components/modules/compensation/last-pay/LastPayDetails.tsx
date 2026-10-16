"use client";

import { getInitialLastPay, getLastPay, reloadLastPayDeductions, removeLastPayDeduction } from "@/api/compensation/last-pay";
import Button from "@/components/common/Button";
import Grid from "@/components/common/Grid";
import LoadingState from "@/components/common/LoadingState";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import confirm from "@/components/common/Confirm";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import EditLastPayDeductionDetails from "./EditLastPayDeductionDetails";
import ActionDropDown from "@/components/common/ActionDropDown";
import Checkbox from "@/components/common/Checkbox";
import { useAsyncEffect } from "@/hooks/async-effect";
import CSHubTransactionTypeDropDown from "../../generic/CSHubTransactionTypeDropDown";

interface LastPayInterface {
    lastPayId?: string;
    employeeNumber: string;
    disabled?: boolean;
    formHandler: any;
    isOpen?: boolean;
    isEdit?: boolean;
};

const LastPayDetails = ({
    lastPayId,
    employeeNumber,
    disabled,
    formHandler,
    isOpen = false,
    isEdit = false
}: LastPayInterface) => {
    
    const api = useApiCall();
    const editModal = useModal();
    const [data, setData] = useState<any>({});

    useAsyncEffect(() => {
        if (isOpen) {
            if (!isEdit) {
                getInitialLastPay(employeeNumber)
                .then((resp) => {
                    if (!resp.error) {
                        formHandler.setValues(resp.data);
                    } else {
                        toast.error("Fetching initial last pay error");
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    api.setLoading(false);
                });
            } else {
                getLastPay(employeeNumber)
                .then((resp) => {
                    if (!resp.error) {
                        formHandler.setValues(resp.data);
                    } else {
                        toast.error("Fetching last pay error");
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    api.setLoading(false);
                });
            }
        }
    }, [isOpen, employeeNumber]);

    const deductionColumnSettings = [
        {
            columnHead: "Type",
            path: "deduction_type",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Action",
            path: "action",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.category !== "SSS") {
                    return "—";
                }

                if (data.category === "SSS") {
                    const actions = [
                        {
                            label: "Edit Amount",
                            onClick: () => {
                                editModal.onOpen();
                                setData(data);
                            }
                        },
                        {
                            label: "Remove",
                            onClick: () => {
                                formHandler.setFieldValue("company_deductions", [
                                    ...formHandler.values.company_deductions.filter((item: any) => item.employee_deduction_id !== data.employee_deduction_id)
                                ]);

                                formHandler.setFieldValue("save_changes", false);
                                formHandler.submitForm();
                            }
                        }
                    ];

                    return <ActionDropDown
                        data={data}
                        actions={actions}
                    />;
                }
            }
        }
    ];

    return (
        api.loading
        ?
        <div className="w-full flex justify-center mt-3">
            <LoadingState/>
        </div>
        :
        <>
            <form onSubmit={formHandler.handleSubmit}>  
                <p className="mt-3">Last Pay Details</p>
                <Grid cols={2}>
                    <Textfield
                        label="Year"
                        type="number"
                        name="year"
                        value={formHandler.values.year}
                        disabled
                    />
                    {disabled ? (
                        <Textfield
                            label="Payroll"
                            name="payroll_hold"
                            value={ Number(formHandler.values.payroll_hold)
                                .toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })
                            }
                            disabled
                        />
                    ) : (
                        <Textfield
                            label="Payroll"
                            type="number"
                            name="payroll_hold"
                            onChange={formHandler.handleChange}
                            value={formHandler.values.payroll_hold}
                            error={formHandler.errors?.payroll_hold}
                            disabled={disabled}
                        />
                    )}
                    {disabled ? (
                        <Textfield
                            label="13th Month"
                            value={ Number(formHandler.values.thirteenth_month)
                                .toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })
                            }
                            disabled
                        />
                    ) : (
                        <Textfield
                            label="13th Month"
                            type="number"
                            name="thirteenth_month"
                            onChange={formHandler.handleChange}
                            value={formHandler.values.thirteenth_month}
                            error={formHandler.errors?.thirteenth_month}
                            disabled={disabled}
                        />
                    )}
                    <Textfield
                        label="Tax Refund"
                        type="number"
                        name="tax_refund"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.tax_refund}
                        error={formHandler.errors.tax_refund}
                        disabled={disabled}
                    />
                    {/* <Textfield
                        label="Sales Incentives"
                        type="number"
                        name="sales"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.sales}
                        error={formHandler.errors.sales}
                        disabled={disabled}
                    /> */}
                    <Textfield
                        label="Incentives"
                        type="number"
                        name="incentives"
                        onChange={formHandler.handleChange}
                        disabled={disabled}
                        value={formHandler.values.incentives}
                        error={formHandler.errors.incentives}
                    />
                    <Textfield
                        label="SL/VL"
                        type="number"
                        name="sl_vl"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.sl_vl}
                        error={formHandler.errors.sl_vl}
                        disabled={disabled}
                    />
                    {/* <Textfield
                        label="Meal Allowance"
                        type="number"
                        name="meal_allowance"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.meal_allowance}
                        error={formHandler.errors.meal_allowance}
                        disabled={disabled}
                    /> */}
                </Grid>

                <div className="mt-3 flex items-center justify-between">
                    <p>Additional Fields</p>
                    <p
                        className="hover:text-blue-950 dark:text-red-500 hover:cursor-pointer"
                        onClick={() => {
                            const additionalFields = formHandler.values.additional_fields ?? [];
                            
                            additionalFields.push({
                                transaction_type_id: 0,
                                amount: 0
                            });

                            formHandler.setFieldValue("additional_fields", additionalFields);
                        }}
                    >
                        Add Field
                    </p>
                </div>

                { formHandler.values.additional_fields &&
                    formHandler.values.additional_fields.map((additional_field: any, idx: number) => {
                        return (
                            <div className="mt-2" key={idx}>
                                <div className="flex justify-end mb-[-10px]">
                                    <p
                                        className="hover:text-blue-950 dark:text-red-500 hover:cursor-pointer"
                                        onClick={() => {
                                            const additionalFields = [...formHandler.values.additional_fields];
                                            additionalFields.splice(idx, 1);
                                            formHandler.setFieldValue("additional_fields", additionalFields);
                                        }}
                                    >
                                        Remove
                                    </p>
                                </div>
                                <Grid
                                    cols={2}
                                >
                                    <CSHubTransactionTypeDropDown
                                        label="Transaction Type"
                                        value={Number(additional_field.transaction_type_id)}
                                        name={`transaction[${idx}]`}
                                        placeholder="select transaction"
                                        onChange={(e) => {
                                            const updatedField = [...formHandler.values.additional_fields];
                                            updatedField[idx].transaction_type_id = e.target.value;
                                            formHandler.setFieldValue("additional_fields", updatedField);
                                        }}                                    
                                    />
                                    <Textfield
                                        type="number"
                                        label="Amount"
                                        name={`amount[${idx}]`}
                                        value={additional_field.amount}
                                        onChange={(e) => {
                                            const updatedField = [...formHandler.values.additional_fields];
                                            updatedField[idx].amount = e.target.value;
                                            formHandler.setFieldValue("additional_fields", updatedField);
                                        }}  
                                    />
                                </Grid>
                            </div>
                        )
                    })
                }

                <div className="mt-3 flex items-center justify-between gap-3">
                    <p>Company Deductions</p>
                    {!disabled && lastPayId &&
                        <div className="w-[170px]">
                            <Button
                                type="button"
                                label="Reload Deductions"
                                variant="secondary"
                                onClick={() => {
                                    formHandler.setFieldValue("reload_deductions", true);
                                    formHandler.setFieldValue("save_changes", false);
                                    formHandler.handleSubmit();
                                }}
                            />
                        </div>
                    }
                </div>
                <Table
                    dataSet={formHandler.values.company_deductions}
                    columnSettings={deductionColumnSettings}
                    smallText
                />
                <Textfield
                    label="Total Deductions"
                    onChange={() => {}}
                    value={ Number(formHandler.values.total_deductions)
                        .toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })
                    }
                    disabled
                />
                <div className="flex justify-between mt-3">
                    <p>SSS/Pagibig Loans</p>
                    <div>
                        <Checkbox
                            label="Deduct SSS Loans"
                            checked={formHandler.values.sss_loans === "Yes"}
                            value="sss_loans"
                            onChange={(e) => {
                                if (e.target.checked) {
                                    formHandler.setFieldValue("company_deductions",[
                                        ...formHandler.values.company_deductions,
                                        ...formHandler.values.government_deductions.filter((item: any) => item.category === "SSS")
                                    ]);
                                    formHandler.setFieldValue("sss_loans", "Yes");
                                } else {
                                    formHandler.setFieldValue("company_deductions",[
                                        ...formHandler.values.company_deductions.filter((item: any) => item.category !== "SSS")
                                    ]);
                                    formHandler.setFieldValue("sss_loans", "No ");
                                }

                                formHandler.setFieldValue("save_changes", false);
                                formHandler.submitForm();
                            }}
                        />
                    </div>
                </div>
                <Table
                    dataSet={formHandler.values.government_deductions}
                    columnSettings={[
                        {
                            columnHead: "Type",
                            path: "deduction_type",
                            columnType: COLUMNTYPES.string
                        },
                        {
                            columnHead: "Balance",
                            path: "balance",
                            columnType: COLUMNTYPES.amount
                        },
                    ]}
                    smallText
                />

                <Textfield
                    label="Last Pay"
                    onChange={() => {}}
                    value={ Number(formHandler.values.last_pay)
                        .toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })
                    }
                    disabled
                />
                { !disabled &&
                    <div className="mt-3">
                        <Button
                            type="submit"
                            label="Submit"
                            loading={formHandler.isSubmitting}
                            onClick={() => {
                                formHandler.setFieldValue("save_changes", true);
                            }}
                        />
                    </div>
                }
            </form>
            <EditLastPayDeductionDetails
                modal={editModal}
                formValue={data}
                onUpdated={(updatedDeduction: any) => {
                    formHandler.setFieldValue("company_deductions", [
                        ...formHandler.values.company_deductions.map((item:any) => {
                            if (item.employee_deduction_id == updatedDeduction.employee_deduction_id) {
                                return {
                                    ...item,
                                    amount: updatedDeduction.amount
                                }
                            } else {
                                return item;
                            }
                        })
                    ]);
                    formHandler.setFieldValue("save_changes", false);
                    formHandler.submitForm();
                    
                }}
            />
        </>
    );
}

export default LastPayDetails;
