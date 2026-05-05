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
    isOpen?: boolean;
};

const LastPayDetails = ({
    employeeNumber,
    disabled,
    formHandler,
    isOpen
}: LastPayInterface) => {
    
    const api = useApiCall();
    const editModal = useModal();
    const [data, setData] = useState<any>({});

    const getDeductionValue = (deduction: any) => {
        if (deduction?.deduction?.description === "SSS Loans") {
            const override = (formHandler.values.sss_loans_details ?? []).find(
                (item: any) => item?.reference_doc === deduction?.reference_doc
            );
            if (override && override?.amount !== undefined && override?.amount !== null) {
                return Number(override.amount);
            }
            return Number(deduction?.balance ?? deduction?.amount ?? 0);
        }

        const amount = deduction?.balance ?? deduction?.amount ?? 0;
        return Number(amount);
    };

    const buildSssDetails = (deductions: any[]) => {
        return deductions.map((deduction: any) => ({
            reference_doc: deduction?.reference_doc,
            amount: Number(deduction?.balance ?? deduction?.amount ?? 0)
        }));
    };

    const computeTotals = () => {
        const baseCompanyDeductions = (api.data.company_deductions ?? []).filter(
            (deduction: any) => deduction?.deduction?.description !== "SSS Loans"
        );
        const existingSssDeductions = (api.data.company_deductions ?? []).filter(
            (deduction: any) => deduction?.deduction?.description === "SSS Loans"
        );
        const governmentSssDeductions = (api.data.government_deductions ?? []).filter(
            (deduction: any) => deduction?.deduction?.description === "SSS Loans"
        );

        const includeSssLoans = formHandler.values.sss_loans === "Yes";
        const sssDeductionsForPreview = includeSssLoans
            ? (existingSssDeductions.length ? existingSssDeductions : governmentSssDeductions)
            : [];

        const companyTotal = baseCompanyDeductions.reduce((sum: number, deduction: any) => {
            return sum + getDeductionValue(deduction);
        }, 0);

        const sssTotal = sssDeductionsForPreview.reduce((sum: number, deduction: any) => {
            return sum + getDeductionValue(deduction);
        }, 0);

        const totalDeductions = companyTotal + sssTotal;

        const lastPay = (
            Number(formHandler.values.payroll_hold ?? 0) +
            Number(formHandler.values.thirteenth_month ?? 0) +
            Number(formHandler.values.incentives ?? 0) +
            Number(formHandler.values.sl_vl ?? 0) +
            Number(formHandler.values.meal_allowance ?? 0) +
            Number(formHandler.values.tax_refund ?? 0) +
            Number(formHandler.values.sales ?? 0)
        ) - totalDeductions;

        return {
            totalDeductions,
            lastPay
        };
    };

    useEffect(() => {
        if (isOpen === false) return;

        api.setLoading(true);
        getInitialLastPay(employeeNumber)
        .then((resp) => {
            if (!resp.error) {
                api.setData(resp.data);
                const initialCompanyDeductions = resp.data.company_deductions ?? [];
                const initialGovDeductions = resp.data.government_deductions ?? [];
                const initialSssCompany = initialCompanyDeductions.filter(
                    (deduction: any) => deduction?.deduction?.description === "SSS Loans"
                );
                const initialSssGov = initialGovDeductions.filter(
                    (deduction: any) => deduction?.deduction?.description === "SSS Loans"
                );
                const sssDetailsSource = initialSssCompany.length ? initialSssCompany : initialSssGov;

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
                    sss_loans: resp.data.sss_loans ?? "No",
                    sss_loans_details: buildSssDetails(sssDetailsSource),
                });
            } else {
                toast.error("Fetching initial last pay error");
            }
        }).catch(() => {
            toast.error("Error encountered");
        }).finally(() => {
            api.setLoading(false);
        });
    }, [employeeNumber, isOpen]);

    useEffect(() => {
        if (api.loading) return;

        const totals = computeTotals();

        if (Number(formHandler.values.total_deductions) !== totals.totalDeductions) {
            formHandler.setFieldValue("total_deductions", totals.totalDeductions);
        }

        if (Number(formHandler.values.last_pay) !== totals.lastPay) {
            formHandler.setFieldValue("last_pay", totals.lastPay);
        }
    }, [
        api.loading,
        api.data,
        formHandler.values.sss_loans,
        formHandler.values.sss_loans_details,
        formHandler.values.incentives,
        formHandler.values.meal_allowance,
        formHandler.values.payroll_hold,
        formHandler.values.sales,
        formHandler.values.sl_vl,
        formHandler.values.tax_refund,
        formHandler.values.thirteenth_month,
    ]);

    const deductionColumnSettings = [
        {
            columnHead: "Type",
            path: "deduction.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Balance",
            path: "balance",
            columnType: COLUMNTYPES.amount
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

                if (data.__source === "preview") {
                    const actions = [
                        {
                            label: "Edit Balance",
                            onClick: () => {
                                editModal.onOpen();
                                setData(data);
                            }
                        },
                        {
                            label: "Remove",
                            onClick: () => {
                                formHandler.setFieldValue("sss_loans", "No");
                                formHandler.setFieldValue("sss_loans_details", []);
                            }
                        }
                    ];

                    return <ActionDropDown
                        data={data}
                        actions={actions}
                    />;
                }

                const actions = [
                    {
                        label: "Edit Balance",
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
                                    const updatedCompanyDeductions = (api.data.company_deductions ?? [])
                                        .filter((deduction: any) => deduction?.reference_doc !== data.reference_doc);

                                    api.setData({
                                        ...api.data,
                                        company_deductions: updatedCompanyDeductions
                                    });

                                    formHandler.setFieldValue("sss_loans_details", []);

                                    const remainingSss = updatedCompanyDeductions.filter(
                                        (deduction: any) => deduction?.deduction?.description === "SSS Loans"
                                    );

                                    if (remainingSss.length === 0 && formHandler.values.sss_loans === "Yes") {
                                        formHandler.setFieldValue("sss_loans", "No");
                                    }
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

    const includeSssLoans = formHandler.values.sss_loans === "Yes";
    const baseCompanyDeductions = (api.data.company_deductions ?? []).filter(
        (deduction: any) => deduction?.deduction?.description !== "SSS Loans"
    );
    const existingSssDeductions = (api.data.company_deductions ?? []).filter(
        (deduction: any) => deduction?.deduction?.description === "SSS Loans"
    );
    const governmentSssDeductions = (api.data.government_deductions ?? []).filter(
        (deduction: any) => deduction?.deduction?.description === "SSS Loans"
    );
    const sssDeductionsSource = existingSssDeductions.length
        ? existingSssDeductions
        : governmentSssDeductions;
    const sssDeductionsForDisplay = includeSssLoans ? sssDeductionsSource : [];
    const govBalanceMap = new Map(
        (api.data.government_deductions ?? [])
            .filter((deduction: any) => deduction?.deduction?.description === "SSS Loans")
            .map((deduction: any) => [
                deduction?.reference_doc,
                Number(deduction?.balance ?? 0)
            ])
    );
    const govAmountMap = new Map(
        (api.data.government_deductions ?? [])
            .filter((deduction: any) => deduction?.deduction?.description === "SSS Loans")
            .map((deduction: any) => [
                deduction?.reference_doc,
                Number(deduction?.amount ?? 0)
            ])
    );
    const sssOverrideMap = new Map(
        (formHandler.values.sss_loans_details ?? []).map((item: any) => [
            item?.reference_doc,
            Number(item?.amount ?? 0)
        ])
    );

    const normalizeDisplay = (deduction: any) => {
        if (deduction?.deduction?.description === "SSS Loans") {
            const overrideAmount = sssOverrideMap.get(deduction?.reference_doc);
            const amountValue = govAmountMap.get(deduction?.reference_doc)
                ?? deduction?.original_amount
                ?? deduction?.amount
                ?? 0;
            const balanceValue = overrideAmount
                ?? deduction?.balance
                ?? govBalanceMap.get(deduction?.reference_doc)
                ?? null;
            return {
                ...deduction,
                balance: balanceValue,
                amount: amountValue
            };
        }

        const nonSssBalance = deduction?.balance ?? deduction?.amount;
        if (nonSssBalance !== undefined && nonSssBalance !== null) {
            return {
                ...deduction,
                balance: nonSssBalance,
                amount: nonSssBalance
            };
        }

        return deduction;
    };

    const companyDeductionsForDisplay = includeSssLoans
        ? [
            ...baseCompanyDeductions.map((deduction: any) => normalizeDisplay({ ...deduction, __source: "company" })),
            ...sssDeductionsForDisplay.map((deduction: any) => normalizeDisplay({
                ...deduction,
                __source: existingSssDeductions.length ? "company" : "preview"
            }))
        ]
        : baseCompanyDeductions.map((deduction: any) => normalizeDisplay({ ...deduction, __source: "company" }));
    const governmentDeductionsForDisplay = (api.data.government_deductions ?? []).map((deduction: any) =>
        normalizeDisplay({ ...deduction, __source: "government" })
    );




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
                    dataSet={companyDeductionsForDisplay}
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
                                    formHandler.setFieldValue(
                                        "sss_loans_details",
                                        buildSssDetails(
                                            (api.data.government_deductions ?? []).filter(
                                                (deduction: any) => deduction?.deduction?.description === "SSS Loans"
                                            )
                                        )
                                    );
                                } else {
                                    formHandler.setFieldValue(value, "No");
                                    formHandler.setFieldValue("sss_loans_details", []);
                                }
                            }}
                        />
                    </div>
                </div>
                <Table
                    dataSet={governmentDeductionsForDisplay}
                    columnSettings={[
                        {
                            columnHead: "Type",
                            path: "deduction.description",
                            columnType: COLUMNTYPES.string
                        },
                        {
                            columnHead: "Balance",
                            path: "balance",
                            columnType: COLUMNTYPES.amount
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
                onUpdated={(updatedDeduction: any) => {
                    const isSssLoan = updatedDeduction?.deduction?.description === "SSS Loans";
                    if (updatedDeduction?.__source === "preview") {
                        const currentDetails = formHandler.values.sss_loans_details ?? [];
                        const nextDetails = [
                            ...currentDetails.filter(
                                (item: any) => item?.reference_doc !== updatedDeduction?.reference_doc
                            ),
                            {
                                reference_doc: updatedDeduction?.reference_doc,
                                amount: Number(updatedDeduction?.amount ?? 0)
                            }
                        ];
                        formHandler.setFieldValue("sss_loans_details", nextDetails);
                        return;
                    }

                    if (isSssLoan) {
                        const currentDetails = formHandler.values.sss_loans_details ?? [];
                        const nextDetails = [
                            ...currentDetails.filter(
                                (item: any) => item?.reference_doc !== updatedDeduction?.reference_doc
                            ),
                            {
                                reference_doc: updatedDeduction?.reference_doc,
                                amount: Number(updatedDeduction?.amount ?? 0)
                            }
                        ];
                        formHandler.setFieldValue("sss_loans_details", nextDetails);
                    }

                    const updatedCompanyDeductions = (api.data.company_deductions ?? []).map((deduction: any) => {
                        if (deduction?.id === updatedDeduction?.id) {
                            if (deduction?.deduction?.description === "SSS Loans") {
                                return {
                                    ...deduction,
                                    balance: updatedDeduction.amount
                                };
                            }

                            return {
                                ...deduction,
                                amount: updatedDeduction.amount
                            };
                        }

                        return deduction;
                    });

                    const updatedGovernmentDeductions = isSssLoan
                        ? (api.data.government_deductions ?? []).map((deduction: any) => {
                            if (deduction?.reference_doc === updatedDeduction?.reference_doc) {
                                return {
                                    ...deduction,
                                    balance: updatedDeduction.amount
                                };
                            }

                            return deduction;
                        })
                        : (api.data.government_deductions ?? []);

                    api.setData({
                        ...api.data,
                        company_deductions: updatedCompanyDeductions,
                        government_deductions: updatedGovernmentDeductions
                    });
                }}
            />
        </>
    );
}

export default LastPayDetails;
