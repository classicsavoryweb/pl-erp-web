"use client";

import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Grid from "@/components/common/Grid";
import Button from "@/components/common/Button";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getInitialLastPay } from "@/api/compensation/last-pay";
import { getEmployee } from "@/api/employee";
import { toast } from "react-toastify";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useModal } from "@/hooks/modal";
import LastPayComputationModal from "./LastPayComputationModal";

interface LastPayComputationEditModalProps {
    modal: any;
    data: any;
}

type CustomLineItem = {
    id: string;
    label: string;
    amount: number;
};

type DeductionSummary = {
    shortages: number;
    variance: number;
    breakages: number;
    others: number;
    uniform: number;
    hi_precision: number;
    cash_advance: number;
    corporate_loans: number;
    sss_loans: number;
};

const emptyDeductionSummary: DeductionSummary = {
    shortages: 0,
    variance: 0,
    breakages: 0,
    others: 0,
    uniform: 0,
    hi_precision: 0,
    cash_advance: 0,
    corporate_loans: 0,
    sss_loans: 0,
};

const toNumber = (value: any) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
};

const formatAmount = (value: number) => {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const computeDeductionSummary = (deductions: any[]): DeductionSummary => {
    const totals: DeductionSummary = { ...emptyDeductionSummary };

    (deductions ?? []).forEach((deduction) => {
        const description = (deduction?.deduction?.description ?? deduction?.description ?? "").toLowerCase();
        const amount = toNumber(deduction?.amount ?? deduction?.balance ?? 0);

        if (description.includes("shortage")) {
            totals.shortages += amount;
            return;
        }
        if (description.includes("variance")) {
            totals.variance += amount;
            return;
        }
        if (description.includes("breakage")) {
            totals.breakages += amount;
            return;
        }
        if (description.includes("uniform")) {
            totals.uniform += amount;
            return;
        }
        if (description.includes("hi-precision") || description.includes("hi precision") || description.includes("hiprecision")) {
            totals.hi_precision += amount;
            return;
        }
        if (description.includes("cash advance")) {
            totals.cash_advance += amount;
            return;
        }
        if (description.includes("corporate loan")) {
            totals.corporate_loans += amount;
            return;
        }
        if (description.includes("sss loan")) {
            totals.sss_loans += amount;
            return;
        }

        totals.others += amount;
    });

    return totals;
};

const LastPayComputationEditModal = ({
    modal,
    data
}: LastPayComputationEditModalProps) => {
    const api = useApiCall();
    const previewModal = useModal();
    const [details, setDetails] = useState<any>({});
    const [preparedByEmployee, setPreparedByEmployee] = useState<any>(null);
    const [detailsLoaded, setDetailsLoaded] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);
    const [deductionSummary, setDeductionSummary] = useState<DeductionSummary>(emptyDeductionSummary);
    const [customAmounts, setCustomAmounts] = useState<CustomLineItem[]>([]);
    const [customDeductions, setCustomDeductions] = useState<CustomLineItem[]>([]);
    const [draft, setDraft] = useState({
        payroll_hold: 0,
        thirteenth_month: 0,
        tax_refund: 0,
        incentives: 0,
        sl_vl: 0,
        meal_allowance: 0,
        sales: 0,
        prepared_by: "",
        prepared_by_title: "",
        noted_by: "",
        noted_by_title: "",
        employee_name: "",
        basic_salary: 0,
        daily_rate: 0,
        cola: 0,
    });
    const [initializedKey, setInitializedKey] = useState<string | null>(null);
    const { userDetails } = useContext(AuthContext);

    useAsyncEffect(() => {
        if (!modal.isShowing) return;
        const employeeNumber = data?.employee?.employee_number;
        const preparerEmployeeNumber = userDetails?.employee_number;
        if (!employeeNumber) return;

        setDetailsLoaded(false);
        setDetails({});
        setPreparedByEmployee(null);
        api.setLoading(true);

        Promise.all([
            getInitialLastPay(employeeNumber),
            getEmployee(employeeNumber),
            preparerEmployeeNumber && preparerEmployeeNumber !== employeeNumber
                ? getEmployee(preparerEmployeeNumber)
                : Promise.resolve(null),
        ])
            .then(([lastPayResp, employeeResp, preparerResp]) => {
                if (!lastPayResp.error) {
                    const employeeData = !employeeResp.error ? employeeResp.data?.employee : undefined;
                    setDetails({
                        ...lastPayResp.data,
                        employee: employeeData ?? lastPayResp.data?.employee,
                    });

                    if (preparerEmployeeNumber === employeeNumber) {
                        setPreparedByEmployee(employeeData ?? null);
                    }
                } else {
                    toast.error(lastPayResp.data?.message ?? "Error fetching last pay details");
                }

                if (employeeResp.error) {
                    toast.error(employeeResp.data?.message ?? "Error fetching employee details");
                }

                if (preparerResp && !preparerResp.error) {
                    setPreparedByEmployee(preparerResp.data?.employee ?? null);
                }
            })
            .catch(() => {
                toast.error("Error encountered");
            })
            .finally(() => {
                api.setLoading(false);
                setDetailsLoaded(true);
            });
    }, [modal.isShowing, data?.employee?.employee_number, userDetails?.employee_number]);

    const preparedBy = useMemo(() => {
        if (userDetails?.proper_full_name) return userDetails.proper_full_name;
        if (userDetails?.full_name) return userDetails.full_name;
        const parts = [userDetails?.first_name, userDetails?.middle_name, userDetails?.last_name].filter(Boolean);
        return parts.join(" ");
    }, [userDetails]);

    const preparedByTitle = useMemo(() => {
        return (
            userDetails?.position
            ?? preparedByEmployee?.current_position?.description
            ?? userDetails?.current_position?.description
            ?? ""
        );
    }, [preparedByEmployee, userDetails]);

    const baseData = useMemo(() => {
        if (!details && !data) return null;

        return {
            ...details,
            ...data,
            payrolls: details?.payrolls ?? data?.payrolls ?? [],
            payroll_hold: data?.payroll_hold ?? details?.payroll_hold,
            thirteenth_month: data?.thirteenth_month ?? details?.thirteenth_month,
            incentives: data?.incentives ?? details?.incentives,
            sl_vl: data?.sl_vl ?? details?.sl_vl,
            meal_allowance: data?.meal_allowance ?? details?.meal_allowance ?? data?.meal,
            tax_refund: data?.tax_refund ?? details?.tax_refund,
            sales: data?.sales ?? details?.sales,
            total_deductions: data?.total_deductions ?? details?.total_deductions,
            last_pay: data?.last_pay ?? details?.last_pay,
            employee: details?.employee ?? data?.employee,
            prepared_by: preparedBy || data?.prepared_by || details?.prepared_by,
            prepared_by_title: preparedByTitle || data?.prepared_by_title || details?.prepared_by_title,
        };
    }, [details, data, preparedBy, preparedByTitle]);

    useEffect(() => {
        if (!modal.isShowing || !baseData || !detailsLoaded) return;

        const key = String(data?.id ?? data?.last_pay_number ?? data?.employee?.employee_number ?? "last-pay");
        if (initializedKey === key) return;

        setInitializedKey(key);

        const baseEmployee = baseData?.employee ?? {};
        const baseBasicSalary = toNumber(
            baseData?.basic_salary
            ?? baseEmployee?.current_position?.salary?.basic_salary
            ?? baseEmployee?.basic_salary
            ?? 0
        );
        const baseDailyRate = toNumber(
            baseData?.daily_rate
            ?? baseData?.payrolls?.[0]?.daily_rate
            ?? (baseBasicSalary ? baseBasicSalary / 26 : 0)
        );

        setDeductionSummary(computeDeductionSummary(baseData?.deductions ?? []));
        setCustomAmounts([]);
        setCustomDeductions([]);
        setDraft({
            payroll_hold: toNumber(baseData?.payroll_hold),
            thirteenth_month: toNumber(baseData?.thirteenth_month),
            tax_refund: toNumber(baseData?.tax_refund),
            incentives: toNumber(baseData?.incentives),
            sl_vl: toNumber(baseData?.sl_vl),
            meal_allowance: toNumber(baseData?.meal_allowance ?? baseData?.meal),
            sales: toNumber(baseData?.sales),
            prepared_by: baseData?.prepared_by ?? preparedBy ?? "",
            prepared_by_title: baseData?.prepared_by_title ?? preparedByTitle ?? "",
            noted_by: baseData?.noted_by ?? "CLARITA P. CRUZ",
            noted_by_title: baseData?.noted_by_title ?? "Payroll Manager",
            employee_name: baseData?.employee_name ?? baseEmployee?.full_name ?? "",
            basic_salary: baseBasicSalary,
            daily_rate: baseDailyRate,
            cola: toNumber(baseData?.cola ?? baseEmployee?.cola ?? 0),
        });
    }, [
        modal.isShowing,
        baseData,
        data?.id,
        data?.last_pay_number,
        data?.employee?.employee_number,
        initializedKey,
        preparedBy,
        preparedByTitle,
        detailsLoaded,
    ]);

    useEffect(() => {
        if (modal.isShowing) return;
        setInitializedKey(null);
        setDetailsLoaded(false);
        setDetails({});
        setPreparedByEmployee(null);
        setCustomAmounts([]);
        setCustomDeductions([]);
    }, [modal.isShowing]);

    const totals = useMemo(() => {
        const customAmountTotal = customAmounts.reduce((sum, item) => sum + toNumber(item.amount), 0);
        const customDeductionTotal = customDeductions.reduce((sum, item) => sum + toNumber(item.amount), 0);
        const subTotal = (
            toNumber(draft.payroll_hold) +
            toNumber(draft.thirteenth_month) +
            toNumber(draft.tax_refund) +
            toNumber(draft.incentives) +
            toNumber(draft.sl_vl) +
            toNumber(draft.meal_allowance) +
            toNumber(draft.sales) +
            customAmountTotal
        );

        const deductionTotal = (
            toNumber(deductionSummary.shortages) +
            toNumber(deductionSummary.variance) +
            toNumber(deductionSummary.breakages) +
            toNumber(deductionSummary.others) +
            toNumber(deductionSummary.uniform) +
            toNumber(deductionSummary.hi_precision) +
            toNumber(deductionSummary.cash_advance) +
            toNumber(deductionSummary.corporate_loans) +
            toNumber(deductionSummary.sss_loans) +
            customDeductionTotal
        );

        return {
            subTotal,
            deductionTotal,
            netClaim: subTotal - deductionTotal,
        };
    }, [draft, deductionSummary, customAmounts, customDeductions]);

    const handlePreview = () => {
        if (!baseData) return;

        const preview = {
            ...baseData,
            payroll_rows_override: baseData?.payroll_rows_override,
            payroll_hold: toNumber(draft.payroll_hold),
            thirteenth_month: toNumber(draft.thirteenth_month),
            tax_refund: toNumber(draft.tax_refund),
            incentives: toNumber(draft.incentives),
            sl_vl: toNumber(draft.sl_vl),
            meal_allowance: toNumber(draft.meal_allowance),
            sales: toNumber(draft.sales),
            total_deductions: totals.deductionTotal,
            last_pay: totals.netClaim,
            prepared_by: draft.prepared_by,
            prepared_by_title: draft.prepared_by_title,
            noted_by: draft.noted_by,
            noted_by_title: draft.noted_by_title,
            employee_name: draft.employee_name,
            basic_salary: toNumber(draft.basic_salary),
            daily_rate: toNumber(draft.daily_rate),
            cola: toNumber(draft.cola),
            deduction_summary_override: deductionSummary,
            computation_items_override: customAmounts,
            deduction_items_override: customDeductions,
        };

        setPreviewData(preview);
        modal.onClose();
        previewModal.onOpen();
    };

    const handleDraftNumberChange = (field: keyof typeof draft) => (e: any) => {
        setDraft((prev) => ({
            ...prev,
            [field]: toNumber(e.target.value),
        }));
    };

    const handleDraftTextChange = (field: keyof typeof draft) => (e: any) => {
        setDraft((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleDeductionChange = (field: keyof DeductionSummary) => (e: any) => {
        setDeductionSummary((prev) => ({
            ...prev,
            [field]: toNumber(e.target.value),
        }));
    };

    const addCustomAmount = () => {
        setCustomAmounts((prev) => ([
            ...prev,
            {
                id: `${Date.now()}-${prev.length}`,
                label: "",
                amount: 0,
            },
        ]));
    };

    const updateCustomAmount = (id: string, field: "label" | "amount", value: any) => {
        setCustomAmounts((prev) => prev.map((item) => (
            item.id === id
                ? {
                    ...item,
                    [field]: field === "amount" ? toNumber(value) : value,
                }
                : item
        )));
    };

    const removeCustomAmount = (id: string) => {
        setCustomAmounts((prev) => prev.filter((item) => item.id !== id));
    };

    const addCustomDeduction = () => {
        setCustomDeductions((prev) => ([
            ...prev,
            {
                id: `${Date.now()}-${prev.length}`,
                label: "",
                amount: 0,
            },
        ]));
    };

    const updateCustomDeduction = (id: string, field: "label" | "amount", value: any) => {
        setCustomDeductions((prev) => prev.map((item) => (
            item.id === id
                ? {
                    ...item,
                    [field]: field === "amount" ? toNumber(value) : value,
                }
                : item
        )));
    };

    const removeCustomDeduction = (id: string) => {
        setCustomDeductions((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <>
            <Modal
                isShowing={modal.isShowing}
                title="Last Pay Computation (PDF Draft)"
                onClose={() => modal.onClose()}
                size="xl"
                loading={api.loading}
            >
                <p className="text-sm text-slate-500 mb-2">
                   Note: Changes here only affect the PDF preview/print and will not update the employee record.
                </p>

                <p className="font-semibold mt-2">Computation Amounts</p>
                <Grid cols={2}>
                    <Textfield
                        label="Payroll Hold (Salary)"
                        type="number"
                        value={draft.payroll_hold}
                        onChange={handleDraftNumberChange("payroll_hold")}
                    />
                    <Textfield
                        label="13th Month"
                        type="number"
                        value={draft.thirteenth_month}
                        onChange={handleDraftNumberChange("thirteenth_month")}
                    />
                    <Textfield
                        label="Tax Refund"
                        type="number"
                        value={draft.tax_refund}
                        onChange={handleDraftNumberChange("tax_refund")}
                    />
                    <Textfield
                        label="Incentives"
                        type="number"
                        value={draft.incentives}
                        onChange={handleDraftNumberChange("incentives")}
                    />
                    <Textfield
                        label="SL/VL"
                        type="number"
                        value={draft.sl_vl}
                        onChange={handleDraftNumberChange("sl_vl")}
                    />
                    <Textfield
                        label="Meal Allowance"
                        type="number"
                        value={draft.meal_allowance}
                        onChange={handleDraftNumberChange("meal_allowance")}
                    />
                    <Textfield
                        label="Sales Incentives"
                        type="number"
                        value={draft.sales}
                        onChange={handleDraftNumberChange("sales")}
                    />
                </Grid>
                <div className="mt-2 flex justify-end">
                    <div className="w-40">
                        <Button
                            label="Add Amount"
                            variant="secondary"
                            onClick={addCustomAmount}
                        />
                    </div>
                </div>
                {customAmounts.length > 0 && (
                    <div className="mt-2">
                        {customAmounts.map((item) => (
                            <div className="flex gap-2 items-end mb-2" key={item.id}>
                                <div className="flex-1">
                                    <Textfield
                                        label="Custom Amount Type"
                                        value={item.label}
                                        onChange={(e) => updateCustomAmount(item.id, "label", e.target.value)}
                                    />
                                </div>
                                <div className="w-48">
                                    <Textfield
                                        label="Amount"
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) => updateCustomAmount(item.id, "amount", e.target.value)}
                                    />
                                </div>
                                <div className="w-28">
                                    <Button
                                        label="Remove"
                                        variant="secondary"
                                        onClick={() => removeCustomAmount(item.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p className="font-semibold mt-4">Deductions (PDF Only)</p>
                <Grid cols={3}>
                    <Textfield
                        label="Shortages"
                        type="number"
                        value={deductionSummary.shortages}
                        onChange={handleDeductionChange("shortages")}
                    />
                    <Textfield
                        label="Variance"
                        type="number"
                        value={deductionSummary.variance}
                        onChange={handleDeductionChange("variance")}
                    />
                    <Textfield
                        label="Breakages"
                        type="number"
                        value={deductionSummary.breakages}
                        onChange={handleDeductionChange("breakages")}
                    />
                    <Textfield
                        label="Others"
                        type="number"
                        value={deductionSummary.others}
                        onChange={handleDeductionChange("others")}
                    />
                    <Textfield
                        label="Uniform"
                        type="number"
                        value={deductionSummary.uniform}
                        onChange={handleDeductionChange("uniform")}
                    />
                    <Textfield
                        label="Hi-Precision"
                        type="number"
                        value={deductionSummary.hi_precision}
                        onChange={handleDeductionChange("hi_precision")}
                    />
                    <Textfield
                        label="Cash Advance"
                        type="number"
                        value={deductionSummary.cash_advance}
                        onChange={handleDeductionChange("cash_advance")}
                    />
                    <Textfield
                        label="Corporate Loans"
                        type="number"
                        value={deductionSummary.corporate_loans}
                        onChange={handleDeductionChange("corporate_loans")}
                    />
                    <Textfield
                        label="SSS Loans"
                        type="number"
                        value={deductionSummary.sss_loans}
                        onChange={handleDeductionChange("sss_loans")}
                    />
                </Grid>
                <div className="mt-2 flex justify-end">
                    <div className="w-40">
                        <Button
                            label="Add Deduction"
                            variant="secondary"
                            onClick={addCustomDeduction}
                        />
                    </div>
                </div>
                {customDeductions.length > 0 && (
                    <div className="mt-2">
                        {customDeductions.map((item) => (
                            <div className="flex gap-2 items-end mb-2" key={item.id}>
                                <div className="flex-1">
                                    <Textfield
                                        label="Custom Deduction Type"
                                        value={item.label}
                                        onChange={(e) => updateCustomDeduction(item.id, "label", e.target.value)}
                                    />
                                </div>
                                <div className="w-48">
                                    <Textfield
                                        label="Amount"
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) => updateCustomDeduction(item.id, "amount", e.target.value)}
                                    />
                                </div>
                                <div className="w-28">
                                    <Button
                                        label="Remove"
                                        variant="secondary"
                                        onClick={() => removeCustomDeduction(item.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p className="font-semibold mt-4">Employee & Rates (PDF Only)</p>
                <Grid cols={3}>
                    <Textfield
                        label="Employee Name"
                        value={draft.employee_name}
                        onChange={handleDraftTextChange("employee_name")}
                    />
                    <Textfield
                        label="Basic Salary"
                        type="number"
                        value={draft.basic_salary}
                        onChange={handleDraftNumberChange("basic_salary")}
                    />
                    <Textfield
                        label="Daily Rate"
                        type="number"
                        value={draft.daily_rate}
                        onChange={handleDraftNumberChange("daily_rate")}
                    />
                    <Textfield
                        label="COLA"
                        type="number"
                        value={draft.cola}
                        onChange={handleDraftNumberChange("cola")}
                    />
                </Grid>

                <p className="font-semibold mt-4">Signatories (PDF Only)</p>
                <Grid cols={2}>
                    <Textfield
                        label="Prepared By"
                        value={draft.prepared_by}
                        onChange={handleDraftTextChange("prepared_by")}
                    />
                    <Textfield
                        label="Prepared By Title"
                        value={draft.prepared_by_title}
                        onChange={handleDraftTextChange("prepared_by_title")}
                    />
                    <Textfield
                        label="Noted By"
                        value={draft.noted_by}
                        onChange={handleDraftTextChange("noted_by")}
                    />
                    <Textfield
                        label="Noted By Title"
                        value={draft.noted_by_title}
                        onChange={handleDraftTextChange("noted_by_title")}
                    />
                </Grid>

                <p className="font-semibold mt-4">Totals</p>
                <Grid cols={3}>
                    <Textfield
                        label="Sub Total Amount"
                        value={formatAmount(totals.subTotal)}
                        disabled
                    />
                    <Textfield
                        label="Total Deductions"
                        value={formatAmount(totals.deductionTotal)}
                        disabled
                    />
                    <Textfield
                        label="Net Claim Amount"
                        value={formatAmount(totals.netClaim)}
                        disabled
                    />
                </Grid>

                <div className="flex justify-end gap-2 mt-4">
                    <div className="w-40">
                        <Button
                            label="Preview PDF"
                            onClick={handlePreview}
                        />
                    </div>
                    <div className="w-32">
                        <Button
                            label="Close"
                            variant="secondary"
                            onClick={() => modal.onClose()}
                        />
                    </div>
                </div>
            </Modal>

            <LastPayComputationModal
                modal={previewModal}
                data={previewData}
                previewData={previewData}
                skipFetch
            />
        </>
    );
};

export default LastPayComputationEditModal;
