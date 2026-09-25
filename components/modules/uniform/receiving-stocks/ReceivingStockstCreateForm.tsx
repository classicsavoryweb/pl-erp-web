"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  createReceiving,
  getReceivableReplenishments,
} from "@/api/uniform/stock-replenishment";

import confirm from "@/components/common/Confirm";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import SearchEmployeeDropDown from "@/components/modules/generic/SearchEmployeeDropDown";
import Table from "@/components/common/Table";
import Button from "@/components/common/Button";
import { COLUMNTYPES } from "@/constants/column";

interface ReceivingStocksCreateFormProps {
  modal: any;
  onSubmitCallback?: () => void;
}

interface ReceivingForm {
  replenishment_id: string;
  date_received: string;
  crf_no: string;
  document_no: string;
  checker_employee: any;
  checker_name: string;
  transmitted_by: string;
  remarks: string;
  items: any[];
  errors: {
    replenishment_id: string;
    checker_employee: string;
    crf_no: string;
    document_no: string;
  };
}

const today = () => {
  return new Date().toISOString().slice(0, 10);
};

const createEmptyReceiving = (): ReceivingForm => ({
  replenishment_id: "",
  date_received: today(),
  crf_no: "",
  document_no: "",
  checker_employee: null,
  checker_name: "",
  transmitted_by: "",
  remarks: "",
  items: [],
  errors: {
    replenishment_id: "",
    checker_employee: "",
    crf_no: "",
    document_no: "",
  },
});

const messageOf = (response: any) =>
  response?.data?.message ??
  response?.message ??
  "Unable to complete the request.";

const lineInputClassName = [
  "w-full min-h-10 rounded-md border-2 border-slate-300",
  "bg-transparent p-2",
  "focus:border-slate-400 focus:outline-none",
  "dark:border-neutral-700 dark:bg-neutral-800",
].join(" ");

const numericLineInputClassName = `${lineInputClassName} text-right`;

const readOnlyNumericLineInputClassName = [
  numericLineInputClassName,
  "cursor-default",
  "!border-slate-300",
  "!bg-slate-200",
  "!text-slate-600",
  "focus:!border-slate-300",
  "dark:!border-neutral-700",
  "dark:!bg-neutral-900",
  "dark:!text-neutral-400",
].join(" ");

