"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import confirm from "@/components/common/Confirm";
import Modal from "@/components/common/Modal";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import Table from "@/components/common/Table";
import Button from "@/components/common/Button";
import { COLUMNTYPES } from "@/constants/column";
import { reviewReceiving } from "@/api/uniform/stock-replenishment";
import moment from "moment"

interface ReceivingStocksReviewFormProps {
    modal: any;
    formValue: any;
    onSubmitCallback?: () => void;
}

const lineInputClassName = [
    "w-full min-h-10 rounded-md border-2 border-slate-300",
    "bg-transparent p-2",
    "focus:border-slate-400 focus:outline-none",
    "dark:border-neutral-700 dark:bg-neutral-800",
].join(" ");

const numericLineInputClassName = `${lineInputClassName} text-right`;

const ReceivingStocksReviewForm = ({
    modal,
    formValue,
    onSubmitCallback,
}: ReceivingStocksReviewFormProps) => {
    const [reviewForm, setReviewForm] = useState<any>({
        items: [],
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!modal?.isShowing || !formValue?.id) {
            return;
        }

        setReviewForm({
            ...formValue,
            items: (formValue.items ?? []).map((item: any) => ({
                ...item,
                quantity: Number(
                    item.quantity ??
                    item.total_receiving ??
                    0
                ),
                unit_price: Number(item.unit_price ?? 0),
                remarks: item.remarks ?? "",
            })),
        });
    }, [modal?.isShowing, formValue]);

    const closeReviewModal = () => {
        if (submitting) {
            return;
        }

        setReviewForm({
            items: [],
        });

        modal?.onClose();
    };

    const formatAuditDate = (value?: string | null) =>
                value ? moment(value).format("MMMM DD, YYYY h:mm A") : "-";

    const updateReviewItem = (
        index: number,
        field: string,
        value: string | number,
    ) => {
        setReviewForm((prev: any) => ({
            ...prev,

            items: prev.items.map(
                (item: any, itemIndex: number) =>
                    itemIndex === index
                        ? {
                            ...item,
                            [field]: value,
                        }
                        : item,
            ),
        }));
    };

    /*
     * REVIEW VALIDATION
     */
    const validateReviewForm = () => {
        if (!reviewForm.items || reviewForm.items.length === 0) {
            toast.error("No receiving items found.");
            return false;
        }

        const invalidItem = reviewForm.items.find((item: any) => {
            const quantity = Number(item.quantity);
            const unitPrice = Number(item.unit_price);

            return (
                quantity <= 0 ||
                unitPrice < 0 ||
                Number.isNaN(quantity) ||
                Number.isNaN(unitPrice)
            );
        });

        if (invalidItem) {
            toast.error(
                "Quantity must be greater than 0 and unit price cannot be negative."
            );

            return false;
        }

        return true;
    };

    const submitReview = async () => {
        if (!validateReviewForm()) {
            return;
        }

        const accepted = await confirm({
            title: "Review Receiving",
            message: "Are you sure you want to submit this receiving for review?",
        });

        if (!accepted) {
            return;
        }

        setSubmitting(true);

        try {  
            const response = await reviewReceiving(reviewForm.id, {
                ...reviewForm,
                items: reviewForm.items,
            });
            if (response.error) {
                toast.error(
                    response?.data?.message ??
                    response?.message ??
                    "Unable to review receiving."
                );
                return;
            }
            toast.success("Receiving reviewed successfully.");
            modal?.onClose();
            onSubmitCallback?.();
        } catch (error) {
            console.error("Review receiving error:", error);
            toast.error(
                "Error encountered while reviewing receiving."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const requestTotal = (reviewForm.items ?? []).reduce(
        (total: number, item: any) =>
            total +
            Number(item.quantity ?? 0) *
            Number(item.unit_price ?? 0),
        0
    );

    const receivingItemColumnSettings = [
        {
            columnHead: "Item",
            path: "item",
            columnType: COLUMNTYPES.function,
            function: (line: any) => (
                <>
                    {line.item?.item_no}
                    {" - "}
                    {line.item?.description}
                </>
            ),
        },

        {
            columnHead: "Stock on Hand",
            path: "item.stock_on_hand",
            columnType: COLUMNTYPES.function,
            function: (line: any) =>
                Number(
                    line.item?.stock_on_hand ?? 0
                ).toLocaleString(),
        },

        {
            columnHead: "Quantity",
            path: "quantity",
            columnType: COLUMNTYPES.function,
            function: (line: any) => {
                const index = reviewForm.items.findIndex(
                    (item: any) =>
                        String(item.id) === String(line.id)
                );

                return (
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={numericLineInputClassName}
                        value={line.quantity ?? ""}
                        disabled={submitting}
                        onChange={(event) => {
                            const value = event.target.value;

                            if (value === "") {
                                updateReviewItem(
                                    index,
                                    "quantity",
                                    ""
                                );
                                return;
                            }

                            const quantity = Number(value);

                            if (quantity < 0) {
                                return;
                            }

                            updateReviewItem(
                                index,
                                "quantity",
                                value
                            );
                        }}
                    />
                );
            },
        },

        {
            columnHead: "Unit Price",
            path: "unit_price",
            columnType: COLUMNTYPES.function,
            function: (line: any) => {
                const index = reviewForm.items.findIndex(
                    (item: any) =>
                        String(item.id) === String(line.id)
                );

                return (
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={numericLineInputClassName}
                        value={line.unit_price ?? ""}
                        disabled={submitting}
                        onChange={(event) => {
                            const value = event.target.value;

                            if (value === "") {
                                updateReviewItem(
                                    index,
                                    "unit_price",
                                    ""
                                );
                                return;
                            }

                            const unitPrice = Number(value);

                            if (unitPrice < 0) {
                                return;
                            }

                            updateReviewItem(
                                index,
                                "unit_price",
                                value
                            );
                        }}
                    />
                );
            },
        },

        {
            columnHead: "Total Amount",
            path: "total_amount",
            columnType: COLUMNTYPES.function,
            function: (line: any) => {
                const total =
                    Number(line.quantity ?? 0) *
                    Number(line.unit_price ?? 0);

                return (
                    <div className="text-right">
                        {total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </div>
                );
            },
        },

        {
            columnHead: "Remarks",
            path: "remarks",
            columnType: COLUMNTYPES.function,
            function: (line: any) => {
                const index = reviewForm.items.findIndex(
                    (item: any) =>
                        String(item.id) === String(line.id)
                );

                return (
                    <input
                        type="text"
                        className={lineInputClassName}
                        value={line.remarks ?? ""}
                        disabled={submitting}
                        onChange={(event) =>
                            updateReviewItem(
                                index,
                                "remarks",
                                event.target.value
                            )
                        }
                    />
                );
            },
        },
    ];

    return (
        <Modal
            isShowing={modal?.isShowing ?? false}
            title="Review Receiving"
            onClose={closeReviewModal}
            size="xxl"
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    submitReview();
                }}
            >
                <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">

                    <Textfield
                        label="Receiving No."
                        name="receiving_no"
                        value={reviewForm.receiving_no ?? ""}
                        disabled
                    />

                    <Textfield
                        label="Request No."
                        name="request_no"
                        value={
                            reviewForm.replenishment?.request_no ??
                            reviewForm.request_no ??
                            ""
                        }
                        disabled
                    />

                    <Textfield
                        label="Date Received"
                        name="date_received"
                        type="date"
                        value={reviewForm.date_received ?? ""}
                        disabled
                    />

                    <Textfield
                        label="CRF Number"
                        name="crf_no"
                        value={reviewForm.crf_no ?? ""}
                        disabled
                    />

                    <Textfield
                        label="Document Number"
                        name="document_no"
                        value={reviewForm.document_no ?? ""}
                        disabled
                    />

                    <Textfield
                        label="Supplier"
                        name="transmitted_by"
                        value={reviewForm.transmitted_by ?? ""}
                        disabled
                    />
                </div>

                <div className="flex mt-4 font-semibold border-b border-slate-300 pb-1 mb-1 items-center justify-between">
                    <span>Receiving Items</span>
                </div>

                <Table
                    dataSet={reviewForm.items ?? []}
                    columnSettings={receivingItemColumnSettings}
                    loading={false}
                    fixed
                />

                <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                    <div>
                        Showing {reviewForm.items?.length ?? 0}{" "}
                        {(reviewForm.items?.length ?? 0) === 1
                            ? "item"
                            : "items"}
                    </div>

                    <div className="text-right text-sm">
                        <span>
                            Total Amount:
                        </span>

                        <span className="ml-2 font-semibold text-sm">
                            {requestTotal.toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </span>
                    </div>
                </div>

                <TextArea
                    label="Remarks"
                    name="remarks"
                    value={reviewForm.remarks ?? ""}
                    disabled
                    onChange={(event) => {
                        setReviewForm((prev: any) => ({
                            ...prev,
                            remarks: event.target.value,
                        }));
                    }}
                />
                <div className="mt-1">
                    <div className="flex font-semibold border-b border-slate-300 pb-1 mb-1">
                        <span>Activity Log:</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Textfield
                            label="Prepared By:"
                            value={reviewForm.prepared_by ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Date & Time"
                            value={formatAuditDate(reviewForm.created_at)}
                            disabled
                        />
                        <Textfield
                            label="Reviewed By:"
                            value={reviewForm.reviewed_by ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Date & Time"
                            value={formatAuditDate(reviewForm.reviewed_at)}
                            disabled
                        />
                        <Textfield
                            label="Posted By:"
                            value={reviewForm.posted_by ?? ""}
                            disabled
                        />

                        <Textfield
                            label="Date & Time"
                            value={formatAuditDate(reviewForm.posted_at)}
                            disabled
                        />
                        <Textfield
                            label="Cancelled By:"
                            value={reviewForm.cancelled_by ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Date & Time"
                            value={formatAuditDate(reviewForm.cancelled_at)}
                            disabled
                        />
                    </div>
                </div>

                <hr className="mt-6 pb-2 text-slate-300" />

                <div className="flex justify-end">
                    <div className="flex gap-x-2">
                        <Button
                            type="button"
                            label="Cancel"
                            disabled={submitting}
                            onClick={closeReviewModal}
                        />

                        <Button
                            type="submit"
                            label="Review"
                            loading={submitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ReceivingStocksReviewForm;