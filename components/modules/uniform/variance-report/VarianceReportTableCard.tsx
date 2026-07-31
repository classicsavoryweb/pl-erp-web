"use client";

import {
    cancelVariance,
    createVariance,
    exportVarianceDetails,
    exportVariances,
    getVariances,
    postVariance,
    previewVariance,
    reviewVariance,
} from "@/api/uniform/variance-report";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import {physicalCountDropdown} from "@/api/uniform/physical-count";
import ActionDropDown from "@/components/common/ActionDropDown";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import confirm from "@/components/common/Confirm";
import DropDownButtons from "@/components/common/DropDownButtons";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import FilterCard from "@/components/modules/cards/FilterCard";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useState , useEffect} from "react";
import { toast } from "react-toastify";
import Dropdown from "@/components/common/Dropdown";

interface TableCardProps {
    performPermission: string;
}


const title = "Variance Report";

const numberValue = (value: any) => Number(value || 0);

const today = () => new Date().toISOString().slice(0, 10);

const money = (value: any) => numberValue(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const inputClassName = "w-full min-h-10 rounded-md border-2 border-slate-300 bg-transparent p-2 text-right focus:border-slate-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800";
const textInputClassName = inputClassName.replace("text-right", "text-left");

const responseMessage = (resp: any) =>
    resp?.message ?? resp?.data?.message ?? "Unable to complete request.";

const formatAuditDate = (value?: string | null) =>
    value ? moment(value).format("MMMM DD, YYYY h:mm A") : "-";

const formatDate = (value?: string | null) =>
    value ? moment(value).format("MM/DD/YYYY") : "";



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



const VarianceReportTableCard = ({ performPermission }: TableCardProps) => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const formModal = useModal();
    const viewModal = useModal();
    const cancelModal = useModal();
    const [physicalCounts, setPhysicalCounts] = useState<any[]>([]);
    const [specialFilter, setSpecialFilter] = useState<string>("all");
    const [selected, setSelected] = useState<any>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [modalType, setModalType] = useState<"View" | "Review" | "Post">("View");
    const [showFilter , setShowFilter] = useState<boolean>(false);
    const [varianceForm, setVarianceForm] = useState({
        begin_date: today(),
        ending_date: today(),
        remarks: "",
        items: [] as any[],
    });

    const fetchRecords = () => {
        api.setLoading(true);

        getVariances({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
            .then((resp: any) => {
                if (resp?.error) {
                    toast.error(responseMessage(resp));
                    return;
                }

                api.setDataSet(resp.data ?? []);
                paginator.setPage(resp.current_page ?? 1);
                paginator.setPaginationData(resp);
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    };

    useAsyncEffect(fetchRecords, [paginator.reload, api.reload, filter.reload]);

    const openCreate = () => {
        setVarianceForm({
            begin_date:  physicalCounts[0].begin_date,
            ending_date: today(),
            remarks: "",
            items: [],
        });

        formModal.onOpen();
    };

    const loadPreview = async () => {
        if (!varianceForm.begin_date || !varianceForm.ending_date) {
            toast.error("Please select Begin Date and Ending Date.");
            return;
        }

        if(moment(varianceForm.ending_date).isBefore(moment(),"day")){
            toast.error("Ending date can`t be earlier than today");
            return;
        }

        if (!moment(varianceForm.ending_date).isAfter(moment(varianceForm.begin_date))) {
            toast.error("Ending date should be greater than Beginning date");
            return;
        }

        formModal.setLoading(true);

        try {
            const resp = await previewVariance({
                begin_date: varianceForm.begin_date,
                ending_date: varianceForm.ending_date,
                items: varianceForm.items,
            });

            if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));
                return;
            }

            setVarianceForm(prev => ({ ...prev, items: resp.items ?? [] }));
        } catch {
            toast.error("Error encountered");
        } finally {
            formModal.setLoading(false);
        }
    };

    useEffect(() => {
        const loadPhysicalCounts = async () => {
            const response = await physicalCountDropdown();

            setPhysicalCounts(response);

             if (response.length > 0) {
            setVarianceForm((prev) => ({
                ...prev,
                begin_date: response[0].begin_date,
                items: [],
            }));
        }
        };

        loadPhysicalCounts();
    }, []);

    const saveRecord = async () => {
        if (!varianceForm.items.length) {
            toast.error("Load items first.");
            return;
        }

        if (!varianceForm.remarks.trim()) {
            toast.error("Please fill up Overall Remarks.");
            return;
        }

        formModal.setLoading(true);

        try {
            const resp = await createVariance(varianceForm);

            if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));
                return;
            }

            toast.success(`${title} created`);
            formModal.onClose();
            api.triggerReload();
        } catch {
            toast.error("Error encountered");
        } finally {
            formModal.setLoading(false);
        }
    };

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
        viewModal.onClose();
        api.triggerReload();
    };

    const submitCancel = async () => {
        if (!cancelReason.trim() || !selected) {
            toast.error("Cancel reason is required.");
            return;
        }

        cancelModal.setLoading(true);
        const resp = await cancelVariance(selected.id, cancelReason);
        cancelModal.setLoading(false);

        if (resp?.error || resp?.errors) {
            toast.error(responseMessage(resp));
            return;
        }

        toast.success(`${title} cancelled`);
        cancelModal.onClose();
        setCancelReason("");
        api.triggerReload();
    };

    const downloadDetailedExport = async (record: any) => {
        const resp = await exportVarianceDetails(record.id);
        const payload = resp?.data ?? resp;
        const isBlob = payload instanceof Blob;
        const isArrayBuffer = payload && payload.byteLength !== undefined;

        if (!resp || resp.error || (!isBlob && !isArrayBuffer)) {
            toast.error(resp?.data?.message || resp?.message || "Export failed. Please try again.");
            return;
        }

        const blob = isBlob ? payload : new Blob([payload], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = downloadUrl;
        anchor.download = `VARIANCE-DETAILED-${record.variance_no}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };

    const actionsFor = (record: any) => [
        {
            label: "View",
            onClick: () => {
                setModalType('View');
                setSelected(record);
                viewModal.onOpen();
            },
        },
        {
            label: "Detailed Export",
            onClick: () => downloadDetailedExport(record),
        },
        record.status === "Unposted" && {
            label: "Review",
            permission: performPermission,
            
            onClick: () => {
                setModalType("Review");
                setSelected(record);
                viewModal.onOpen();
            },
        },
        record.status === "Reviewed" && {
            label: "Post",
            permission: performPermission,
            onClick: () => {
                setModalType("Post");
                setSelected(record);
                viewModal.onOpen();
            },
        },
        ["Unposted", "Reviewed"].includes(record.status) && {
            label: "Cancel",
            permission: performPermission,
            onClick: () => {
                setSelected(record);
                setCancelReason("");
                cancelModal.onOpen();
            },
        },
    ].filter(Boolean) as any[];

    const columns = [
        { columnHead: "Variance No.", path: "variance_no", columnType: COLUMNTYPES.string },
        { columnHead : "Covered Date" , path : "" , columnType:COLUMNTYPES.function,
            function:(data : any) => {
                const begin_date = data.begin_date ? moment(data.begin_date).format("MM/DD/YYYY") : "-";
                const ending_date = data.ending_date ? moment(data.ending_date).format("MM/DD/YYYY") : "-";
                return `${begin_date} To ${ending_date}`;
            }
        
        },
        // { columnHead: "Posted Date", path: "posted_at", columnType:COLUMNTYPES.function,
        //     function:(data : any) => 
        //         data.posted_at ? moment(data.posted_at).format("MM/DD/YYYY") : "-",
        // },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (record: any) => (
                <Badge
                    status={getStatusBadge(record.status)}
                    label={record.status}
                />
            ),
        },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
            function: (record: any) => <ActionDropDown data={record} actions={actionsFor(record)} />,
        },
    ];

    const filterColumns = [
        { columnHead: "Variance No.", path: "variance_no" },
        { columnHead: "Physical Count No.", path: "physical_count.physical_count_no" },
        { columnHead: "Status", path: "status" },
        { columnHead: "Prepared By", path: "prepared_by" },
        { columnHead: "Reviewed By", path: "reviewed_by" },
        { columnHead: "Posted By", path: "posted_by" },
        { columnHead: "Cancelled By", path: "cancelled_by" },
    ];

    const statusOptions = [
        { label: "Unposted", value: "Unposted" },
        { label: "Reviewed", value: "Reviewed" },
        { label: "Posted", value: "Posted" },
        { label: "Cancelled", value: "Cancelled" },
    ];

    const updateVarianceItem = (index: number, key: string, value: any) => {
        setVarianceForm(prev => ({
            ...prev,
            items: prev.items.map((item, itemIndex) => {
                if (itemIndex !== index) return item;

                const next = { ...item, [key]: value };
                const variance = numberValue(next.variance);
                const adjustment = numberValue(next.adjustment);
                const finalVariance = variance + adjustment;

                return {
                    ...next,
                    final_variance: finalVariance,
                    total_variance_cost: finalVariance * numberValue(next.standard_cost),
                };
            }),
        }));
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
    ];

   const specialFilters = [
        {
            label: "All Items",
            value: "all",
        },
        {
            label: "Items with Negative Variance",
            value: "negative",
        },
        {
            label: "Items with Positive Variance",
            value: "positive",
        },
       
    ];

    const filteredVarianceItems = varianceForm.items
        .map((item: any, index: number) => ({
            ...item,
            originalIndex: index,
        }))
        .filter((item: any) => {
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

    const filteredItems = viewItems.filter((item: any) => {
        if (specialFilter === "all") {
            return true;
        }

        if (specialFilter === "negative") {
            return Number(item.variance) < 0;
        }

        if (specialFilter === "positive") {
            return Number(item.variance) > 0;
        }

        if (specialFilter === "adjustment") {
            return Number(item.adjustment) !== 0;
        }

        return true;
    });

    const totalVarianceCost = viewItems.reduce(
        (sum:number,item : any) => sum + (Number(item.total_variance_cost) || 0), 0
    );
    return (
        <>
            <FilterCard
                columnSettings={filterColumns}
                filterHandler={filter}
                withStatus
                statusOption={statusOptions}
                hasDateRange
                dateLabel="Variance Date"
                defaultColumnSelected="variance_no"
                hasExport
                api={exportVariances}
                exportFileName={`VARIANCE-REPORT-${moment().format("YYYY-MM-DD")}.xls`}
                callBack={() => paginator.setPage(1)}
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons actions={[{ label: `Generate ${title}`, onClick: openCreate }]} />
                </div>

                <Table
                    dataSet={api.dataSet}
                    columnSettings={columns}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <Modal
                size="entireScreen"
                title={`Generate ${title}`}
                isShowing={formModal.isShowing}
                loading={formModal.loading}
                onClose={formModal.onClose}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                       <SearchableDropDown
                            label="Beginning Inventory"
                            name="begin_date"
                            value={varianceForm.begin_date}
                            options={physicalCounts.map((pc: any) => ({
                                label: pc.begin_date,
                                value: pc.begin_date,
                            }))}
                            onChange={(event: any) => {
                                setVarianceForm((prev) => ({
                                    ...prev,
                                    begin_date: event.target.value,
                                    items: [],
                                }));
                            }}
                        />
                        <Textfield
                            label="Ending Inventory"
                            type="date"
                            required
                            value={varianceForm.ending_date ?? ""}
                            onChange={(e: any) =>
                                setVarianceForm((prev) => ({
                                    ...prev,
                                    ending_date: e.target.value,
                                    items: [],
                                }))
                            }
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <Textfield
                            label="Overall Remarks"
                            required
                            value={varianceForm.remarks}
                            onChange={(e: any) =>
                                setVarianceForm((prev) => ({
                                    ...prev,
                                    remarks: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

               <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">
                        <span>Request Data</span>
                    </div>

                    <div className="flex items-end gap-3">
                        {showFilter && (
                        <div className="w-80">
                            <SearchableDropDown
                                label="Special Filter"
                                name="special_filter"
                                value={specialFilter}
                                options={specialFilters}
                                onChange={(event: any) => {
                                    setSpecialFilter(event.target.value);
                                }}
                            />
                        </div>
                        )}
                        <div className="w-[140px] font-semibold">
                            <Button 
                                type="button"
                                label="Generate Data"
                                onClick={() => {
                                    loadPreview();
                                    setShowFilter(true);
                                }}
                                
                            />
                        </div>
                    </div>
                </div>

                <VarianceItemsTable items={filteredVarianceItems} 
                    editable 
                    onChange={(index: number, key: string, value: any) =>
                        updateVarianceItem(
                            filteredVarianceItems[index].originalIndex,
                            key,
                            value
                        )
                    } />

                <div className="flex justify-end gap-x-2 mt-3">
                    <div className="w-[120px]"><Button label="Submit" onClick={saveRecord} /></div>
                </div>
            </Modal>

            <Modal
                size="entireScreen"
                title={`${modalType} ${title}`}
                isShowing={viewModal.isShowing}
                onClose={viewModal.onClose}
            >
                {selected && (
                    <>
                        <div className="grid grid-cols-5 gap-1 items-end">
                            <div className= "col-span-2">
                            <Textfield label="Variance No." value={selected.variance_no ?? ""} disabled />
                            </div>
                            <div className="col-span-2">
                            <Textfield label="Physical Count No." value={selected.physical_count?.physical_count_no ?? ""} disabled /> 
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
                            {/* <Textfield label="Status" value={selected.status ?? ""} disabled /> */}
                            <SearchableDropDown
                                label="Special Filter"
                                name="special_filter"
                                value={specialFilter}
                                options={[
                                    { label: "All Items", value: "all" },
                                    { label: "Items with Negative Variance", value: "negative" },
                                    { label: "Items with Positive Variance", value: "positive" },
                                    { label: "Items with Adjustment", value: "adjustment" },
                                ]}
                                onChange={(event: any) => {
                                    setSpecialFilter(event.target.value);
                                }}
                            /> 
                        </div>
                        <Textfield label="Remarks" value={selected.remarks ?? ""} disabled />

                       
               
                        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                            <Table
                                dataSet={filteredItems}
                                columnSettings={varianceViewColumns}
                                smallText
                                dataKey="uniform_item_id"
                                fixed
                            />
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                            <div className="text-xs text-gray-400">
                                Showing {viewItems.length}{" "}
                                {viewItems.length === 1 ? "item" : "items"}
                            </div>

                            <div className="flex items-center gap-2 pr-2 mr-2">
                                <span className="text-gray-400 text-xs">Total Variance Cost:</span>
                                <span className= "font-semibold text-sm">
                                {totalVarianceCost.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}</span>
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
                            <Textfield label="Date & Time" value={formatAuditDate(selected.posted_at)} disabled />
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
                                    onClick={viewModal.onClose}
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

            <Modal
                size="md"
                title={`Cancel ${title}`}
                isShowing={cancelModal.isShowing}
                loading={cancelModal.loading}
                onClose={cancelModal.onClose}
            >
                <TextArea label="Cancel Reason" placeholder="Enter cancel reason" value={cancelReason} onChange={(e: any) => setCancelReason(e.target.value)} required />
                <div className="flex justify-end gap-x-2 mt-3">
                    <div className="w-[120px]"><Button label="Cancel" variant="secondary" onClick={cancelModal.onClose} /></div>
                    <div className="w-[120px]"><Button label="Submit" onClick={submitCancel} /></div>
                </div>
            </Modal>
        </>
    );
};

const VarianceItemsTable = ({
    items,
    editable = false,
    onChange,
}: {
    items: any[];
    editable?: boolean;
    onChange?: (index: number, key: string, value: any) => void;
}) => (
    <div>
        <div className="overflow-auto max-h-[60vh] relative">
            <table className="table-auto w-full border-collapse dark:text-slate-200 dark:bg-neutral-800">
                <thead className="sticky top-0 z-20 text-xs">
                    <tr>
                        {["Item Code", "Description", "Beginning", "Purch Dept", "Made Order", "ATD", "Free", "Should Be", "Physical", "Variance", "Adjustment", "Final Variance", "Standard Cost", "Variance Cost", "Reason"].map(header => (
                            <th key={header} className="p-3 bg-red-800 text-left text-zinc-100">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className= "text-xs">
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={15} className="w- border-1 border-slate-300 dark:border-neutral-700` p-2 text-center">
                                <EmptyState />
                                <p>No data available...</p>
                            </td>
                        </tr>
                    )}
                    {items.map((item, index) => (
                        <tr key={item.uniform_item_id ?? index}>
                            <td className="w-10 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{item.item_no}</td>
                            <td className="w max-w py-[10px] px-2 border border-slate-300 dark:border-neutral-700 truncate">{item.description}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.beginning_inventory)}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.purchasing_department)}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.made_to_order)}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.atd)}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.free_uniform)}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.should_be_inventory)}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.physical_count)}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.variance)}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">
                                {editable ? (
                                    <input className={inputClassName} type="number" value={item.adjustment ?? 0} onChange={(e) => onChange?.(index, "adjustment", e.target.value)} />
                                ) : money(item.adjustment)}
                            </td>
                           <td
                                className={`w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ${
                                    Number(item.final_variance) > 0
                                        ? "text-green-600 font-semibold"
                                        : Number(item.final_variance) < 0
                                        ? "text-red-600 font-semibold"
                                        : ""
                                }`}
                            >
                                ({money(item.final_variance)})
                            </td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.standard_cost)}</td>
                            <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.total_variance_cost)}</td>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">
                                {editable ? (
                                    <input className={textInputClassName} value={item.reason_of_adjustment ?? ""} onChange={(e) => onChange?.(index, "reason_of_adjustment", e.target.value)} />
                                ) : item.reason_of_adjustment ?? "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-1 text-xs text-gray-400">
            Showing {items.length} {items.length === 1 ? "item" : "items"}
        </div>
    </div>
);

export default VarianceReportTableCard;
