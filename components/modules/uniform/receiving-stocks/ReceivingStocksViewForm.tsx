"use client";

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

interface ReplenishmentRequestViewFormProps{
    modal: any;
    formValue?: any;
}

const ReceivingStocksViewForm = ({
    modal,
    formValue,

} : ReplenishmentRequestViewFormProps) => {
    const [form, setForm] = useState<any>(null);

    useEffect(() => {
        if(!formValue) {
            setForm(null);
            return;
        }
        setForm({
            ...formValue,
            items:formValue.items ?? [],
        });
    }, [formValue]);

    const closeModal = () => {
        modal.onClose();
    };

    const requestTotal = (form?.items ?? []).reduce(
        (total: number, item: any) =>
            total +
            Number(item.approved_qty ?? item.requested_qty ?? 0) *
                Number(item.unit_price ?? 0),
            0,
    );

   const lineColumnSettings = [
        {
            columnHead: "Item",
            path: "item.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Received",
            path: "quantity",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Unit Price",
            path: "unit_price",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Remarks",
            path: "remarks",
            columnType: COLUMNTYPES.string
        },
        
    ];

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

    const formatAuditDate = (value?: string | null) =>
            value ? moment(value).format("MMMM DD, YYYY h:mm A") : "-";

    if (!form) {
        return null;
    }

    return(
        <Modal
      isShowing={modal.isShowing}
      title="View Receiving"
      onClose={closeModal}
      size="xl"
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
                label="Receiving Number"
                name="replenishment_type"
                value={form.receiving_no ?? ""}
                disabled
            />
            <Textfield
                label="Request Number"
                name="requested_date"
                value={form.replenishment?.request_no ?? ""}
                disabled
            />
            <Textfield
                label="Date Received"
                name="request_number"
                value={form.date_received ?? ""}
                disabled
            />
             <Textfield
                label="Checker"
                name="request_number"
                value={form.checker_name ?? ""}
                disabled
            />
             <Textfield
                label="CRF Number"
                name="request_number"
                value={form.crf_no ?? ""}
                disabled
            />
             <Textfield
                label="Document Number"
                name="request_number"
                value={form.document_no ?? ""}
                disabled
            />
        </div>
        <TextArea
            label="Overall Remarks"
            name="remarks"
            value={form.remarks ?? ""}
            disabled
        />
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
    </Modal>

    );

};

export default ReceivingStocksViewForm;