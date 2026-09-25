"use client";

import { postReplenishment } from "@/api/uniform/stock-replenishment";

import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Modal from "@/components/common/Modal";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useModal } from "@/hooks/modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Badge from "@/components/common/Badge";
import moment from "moment";

interface ReplenishmentRequestPostFormProps {
  modal: ReturnType<typeof useModal>;
  formValue?: any;
  onSubmitCallback?: () => void;
}

const messageOf = (response: any) =>
  response?.data?.message ??
  response?.message ??
  "Unable to complete the request.";

const ReplenishmentRequestPostForm = ({
    modal,
    formValue,
    onSubmitCallback,
    }: ReplenishmentRequestPostFormProps) => {
    const [form, setForm] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!formValue) {setForm(null);
            return;
        }
        setForm({
            ...formValue,
            items: formValue.items ?? [],
        });
    }, [formValue]);

    const closeModal = () => {
        modal.onClose();
    };

    const formatAuditDate = (value?: string | null) =>
            value ? moment(value).format("MMMM DD, YYYY h:mm A") : "-";

    const requestTotal = (form?.items ?? []).reduce(
        (total: number, item: any) =>
            total +
            Number(item.approved_qty ?? item.requested_qty ?? 0) *
                Number(item.unit_price ?? 0),
            0,
    );

    const submitPost = async () => {
        if (!form) {
            toast.error("No replenishment request selected.");
            return;
        }
        if (!form.id) {
            toast.error("Replenishment request ID is missing.");
            return;
        }
        const accepted = await confirm({
            title: "Post Replenishment Request",
            message: "Are you sure you want to post this replenishment request?",
        });
        if (!accepted) return;
        setSubmitting(true);
        try {
            const response = await postReplenishment(form.id);
            if (response.error) {
                toast.error(messageOf(response));
                return;
            }
            toast.success(
                response.data?.message ?? "Replenishment request posted successfully.",
            );
            closeModal();
            onSubmitCallback?.();
        } catch (error) {
            console.error(error);
            toast.error("Error encountered.");
        } finally {
            setSubmitting(false);
        }
    };

    const lineColumnSettings = [
        {
            columnHead: "Item",
            path: "item.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Stock on Hand",
            path: "item.stock_on_hand",
            columnType: COLUMNTYPES.amount,
        },
        {
            columnHead: "Requested Quantity",
            path: "requested_qty",
            columnType: COLUMNTYPES.amount,
        },
        {
            columnHead: "Approved",
            path: "approved_qty",
            columnType: COLUMNTYPES.amount,
        },
        {
            columnHead: "Unit Price",
            path: "unit_price",
            columnType: COLUMNTYPES.amount,
        },
        {
            columnHead: "Total Amount",
            path: "total_amount",
            columnType: COLUMNTYPES.amount,
        },
        {
            columnHead: "Remarks",
            path: "remarks",
            columnType: COLUMNTYPES.string,
        },
    ];

    if (!form) {
        return null;
    }

    const getStatusBadge = (status: string): "success" | "warning" | "danger" | "default" => {
        switch (status) {
            case "Posted":
                return "success";
            case "Partially Received":
                return "warning";
                case "Fully Received":
                return "success";
            case "Reviewed":
                return "warning";
            case "Cancelled":
                return "danger";
            default:
                return "default";
        }
    };
    

    

  return (
    <Modal
      isShowing={modal.isShowing}
      title="Post Replenishment Request"
      onClose={closeModal}
      size="xxl"
    >
        <div className= "grid grid-cols-4 gap-1 items-end">
            <div className="col-span-3">
                <Textfield
                    label="Supplier"
                    name="supplier"
                    value={
                        form.supplier?.vendor_name ??
                        form.supplier?.vendor_number ??
                        form.supplier_name ??
                        ""
                    }
                    disabled
                />
            </div>
             <div className="col-span-1 w-full flex justify-center">
                <div className="scale-160 -translate-y-3">
                    <Badge
                    status={getStatusBadge(form.status)}
                    label={form.status}
                    />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-3">
            <Textfield
                label="Request Type"
                name="replenishment_type"
                value={form.replenishment_type ?? ""}
                disabled
            />
            <Textfield
                label="Requested Date"
                name="requested_date"
                type="date"
                value={form.requested_date ?? ""}
                disabled
            />
            <Textfield
                label="Request Number"
                name="request_number"
                value={form.request_no ?? ""}
                disabled
            />
        </div>

        <div className="mt-4">
            <div className="flex font-semibold border-b border-slate-300 pb-1 mb-1">
                <span>Request Items</span>
            </div>
            <Table
                dataSet={form.items ?? []}
                columnSettings={lineColumnSettings}
                loading={false}
                fixed
            />
            <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                <div>
                    Showing {form.items?.length ?? 0}{" "}
                    {(form.items?.length ?? 0) === 1 ? "item" : "items"}
                </div>
                <div className="text-right text-sm">
                    <span>Total Amount:</span>
                    <span className="ml-2 font-semibold text-sm">
                        {requestTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })}
                    </span>
                </div>
        </div>
      </div>
        <TextArea
            label="Overall Remarks"
            name="remarks"
            value={form.remarks ?? ""}
            disabled
        />
        <div className="mt-1">
            <div className="flex font-semibold border-b border-slate-300 pb-1 mb-1">
                <span>Activity Log:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Textfield
                    label="Prepared By:"
                    value={form.prepared_by ?? ""}
                    disabled
                />
                <Textfield
                    label="Date & Time"
                    value={formatAuditDate(form.created_at)}
                    disabled
                />
                <Textfield
                    label="Reviewed By:"
                    value={form.reviewed_by ?? ""}
                    disabled
                />
                <Textfield
                    label="Date & Time"
                    value={formatAuditDate(form.reviewed_at)}
                    disabled
                />
                <Textfield
                    label="Posted By:"
                    value={form.posted_by ?? ""}
                    disabled
                />

                <Textfield
                    label="Date & Time"
                    value={formatAuditDate(form.posted_at)}
                    disabled
                />
                <Textfield
                    label="Cancelled By:"
                    value={form.cancelled_by ?? ""}
                    disabled
                />
                <Textfield
                    label="Date & Time"
                    value={formatAuditDate(form.cancelled_at)}
                    disabled
                />
            </div>
        </div>
      <hr className="mt-6 pb-2 text-slate-300" />
      <div className="flex justify-end">
            <div className="w-[120px]">
                <Button
                    type="button"
                    label="Post"
                    loading={submitting}
                    onClick={submitPost}
                />
            </div>
      </div>
    </Modal>
  );
};

export default ReplenishmentRequestPostForm;
