"use client";

import { getInitialLastPay } from "@/api/compensation/last-pay";
import Button from "@/components/common/Button";
import Grid from "@/components/common/Grid";
import LoadingState from "@/components/common/LoadingState";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";

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
            columnHead: "Balance",
            path: "balance",
            columnType: COLUMNTYPES.amount
        },
    ];

    return (
        api.loading
        ?
        <div className="w-full flex justify-center mt-3">
            <LoadingState/>
        </div>
        :
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
            <p className="mt-3">SSS/Pagibig Loans</p>
            <Table
                dataSet={api.data.government_deductions ?? []}
                columnSettings={deductionColumnSettings}
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
    );
}

export default LastPayDetails;