const ReceivingStocksCreateForm = ({
  modal,
  onSubmitCallback,
}: ReceivingStocksCreateFormProps) => {
  const [receivable, setReceivable] = useState<any[]>([]);
  const [receivingForm, setReceivingForm] = useState<ReceivingForm>(
    createEmptyReceiving(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!modal?.isShowing) {
        return;
        }

        resetForm();
        loadReceivableReplenishments();
    }, [modal?.isShowing]);

  const resetForm = () => {
    setReceivingForm(createEmptyReceiving());
  };

    const loadReceivableReplenishments = async () => {
        setLoading(true);

        try {
            const response = await getReceivableReplenishments();
            if (response.error) {
                toast.error(messageOf(response));
                setReceivable([]);
                return;
            }
            setReceivable(response.data ?? []);
        } catch (error) {
            console.error("Failed to load receivable replenishments:", error);
            toast.error("Error fetching receivable replenishment requests.");
            setReceivable([]);
        } finally {
            setLoading(false);
        }
    };

    const closeReceivingModal = () => {
        if (submitting) {
        return;
        }

        resetForm();

        modal?.onClose();
    };

    const selectReceivingRequest = (requestId: string) => {
        const request = receivable.find(
        (record) => String(record.id) === String(requestId),
        );

        if (!request) {
        setReceivingForm((form) => ({
            ...form,
            replenishment_id: requestId,
            transmitted_by: "",
            items: [],
            errors: {
            ...form.errors,
            replenishment_id: "Selected replenishment request was not found.",
            },
        }));

        return;
        }

        setReceivingForm((form) => ({
        ...form,
        replenishment_id: requestId,
        transmitted_by: request?.supplier?.vendor_name ?? "",
        items: (request?.items ?? []).map((item: any) => {
            const remainingQty =
            Number(item.remaining_qty) - Number(item.pending_received_qty ?? 0);
            return {
                replenishment_item_id: item.id,
                item: item.item,
                remaining_qty: Math.max(remainingQty, 0),
                quantity: Math.max(remainingQty, 0),
                unit_price: Number(item.unit_price ?? 0),
                remarks: "",
            };
        }),
        errors: {
            ...form.errors,
            replenishment_id: "",
        },
        }));
    };

    const updateReceivingItem = (
        index: number,
        field: string,
        value: string | number,
    ) => {
        setReceivingForm((form) => ({
        ...form,

        items: form.items.map((item, itemIndex) =>
            itemIndex === index
            ? {
                ...item,
                [field]: value,
                }
            : item,
        ),
        }));
    };

    const validateReceivingForm = () => {
        const errors = {
        replenishment_id: "",
        checker_employee: "",
        crf_no: "",
        document_no: "",
        };

        let hasError = false;

        if (!receivingForm.replenishment_id) {
            errors.replenishment_id = "Replenishment request is required.";
            hasError = true;
        }
        if (!receivingForm.checker_name) {
            errors.checker_employee = "Checker is required.";
            hasError = true;
        }
        if (!receivingForm.crf_no) {
            errors.crf_no = "CRF Number is required.";
            hasError = true;
        }
        if (!receivingForm.document_no) {
            errors.document_no = "Document Number is required.";
            hasError = true;
        }

        const validItems = receivingForm.items.filter(
        (item) => Number(item.quantity) > 0,
        );
        if (validItems.length === 0) {
            hasError = true;
            toast.error("Enter at least one received quantity.");
        }
        setReceivingForm((prev) => ({
            ...prev,
            errors,
        }));
        return {
            hasError,
            validItems,
        };
    };

    const submitReceiving = async () => {
        const validation = validateReceivingForm();

        if (validation.hasError) {
            if (
                receivingForm.items.filter((item) => Number(item.quantity) > 0)
                .length === 0
            ) {
                toast.error(
                "Complete the receiving details and enter at least one received quantity.",
                );
            } else {
                toast.error("Complete the required receiving details.");
            }

            return;
        }
        const payload = {
        ...receivingForm,
        items: receivingForm.items.filter((item) => Number(item.quantity) > 0),
        };
        const hasInvalidItem = payload.items.some((item) => {
            const quantity = Number(item.quantity);
            const remainingQty = Number(item.remaining_qty);
            const unitPrice = Number(item.unit_price);
            return quantity <= 0 || quantity > remainingQty || unitPrice < 0;
        });

        if (hasInvalidItem) {
            toast.error(
                "Receiving quantities must be within the remaining quantity, and unit price cannot be negative.",
            );
            return;
        }
        const accepted = await confirm({
            title: "Create Receiving",
            message: "Are you sure you want to create this receiving transaction?",
        });

        if (!accepted) {
            return;
        }
        setSubmitting(true);
        try {
            const response = await createReceiving(payload);
            if (response.error) {
                toast.error(messageOf(response));
                return;
            }
            toast.success(
                response.data?.message ?? "Receiving transaction created successfully.",
            );
            resetForm();
            modal?.onClose();
            onSubmitCallback?.();
        } catch (error) {
            console.error("Create receiving error:", error);
            toast.error("Error encountered while creating receiving.");
        } finally {
            setSubmitting(false);
        }
    };

     const requestTotal = receivingForm.items.reduce(
        (total: number, item: any) =>
            total +
            Number(item.quantity || 0) *
            Number(item.unit_price || 0),
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
            columnHead: "Stock on hand",
            path: "item.stock_on_hand",
            columnType: COLUMNTYPES.function,
            function: (line: any) =>
                Number(line.item?.stock_on_hand ?? 0).toLocaleString(),
        },
        {
            columnHead: "Remaining Quantity",
            path: "remaining_qty",
            columnType: COLUMNTYPES.function,
            function: (line: any) => Number(line.remaining_qty ?? 0).toLocaleString(),
        },
        {
            columnHead: "Receiving Now",
            path: "quantity",
            columnType: COLUMNTYPES.function,
            function: (line: any) => {
                const index = receivingForm.items.findIndex(
                (item: any) =>
                    String(item.replenishment_item_id) ===
                    String(line.replenishment_item_id),
                );
                return (
                <input
                    type="number"
                    min="0"
                    max={line.remaining_qty}
                    step="0.01"
                    className={numericLineInputClassName}
                    value={line.quantity ?? ""}
                    disabled={submitting}
                    onChange={(event) => {
                    const value = event.target.value;
                    if (value === "") {
                        updateReceivingItem(index, "quantity", "");
                        return;
                    }
                    const quantity = Number(value);
                    const maxQuantity = Number(line.remaining_qty);
                    if (quantity > maxQuantity) {
                        toast.error(`Cannot receive more than ${maxQuantity}.`);
                        return;
                    }
                    if (quantity < 0) {
                        return;
                    }
                    updateReceivingItem(index, "quantity", value);
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
                const index = receivingForm.items.findIndex(
                    (item: any) =>
                        String(item.replenishment_item_id) ===
                        String(line.replenishment_item_id)
                );
                return (
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={numericLineInputClassName}
                        value={line.unit_price ?? ""}
                        onChange={(event) => {
                            const value = event.target.value;
                            if (value === "") {
                                updateReceivingItem(
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
                            updateReceivingItem(index,"unit_price",value);
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
                const total = Number(line.quantity ?? 0) * Number(line.unit_price ?? 0);
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
                const index = receivingForm.items.findIndex(
                (item: any) =>
                    String(item.replenishment_item_id) ===
                    String(line.replenishment_item_id),
                );
                return (
                <input
                    type="text"
                    className={lineInputClassName}
                    value={line.remarks ?? ""}
                    disabled={submitting}
                    onChange={(event) =>
                    updateReceivingItem(index, "remarks", event.target.value)
                    }
                />
                );
            },
        },
    ];

    return (
        <Modal
            isShowing={modal?.isShowing ?? false}
            title="Receive Stock"
            onClose={closeReceivingModal}
            size="xxl"
        >
        <form
            onSubmit={(event) => {
            event.preventDefault();

            submitReceiving();
            }}
        >
            <SearchableDropDown
                label="Replenishment Request"
                placeholder={
                    loading ? "Loading requests..." : "Select posted request"
                }
                name="replenishment_id"
                value={receivingForm.replenishment_id ?? ""}
                error={receivingForm.errors.replenishment_id}
                required
                disabled={loading || submitting}
                onChange={(event) => {
                    selectReceivingRequest(event.target.value);
                }}
                options={receivable
                    .filter((record) => {
                    const validStatus =
                        record.status === "Posted" ||
                        record.status === "Partially Received";

                    const hasRemainingItems = record.items?.some((item: any) => {
                        const remaining =
                        Number(item.remaining_qty) -
                        Number(item.pending_received_qty ?? 0);

                        return remaining > 0;
                    });

                    return validStatus && hasRemainingItems;
                    })

                    .map((record) => ({
                    label: `${record.request_no} - ${
                        record.supplier?.vendor_name ?? ""
                    }`,

                    value: String(record.id),
                    }))}
            />
            <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
            <Textfield
                label="Date Received"
                name="date_received"
                type="date"
                value={receivingForm.date_received ?? ""}
                required
                disabled={submitting}
                onChange={(event) => {
                setReceivingForm((prev) => ({
                    ...prev,

                    date_received: event.target.value,
                }));
                }}
            />

            <SearchEmployeeDropDown
                label="Checker"
                placeholder="select employee"
                name="checker_employee"
                value={receivingForm.checker_employee ?? ""}
                error={receivingForm.errors.checker_employee}
                disabled={submitting}
                required
                status="active"
                onChange={(event: any) => {
                const employee = event.target.value;

                const checkerName =
                    employee?.full_name ??
                    [
                    employee?.first_name,
                    employee?.middle_name,
                    employee?.last_name,
                    ]
                    .filter(Boolean)
                    .join(" ");

                setReceivingForm((prev) => ({
                    ...prev,

                    checker_employee: employee,

                    checker_name: checkerName,

                    errors: {
                    ...prev.errors,

                    checker_employee: "",
                    },
                }));
                }}
            />

            <Textfield
                label="CRF Number"
                name="crf_no"
                value={receivingForm.crf_no ?? ""}
                error={receivingForm.errors.crf_no}
                required
                disabled={submitting}
                onChange={(event) => {
                setReceivingForm((prev) => ({
                    ...prev,

                    crf_no: event.target.value,

                    errors: {
                    ...prev.errors,

                    crf_no: "",
                    },
                }));
                }}
            />

            <Textfield
                label="Document Number"
                name="document_no"
                value={receivingForm.document_no ?? ""}
                error={receivingForm.errors.document_no}
                required
                disabled={submitting}
                onChange={(event) => {
                setReceivingForm((prev) => ({
                    ...prev,
                    document_no: event.target.value,
                    errors: {
                        ...prev.errors,
                        document_no: "",
                    },
                }));
                }}
            />

            <Textfield
                label="Supplier"
                name="transmitted_by"
                disabled
                value={receivingForm.transmitted_by ?? ""}
            />
            </div>
            <div className="flex mt-4 font-semibold border-b border-slate-300 pb-1 mb-1 items-center justify-between">
            <span>Receiving Items</span>
            </div>
            <Table
            dataSet={receivingForm.items ?? []}
            columnSettings={receivingItemColumnSettings}
            loading={false}
            fixed
            />
            <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                <div>
                    Showing {receivingForm.items.length}{" "}
                    {receivingForm.items.length === 1
                        ? "item"
                        : "items"}
                </div>

                <div className="text-right">
                    <span>
                        Total Amount:
                    </span>

                    <span className="ml-2 font-semibold">
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
                value={receivingForm.remarks ?? ""}
                disabled={submitting}
                onChange={(event) => {
                    setReceivingForm((prev) => ({
                    ...prev,

                    remarks: event.target.value,
                    }));
                }}
            />
            <hr className="mt-6 pb-2 text-slate-300" />
            <div className="flex justify-end">
                <div className="flex gap-x-2">
                    <Button
                    type="button"
                    label="Cancel"
                    disabled={submitting}
                    onClick={closeReceivingModal}
                    />

                    <Button
                    type="submit"
                    label="Submit"
                    loading={submitting}
                    onClick={() => {}}
                    />
                </div>
            </div>
        </form>
        </Modal>
    );
};

export default ReceivingStocksCreateForm;
