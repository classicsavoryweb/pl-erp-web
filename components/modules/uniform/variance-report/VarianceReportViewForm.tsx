"use client";

import VarianceReportViewItem from "./VarianceReportViewItem"
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import TextArea from "@/components/common/TextArea";
import Badge from "@/components/common/Badge";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import Table from "@/components/common/Table";
import moment from "moment";
import {COLUMNTYPES} from "@/constants/column";
import {getVarianceById ,reviewVariance ,postVariance} from "@/api/uniform/variance-report";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { useApiCall } from "@/hooks/api-call";

interface Props {
    modal: any;
    modalType: string;
    title: string;
    selected: any; 
    specialFilter: string;
    setSpecialFilter: (value: string) => void;
    itemSearch: string;
    setItemSearch: (value: string) => void;
}

const VarianceReportViewForm = ({
    modal,
    modalType,
    title,
    selected,
    specialFilter,
    setSpecialFilter,
    itemSearch,
    setItemSearch,
  
    // runAction,
}: Props) => {
    const viewVarianceItemModal = useModal();
    const api = useApiCall();
    const [selectedItem , setSelectedItem] = useState<any>(null);

    const filteredItems = (selected?.items ?? []).filter((item: any) => {
        const search = itemSearch.toLowerCase().trim();

        const matchesSearch =
            !search ||
            item.item?.item_no?.toLowerCase().includes(search) ||
            item.item?.description?.toLowerCase().includes(search);

        if (!matchesSearch) {
            return false;
        }

        switch (specialFilter) {
            case "negative":
                return Number(item.variance) < 0;

            case "positive":
                return Number(item.variance) > 0;

            case "adjustment":
                return Number(item.adjustment ?? 0) !== 0;

            default:
                return true;
        }
    });

    const formatDate = (value?: string | null) =>
        value ? moment(value).format("MM/DD/YYYY") : "";

    const formatAuditDate = (value?: string | null) =>
        value ? moment(value).format("MMMM DD, YYYY h:mm A") : "-";

    const responseMessage = (resp: any) =>
        resp?.message ?? resp?.data?.message ?? "Unable to complete request.";

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

    const handleView = async (record: any) => {
        console.log("Selected Record:", record);

        try {
            const response = await getVarianceById(record.id);
            viewVarianceItemModal.onOpen();
            setSelectedItem(response.data);
            console.log("Variance Details:", response);

        } catch (error) {
            console.error("Error fetching variance:", error);
        }
    };
    const viewItems = selected?.items ?? [];
    const varianceViewColumns = [
        { columnHead: "Item Code", path: "item_no", columnType: COLUMNTYPES.string },
        { columnHead: "Description", path: "description", columnType: COLUMNTYPES.string },
        { columnHead: "Beginning", path: "beginning_inventory", columnType: COLUMNTYPES.amount },
        { columnHead: "Purch Dept", path: "purchasing_department", columnType: COLUMNTYPES.amount },
        { columnHead: "Made Order", path: "made_to_order", columnType: COLUMNTYPES.amount },
        { columnHead: "ATD", path: "atd", columnType: COLUMNTYPES.amount },
        { columnHead: "Free", path: "free_uniform", columnType: COLUMNTYPES.amount },
        { columnHead: "Should Be", path: "should_be_inventory", columnType: COLUMNTYPES.amount },
        { columnHead: "Physical", path: "physical_count", columnType: COLUMNTYPES.amount },
        { columnHead: "Variance", path: "variance", columnType: COLUMNTYPES.amount },
        { columnHead: "Adjustment", path: "adjustment", columnType: COLUMNTYPES.amount },
        { columnHead: "Final Variance", path: "final_variance", columnType: COLUMNTYPES.amount },
        { columnHead: "Standard Cost", path: "standard_cost", columnType: COLUMNTYPES.amount },
        { columnHead: "Variance Cost", path: "total_variance_cost", columnType: COLUMNTYPES.amount },
        { columnHead: "Reason", path: "reason_of_adjustment", columnType: COLUMNTYPES.string },
        {
            columnHead: "Action",
            path: "",
            columnType: COLUMNTYPES.function,
            function: (record:any) => (
                <Button 
                    label="View"
                    onClick={() => handleView(record)}>
                </Button>
            ),
        }
    ];

     const totalVarianceCost = viewItems.reduce(
        (sum:number,item : any) => sum + (Number(item.total_variance_cost) || 0), 0
    );

    const runAction = async (record: any, action: "review" | "post") => {
        const isConfirmed = await confirm({
            title,
            message: `Are you sure you want to ${action} this variance report?`,
        });
        if (!isConfirmed) return;

        const resp = action === "review"
            ? await reviewVariance(record.id)
            : await postVariance(record.id);

        if (resp?.error || resp?.errors) {
            toast.error(responseMessage(resp));
            return;
        }

        toast.success(`${title} ${action === "review" ? "reviewed" : "posted"}`);
        modal.onClose();
        api.triggerReload();
    };

    return (
            <>
                <Modal
                    size="entireScreen"
                    title={`${modalType} ${title}`}
                    isShowing={modal.isShowing}
                    onClose={modal.onClose}
                >

                {selected && (
                    <>
                        <div className="grid grid-cols-5 gap-1 items-end">

                            <div className="col-span-2">
                                <Textfield
                                    label="Variance No."
                                    value={selected.variance_no ?? ""}
                                    disabled
                                />
                            </div>

                            <div className="col-span-2">
                                <Textfield
                                    label="Physical Count No."
                                    value={selected.physical_count?.physical_count_no ?? ""}
                                    disabled
                                />
                            </div>

                            <div className="col-span-1 flex justify-center">
                                <div className="scale-170 -translate-y-3">
                                    <Badge
                                        status={getStatusBadge(selected.status)}
                                        label={selected.status}
                                    />
                                </div>
                            </div>

                        </div>


                        <div className="grid grid-cols-5 gap-1">

                            <div className="col-span-2">
                                <Textfield
                                    label="Begin Date"
                                    value={formatDate(selected.begin_date)}
                                    disabled
                                />
                            </div>

                            <div className="col-span-2">
                                <Textfield
                                    label="Ending Date"
                                    value={formatDate(selected.ending_date)}
                                    disabled
                                />
                            </div>

                        </div>


                        <Textfield
                            label="Remarks"
                            value={selected.remarks ?? ""}
                            disabled
                        />


                        <div className="grid grid-cols-4 gap-2">

                            <SearchableDropDown
                                label="Special Filter"
                                name="special_filter"
                                value={specialFilter}
                                options={[
                                    {label:"All Items", value:"all"},
                                    {label:"Items with Negative Variance", value:"negative"},
                                    {label:"Items with Positive Variance", value:"positive"},
                                    {label:"Items with Adjustment", value:"adjustment"},
                                ]}
                                onChange={(e:any)=>setSpecialFilter(e.target.value)}
                            />


                            <Textfield
                                label="Search Item"
                                value={itemSearch}
                                onChange={(e:any)=>setItemSearch(e.target.value)}
                            />

                        </div>


                        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">

                            <Table
                                dataSet={filteredItems}
                                columnSettings={varianceViewColumns}
                                smallText
                                dataKey="uniform_item_id"
                                fixed
                            />

                        </div>


                        <div className="flex justify-between mt-2">

                            <span className="text-xs text-gray-400">
                                Showing {viewItems.length} items
                            </span>


                            <div>
                                <span className="text-gray-400 text-xs">
                                    Total Variance Cost:
                                </span>

                                <span className="font-semibold ml-2">
                                    {totalVarianceCost.toLocaleString(undefined,{
                                        minimumFractionDigits:2,
                                        maximumFractionDigits:2
                                    })}
                                </span>

                            </div>

                        </div>


                        <hr className="mt-6 pb-2 text-slate-300"/>


                        <p>Report Log:</p>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            <Textfield
                                label="Prepared By:"
                                value={selected.prepared_by ?? ""}
                                disabled
                            />

                            <Textfield
                                label="Date & Time"
                                value={formatAuditDate(selected.created_at)}
                                disabled
                            />


                            <Textfield
                                label="Reviewed By:"
                                value={selected.reviewed_by ?? ""}
                                disabled
                            />

                            <Textfield
                                label="Date & Time"
                                value={formatAuditDate(selected.reviewed_at)}
                                disabled
                            />


                            <Textfield
                                label="Posted By:"
                                value={selected.posted_by ?? ""}
                                disabled
                            />

                            <Textfield
                                label="Date & Time"
                                value={formatAuditDate(selected.posted_at)}
                                disabled
                            />


                            <Textfield
                                label="Cancelled By:"
                                value={selected.cancelled_by ?? ""}
                                disabled
                            />

                            <Textfield
                                label="Date & Time"
                                value={formatAuditDate(selected.cancelled_at)}
                                disabled
                            />

                        </div>


                        <TextArea
                            label="Cancel Reason"
                            value={selected.cancelled_reason ?? ""}
                            disabled
                        />



                        {(modalType === "Review" || modalType === "Post") && (

                            <div className="flex justify-end gap-2 mt-4">

                                <Button
                                    label="Close"
                                    variant="secondary"
                                    onClick={modal.onClose}
                                />


                                <Button
                                    label={modalType === "Post" ? "Post" : "Review"}
                                    onClick={()=>{
                                        runAction(
                                            selected,
                                            modalType === "Post"
                                            ? "post"
                                            : "review"
                                        )
                                    }}
                                />

                            </div>

                        )}


                    </>
                )}

                </Modal>
                <VarianceReportViewItem
                    modal={viewVarianceItemModal}
                    formValue ={selectedItem}
                />
            </>
        );
    };


export default VarianceReportViewForm;