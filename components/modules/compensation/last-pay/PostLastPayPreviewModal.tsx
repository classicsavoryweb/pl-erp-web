"use client";

import { previewLastPay, postLastPay } from "@/api/compensation/last-pay";
import Button from "@/components/common/Button";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { formatNumber } from "@/helper/amount";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    data: any;
    onPosted: () => void;
}

const PostLastPayPreviewModal = ({
    modal,
    data,
    onPosted,
}: ModalInterface) => {
    const [preview, setPreview] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState(false);

    const toAmount = (value: any) => {
        const amount = Number(value);
        return Number.isFinite(amount) ? amount : 0;
    };

    useEffect(() => {
        if (!modal.isShowing || !data?.id) {
            setPreview(null);
            setLoading(false);
            setError(false);
            return;
        }

        setLoading(true);
        setError(false);
        previewLastPay(data.id)
            .then((resp) => {
                if (!resp?.error) {
                    setPreview(resp.data);
                } else {
                    setError(true);
                    toast.error(resp?.data?.message ?? "Error fetching last pay preview");
                }
            })
            .catch(() => {
                setError(true);
                toast.error("Error fetching last pay preview");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [modal.isShowing, data?.id]);

    const earnings = useMemo(() => {
        const values = preview?.earnings ?? {};
        return [
            { label: "Payroll", amount: toAmount(values.payroll_hold) },
            { label: "13th Month", amount: toAmount(values.thirteenth_month) },
            { label: "Tax Refund", amount: toAmount(values.tax_refund) },
            { label: "Sales Incentives", amount: toAmount(values.sales_incentives) },
            { label: "Incentives", amount: toAmount(values.incentives) },
            { label: "SL/VL", amount: toAmount(values.sl_vl) },
            { label: "Meal Allowance", amount: toAmount(values.meal_allowance) },
        ];
    }, [preview]);

    const amountColumnSettings = [
        {
            columnHead: "Description",
            path: "label",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.function,
            function: (row: any) => formatNumber(row?.amount ?? 0),
        },
    ];

    const deductionColumnSettings = [
        {
            columnHead: "Type",
            path: "type",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Reference",
            path: "reference_doc",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount,
        },
    ];

    const closeModal = () => {
        if (!posting) {
            modal.onClose();
        }
    };

    const handlePost = () => {
        if (!data?.id) {
            return;
        }

        setPosting(true);
        postLastPay(data.id)
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Last pay posted successfully");
                    modal.onClose();
                    onPosted();
                } else {
                    toast.error(resp?.data?.message ?? "Error posting last pay");
                }
            })
            .catch(() => {
                toast.error("Error encountered");
            })
            .finally(() => {
                setPosting(false);
            });
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Preview Last Pay Before Posting"
            onClose={closeModal}
            loading={loading}
            error={error}
            size="lg"
        >
            <Grid cols={2}>
                <Textfield
                    label="Employee"
                    value={preview?.employee?.full_name}
                    disabled
                />
                <Textfield
                    label="Employee Number"
                    value={preview?.employee?.employee_number}
                    disabled
                />
                <Textfield
                    label="Last Pay Number"
                    value={preview?.last_pay?.last_pay_number}
                    disabled
                />
                <Textfield
                    label="Year"
                    value={preview?.last_pay?.year}
                    disabled
                />
                <Textfield
                    label="Branch"
                    value={preview?.employee?.branch}
                    disabled
                />
                <Textfield
                    label="Position"
                    value={preview?.employee?.position}
                    disabled
                />
            </Grid>

            <p className="mt-4 font-semibold">Earnings</p>
            <Table
                dataSet={earnings}
                columnSettings={amountColumnSettings}
                smallText
            />

            <p className="mt-4 font-semibold">Company Deductions</p>
            <Table
                dataSet={preview?.deductions?.company ?? []}
                columnSettings={deductionColumnSettings}
                smallText
            />

            <p className="mt-4 font-semibold">SSS/Pagibig Loans</p>
            <Table
                dataSet={preview?.deductions?.government ?? []}
                columnSettings={deductionColumnSettings}
                smallText
            />

            <Grid cols={3}>
                <Textfield
                    label="Gross Pay"
                    value={formatNumber(preview?.totals?.gross_pay ?? 0)}
                    disabled
                />
                <Textfield
                    label="Total Deductions"
                    value={formatNumber(preview?.totals?.total_deductions ?? 0)}
                    disabled
                />
                <Textfield
                    label="Last Pay"
                    value={formatNumber(preview?.totals?.computed_last_pay ?? 0)}
                    disabled
                />
            </Grid>

            <div className="flex gap-2 justify-end mt-4">
                <div className="w-[140px]">
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={closeModal}
                        disabled={posting}
                    />
                </div>
                <div className="w-[160px]">
                    <Button
                        label="Post Last Pay"
                        variant="success"
                        onClick={handlePost}
                        loading={posting}
                        disabled={!preview || loading || error}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default PostLastPayPreviewModal;
