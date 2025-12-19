"use client";

import { getInitialLastPay, removeLastPayDeduction } from "@/api/compensation/last-pay";
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

interface LastPayInterface {
    employeeNumber: string;
    disabled?: boolean;
    formHandler: any;
};

const LastPayDetails = ({
    employeeNumber,
    disabled,
    formHandler
}: LastPayInterface) => {
    
    const api = useApiCall();
    const editModal = useModal();
    const [data, setData] = useState<any>({});

    useEffect(() => {
        api.setLoading(true);
        getInitialLastPay(employeeNumber)
        .then((resp) => {
            if (!resp.error) {
                api.setData(resp.data);
                formHandler.setValues({
                    incentives : resp.data.incentives,
                    meal_allowance : resp.data.meal_allowance,
                    payroll_hold : resp.data.payroll_hold,
                    sales : resp.data.sales,
                    sl_vl : resp.data.sl_vl,
                    tax_refund : resp.data.tax_refund,
                    thirteenth_month : resp.data.thirteenth_month,
                    total_deductions : resp.data.total_deductions,
                    last_pay : resp.data.last_pay,
                    year : resp.data.year,
                });
            } else {
                toast.error("Fetching initial last pay error");
            }
        }).catch(() => {
            toast.error("Error encountered");
        }).finally(() => {
            api.setLoading(false);
        });
    }, [employeeNumber]);

    const deductionColumnSettings = [
        {
            columnHead: "Type",
            path: "deduction.description",
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
                if (data.deduction?.description !== "SSS Loans") {
                    return "—";
                }

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
                        onClick: async () => {
                            const isConfirmed = await confirm({
                                message: "Are you sure you want to save changes",
                                title: "Deduction"
                            });

                            if (!isConfirmed) return;

                            try {
                                const resp = await removeLastPayDeduction(employeeNumber, {
                                    reference_doc: data.reference_doc
                                });

                                if (!resp.error) {
                                    toast.success(resp.data.message);
                                } else {
                                    toast.error(resp.data.message);
                                }
                            } catch {
                                toast.error("Error encountered");
                            }
                        }
                    }
                ];

                return <ActionDropDown 
                    data={data} 
                    actions={actions} 
                />;
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
                    <Textfield
                        label="Tax Refund"
                        type="number"
                        name="tax_refund"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.tax_refund}
                        error={formHandler.errors.tax_refund}
                        disabled={disabled}
                    />
                    <Textfield
                        label="Sales Incentives"
                        type="number"
                        name="sales"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.sales}
                        error={formHandler.errors.sales}
                        disabled={disabled}
                    />
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
                    <Textfield
                        label="Meal Allowance"
                        type="number"
                        name="meal_allowance"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.meal_allowance}
                        error={formHandler.errors.meal_allowance}
                        disabled={disabled}
                    />
                </Grid>

                <p className="mt-3">Company Deductions</p>
                <Table
                    dataSet={api.data.company_deductions ?? []}
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
                                const value = e.target.value;

                                if (e.target.checked) {
                                    formHandler.setFieldValue(value, "Yes");
                                } else {
                                    formHandler.setFieldValue(value, "No");
                                }
                            }}
                        />
                    </div>
                </div>
                <Table
                    dataSet={api.data.government_deductions ?? []}
                    columnSettings={[
                        {
                            columnHead: "Type",
                            path: "deduction.description",
                            columnType: COLUMNTYPES.string
                        },
                        {
                            columnHead: "Amount",
                            path: "amount",
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
                            onClick={() => {}}
                        />
                    </div>
                }
            </form>
            <EditLastPayDeductionDetails
                modal={editModal}
                formValue={data}
            />
        </>
    );
}

export default LastPayDetails;