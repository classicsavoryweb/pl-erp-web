"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import TextArea from "@/components/common/TextArea";
import Badge from "@/components/common/Badge";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import Table from "@/components/common/Table";
import moment from "moment";
import {COLUMNTYPES} from "@/constants/column";
import { reviewPhysicalCount , postPhysicalCount} from "@/api/uniform/physical-count";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";


interface PhysicalCountViewFormProps {
    modal: any;
    modalType: "View" | "Review" | "Post";
    title: string;
    selected: any;
    onReload?: () => void | Promise<void>;

}

const PhysicalCountViewForm = ({
    modal,
    modalType,
    title,
    selected,
    onReload,
}: PhysicalCountViewFormProps) => {

    const numberValue = (value: any) => Number(value || 0);

    const getStatusBadge = (status: string): "success" | "warning" | "danger" | "default" => {
        switch (status) {
            case "Posted":
                return "success";
            case "Reviewed":
                return "warning";
            case "Cancelled":
                return "danger";
            default:
                return "default";
        }
    };

    const formatDate = (value?: string | null) =>
            value ? moment(value).format("MM/DD/YYYY") : "";

    const formatAuditDate = (value?: string | null) =>
        value ? moment(value).format("MMMM DD, YYYY h:mm A") : "-";

    const responseMessage = (resp: any) =>
    resp?.message ?? resp?.data?.message ?? "Unable to complete request.";

    const money = (value: any) => numberValue(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    });

    const viewItems = selected?.items ?? [];
    const physicalViewColumns = [
        { columnHead: "Item Code", path: "item_no", columnType: COLUMNTYPES.string },
        { columnHead: "Description", path: "description", columnType: COLUMNTYPES.string },
        { columnHead: "UOM", path: "uom", columnType: COLUMNTYPES.string },
        { columnHead: "Beginning", path: "beginning_inventory", columnType: COLUMNTYPES.amount },
        { columnHead: "Purchases", path: "total_purchases", columnType: COLUMNTYPES.amount },
        { columnHead: "Outgoing", path: "total_outgoing", columnType: COLUMNTYPES.amount },
        { columnHead: "Should Be", path: "should_be_inventory", columnType: COLUMNTYPES.amount },
        { columnHead: "Physical Count", path: "physical_count", columnType: COLUMNTYPES.function,
            function:(item : any) => {
                const physical_count = Number(item.physical_count || 0);
                const should_be = Number(item.should_be_inventory || 0);
                return(
                    <span className = {physical_count < should_be ? "text-red-500" : ""}>
                        {item.physical_count}
                    </span>
                )
            }
         },
        { columnHead: "Total Amount", path: "total_amount", columnType: COLUMNTYPES.amount},
        { columnHead: "Remarks", path: "item_remarks", columnType: COLUMNTYPES.string },
    ];

    const runAction = async (record: any, action: "review" | "post") => {
        const isConfirmed = await confirm({
            title,
            message: `Are you sure you want to ${action} this physical count?`,
        });
        if (!isConfirmed) return;

        const resp = action === "review"
            ? await reviewPhysicalCount(record.id)
            : await postPhysicalCount(record.id);

        if (resp?.error || resp?.errors) {
            toast.error(responseMessage(resp));
            return;
        }

        toast.success(`${title} ${action === "review" ? "reviewed" : "posted"}`);
        await onReload?.();
        modal.onClose();
    };

    return (
            <Modal
                size="xxl"
                title={`${modalType} ${title}`}
                isShowing={modal.isShowing}
                onClose={modal.onClose}
            >
                {selected && (
                    <>
                        <div className="grid grid-cols-4 gap-1 items-end">
                            <div className="col-span-3">
                                <Textfield label="Physical Count No." value={selected.physical_count_no ?? ""} disabled />
                            </div>
                            <div className="col-span-1 w-full flex justify-center">
                                <div className="scale-170 -translate-y-3">
                                    <Badge
                                        status={getStatusBadge(selected.status)}
                                        label={selected.status}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 items-end">                       
                            <Textfield label="Begin Date" value={formatDate(selected.begin_date)} disabled />
                            <Textfield label="Ending Date" value={formatDate(selected.ending_date)} disabled />
                            <Textfield label="Counted By" value={selected.counted_by ?? ""} disabled /> 
                        </div>

                        <TextArea label="Remarks" value={selected.remarks ?? ""} disabled />

                        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                            <Table
                                dataSet={viewItems}
                                columnSettings={physicalViewColumns}
                                smallText
                                dataKey="uniform_item_id"
                                fixed
                            />
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">  
                            <div className="text-xs text-gray-400">          
                                Showing {(viewItems.length ?? 0)}{" "}
                                {(viewItems?.length ?? 0) === 1 ? "item" : "items"}
                            </div>
                            <div className="flex items-center gap-2 pr-2 mr-2">
                                <span className="text-gray-400 text-xs">Total Amount:</span>
                                <span className="font-semibold text-sm">
                                {money(selected.items_sum_total_amount)}
                                </span>
                            </div>
                        </div>

                        <hr className="mt-6 pb-2 text-slate-300" />
                        <p>Report Log:</p>
                        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                            <Textfield label="Prepared By:" value={selected.prepared_by ?? ""} disabled />
                            <Textfield label="Date & Time" value={formatAuditDate(selected.created_at)} disabled />
                            <Textfield label="Reviewed By:" value={selected.reviewed_by ?? ""} disabled />
                            <Textfield label="Date & Time" value={formatAuditDate(selected.reviewed_at)} disabled />
                            <Textfield label="Posted By:" value={selected.posted_by ?? ""} disabled />                                                                                          
                            <Textfield label="Date  & Time" value={formatAuditDate(selected.posted_at)} disabled />
                            <Textfield label="Cancelled By:" value={selected.cancelled_by ?? ""} disabled />
                            <Textfield label="Date & Time" value={formatAuditDate(selected.cancelled_at)} disabled />
                        </div>
                        <TextArea label="Cancel Reason" value={selected.cancelled_reason ?? ""} disabled />
                        {(modalType === "Review" || modalType === "Post") && (
                        <div className="grid grid-cols-4 mt-4">
                            <div className="col-span-3"></div>

                            <div className="col-span-1 flex justify-end gap-2">
                                <Button
                                    label="Close"
                                    variant="secondary"
                                    onClick={modal.onClose}
                                />
                                <Button
                                    label={modalType === "Post" ? "Post" : "Review"}
                                    onClick={() => {
                                        if (modalType === "Review") {
                                            runAction(selected, "review");
                                        }
                                        if (modalType === "Post") {
                                            runAction(selected, "post");
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        )}
                    </>
                )}
            </Modal>
    );

}

export default PhysicalCountViewForm;