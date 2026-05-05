import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { formatNumber } from "@/helper/amount";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { getInitialLastPay } from "@/api/compensation/last-pay";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    data: any
}

const ViewLastPayModal = ({
    modal,
    data
}: ModalInterface
) => {
    const [liveData, setLiveData] = useState<any>(null);
    const [liveLoading, setLiveLoading] = useState(false);
    const isUnposted = data?.status === "Unposted";

    useEffect(() => {
        if (!modal.isShowing || !isUnposted) {
            setLiveData(null);
            setLiveLoading(false);
            return;
        }

        const employeeNumber = data?.employee?.employee_number;
        if (!employeeNumber) {
            return;
        }

        setLiveLoading(true);
        getInitialLastPay(employeeNumber)
            .then((resp) => {
                if (!resp?.error) {
                    setLiveData(resp.data);
                } else {
                    toast.error("Error fetching live last pay details");
                }
            })
            .catch(() => {
                toast.error("Error fetching live last pay details");
            })
            .finally(() => {
                setLiveLoading(false);
            });
    }, [modal.isShowing, isUnposted, data?.employee?.employee_number]);

    const display = useMemo(() => {
        if (isUnposted && liveData) {
            return {
                ...data,
                ...liveData,
                meal: liveData.meal_allowance ?? data?.meal,
            };
        }
        return data;
    }, [data, isUnposted, liveData]);

    const liveCompanyDeductions = useMemo(() => {
        const deductions = liveData?.company_deductions ?? [];
        if (liveData?.sss_loans === "Yes") {
            return deductions;
        }
        return deductions.filter((deduction: any) => deduction?.deduction?.description !== "SSS Loans");
    }, [liveData]);

    const companyDeductionsForDisplay = isUnposted && liveData
        ? liveCompanyDeductions
        : (data.deductions ?? []);

    const governmentDeductionsForDisplay = isUnposted && liveData
        ? (liveData.government_deductions ?? [])
        : (data.employee?.government_deductions ?? []);

    const computedTotals = useMemo(() => {
        if (!(isUnposted && liveData)) {
            return null;
        }

        const totalDeductions = (companyDeductionsForDisplay ?? []).reduce((sum: number, deduction: any) => {
            const amount = Number(deduction?.balance ?? deduction?.amount ?? 0);
            return sum + amount;
        }, 0);

        const lastPay = (
            Number(display.payroll_hold ?? 0) +
            Number(display.thirteenth_month ?? 0) +
            Number(display.incentives ?? 0) +
            Number(display.sl_vl ?? 0) +
            Number(display.meal ?? 0) +
            Number(display.tax_refund ?? 0) +
            Number(display.sales ?? 0)
        ) - totalDeductions;

        return { totalDeductions, lastPay };
    }, [isUnposted, liveData, companyDeductionsForDisplay, display]);

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
    ];

    const governmentDeduction = [
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
    ];

    const editLogColumnSettings = [
        {
            columnHead: "Date Edited",
            path: "created_at",
            columnType: COLUMNTYPES.function,
            function: (row: any) => row.created_at ? moment(row.created_at).format("MMMM DD, YYYY h:mm A") : "-"
        },
        {
            columnHead: "Edited By",
            path: "created_by",
            columnType: COLUMNTYPES.function,
            function: (row: any) => row?.causer?.proper_full_name || row?.causer?.full_name || row?.causer?.email || "-"
        }
    ];

    const activities = Array.isArray(data.activities) ? data.activities : [];
    const createdActivity = activities.find((item: any) => item.event === "created");
    const postedActivity = activities.find((item: any) => item.event === "posted")
        || activities.find((item: any) => item.event === "updated" && item?.properties?.attributes?.status === "Posted");
    const postedActivityId = postedActivity?.id;
    const editLogs = activities.filter((item: any) => item.event === "updated" && item.id !== postedActivityId);

    const getCauserName = (activity: any) => {
        return activity?.causer?.proper_full_name
            || activity?.causer?.full_name
            || activity?.causer?.email
            || "-";
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Last Pay Record"
            onClose={() => {
                modal.onClose();
            }}
            size="md"
        >
            <Textfield
                label="Employee"
                value={display.employee?.full_name}
                disabled
            />
            <Grid cols={2}>
                <Textfield
                    label="Year"
                    type="number"
                    name="year"
                    value={display.year}
                    disabled
                />
                <Textfield
                    label="Payroll"
                    name="payroll_hold"
                    value={ formatNumber(display.payroll_hold)}
                    disabled
                />
                <Textfield
                    label="13th Month"
                    value={ formatNumber(display["thirteenth_month"])}
                    disabled
                />
                <Textfield
                    label="Tax Refund"
                    name="tax_refund"
                    value={formatNumber(display.tax_refund)}
                    disabled
                />
                <Textfield
                    label="Sales Incentives"
                    name="sales"
                    value={formatNumber(display.sales)}
                    disabled
                />
                <Textfield
                    label="Incentives"
                    name="incentives"
                    disabled
                    value={formatNumber(display.incentives)}
                />
                <Textfield
                    label="SL/VL"
                    name="sl_vl"
                    value={formatNumber(display.sl_vl)}
                    disabled
                />
                <Textfield
                    label="Meal Allowance"
                    value={formatNumber(display.meal)}
                    disabled
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
                value={ formatNumber(
                    computedTotals?.totalDeductions ?? display.total_deductions
                )}
                disabled
            />
            <p className="mt-3">SSS/Pagibig Loans</p>
            <Table
                dataSet={governmentDeductionsForDisplay}
                columnSettings={governmentDeduction}
                smallText
            />

            <Textfield
                label="Last Pay"
                onChange={() => {}}
                value={ formatNumber(computedTotals?.lastPay ?? display.last_pay)}
                disabled
            />

            <p className="mt-3">Record Log</p>
            <Grid cols={2}>
                <Textfield
                    label="Date Created"
                    value={
                        createdActivity?.created_at
                            ? moment(createdActivity.created_at).format("MMMM DD, YYYY")
                            : (display.created_at ? moment(display.created_at).format("MMMM DD, YYYY") : "-")
                    }
                    disabled
                />
                <Textfield
                    label="Created By"
                    value={getCauserName(createdActivity)}
                    disabled
                />
                <Textfield
                    label="Date Posted"
                    value={postedActivity?.created_at ? moment(postedActivity.created_at).format("MMMM DD, YYYY h:mm A") : "-"}
                    disabled
                />
                <Textfield
                    label="Posted By"
                    value={getCauserName(postedActivity)}
                    disabled
                />
            </Grid>

            <p className="mt-3">Edit History</p>
            <Table
                dataSet={editLogs}
                columnSettings={editLogColumnSettings}
                smallText
            />
        </Modal>
    );
};

export default ViewLastPayModal;
