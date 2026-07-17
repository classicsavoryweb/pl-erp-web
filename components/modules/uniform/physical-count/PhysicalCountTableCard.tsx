"use client";

import {
    cancelPhysicalCount,
    createPhysicalCount,
    exportPhysicalCountDetails,
    exportPhysicalCounts,
    getPhysicalCounts,
    postPhysicalCount,
    previewPhysicalCount,
    reviewPhysicalCount,
} from "@/api/uniform/physical-count";
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
import SearchEmployeeDropDown from "@/components/modules/generic/SearchEmployeeDropDown";
import { COLUMNTYPES } from "@/constants/column";
import * as XLSX from "xlsx";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

interface TableCardProps {
    performPermission: string;
}

const title = "Physical Count";
const today = () => new Date().toISOString().slice(0, 10);

const numberValue = (value: any) => Number(value || 0);

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
    value ? moment(value).format("YYYY-MM-DD") : "";

const statusBadge = (status: string) => {
    let badgeStatus: "default" | "success" | "warning" | "danger" = "default";
    if (status === "Posted") badgeStatus = "success";
    if (status === "Reviewed") badgeStatus = "warning";
    if (status === "Cancelled") badgeStatus = "danger";

    return <Badge label={status} status={badgeStatus} />;
};

const PhysicalCountTableCard = ({ performPermission }: TableCardProps) => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const formModal = useModal();
    const viewModal = useModal();
    const cancelModal = useModal();
    const importInputRef = useRef<HTMLInputElement | null>(null);
    const [selected, setSelected] = useState<any>(null);
    const [hasGeneratedData, setHasGeneratedData] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [physicalForm, setPhysicalForm] = useState({
        begin_date: today(),
        ending_date: today(),
        counted_by: "",
        counted_by_employee: null as any,
        remarks: "",
        total_sales: 0,
        items: [] as any[],
    });

    const fetchRecords = () => {
        api.setLoading(true);

        getPhysicalCounts({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
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
        const lastRecord = api.dataSet?.[0];

        setPhysicalForm({
            begin_date: lastRecord?.ending_date ?? today(),
            ending_date:  today(),
            counted_by: "",
            counted_by_employee: null,
            remarks: "",
            total_sales: 0,
            items: [],
        });

        formModal.onOpen();
    };

    const loadPreview = async () => {
        if (physicalForm.begin_date > physicalForm.ending_date) {
            toast.error("Begin date cannot be later than ending date");
            return;
        }

        setPhysicalForm(prev => ({
            ...prev,
            items: [],
            total_sales: 0,
        }));

        try {
            const resp = await previewPhysicalCount({
                begin_date: physicalForm.begin_date,
                ending_date: physicalForm.ending_date,
                items: physicalForm.items,
            });

            if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));
                return;
            }

            const previewItems = resp?.items?.items ?? [];

            setPhysicalForm(prev => ({
                ...prev,
                items: previewItems,
                total_sales: resp?.items?.total_sales ?? 0,
            }));

            if (previewItems.length === 0) {
                toast.info("No data found");
                return;
            }

            toast.success("Physical count preview loaded successfully");

        } catch {
            toast.error("Error encountered");
        }
    };

    const saveRecord = async () => {
        if (!physicalForm.items.length) {
            toast.error("Load items first.");
            return;
        }

        if(!physicalForm.counted_by){
            toast.error("Counted By required!")
            return;
        }

        formModal.setLoading(true);

        try {
            const resp = await createPhysicalCount({
                begin_date: physicalForm.begin_date,
                ending_date: physicalForm.ending_date,
                counted_by: physicalForm.counted_by,
                remarks: physicalForm.remarks,
                items: physicalForm.items,
            });

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
        api.triggerReload();
    };

    const loadPreviewData = async () => {
        await loadPreview();
        setHasGeneratedData(true);
    };

    const submitCancel = async () => {
        if (!cancelReason.trim() || !selected) {
            toast.error("Cancel reason is required.");
            return;
        }

        cancelModal.setLoading(true);
        const resp = await cancelPhysicalCount(selected.id, cancelReason);
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
        const resp = await exportPhysicalCountDetails(record.id);
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
        anchor.download = `PHYSICAL-COUNT-DETAILED-${record.physical_count_no}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };

    const downloadTemplate = () => {
        const data = physicalForm.items.map((item) => ({
            "ID": item.uniform_item_id,
            "Item Code": item.item_no,
            "Item Description": item.description,
            "Standard UOM": item.uom,
            "Beginning Inventory": item.beginning_inventory,
            "Total Purchases": item.total_purchases,
            "Total Outgoing": item.total_outgoing,
            "Should be Inventory": item.should_be_inventory,
            "Physical Count": "",
            "Item Remarks": "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Physical Count"
        );

        XLSX.writeFile(
            workbook,
            "physical-count-template.xlsx"
        );
    };

    const handleDownloadTemplate = () => {
        if (!physicalForm.items || physicalForm.items.length === 0) {
            toast.warning("Please generate the data first before downloading the template.");
            return;
        }

        downloadTemplate();
    };

   const handleImportItems = async (file?: File) => {
        if (!file) return;

        if (!hasGeneratedData || physicalForm.items.length === 0) {
            toast.warning("Please generate the data first before importing.");
            return;
        }

        try {
            const buffer = await file.arrayBuffer();

            const workbook = XLSX.read(buffer);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const data = XLSX.utils.sheet_to_json<any>(worksheet);

            for (const row of data) {
                const originalItem = physicalForm.items.find(
                    (item) => item.uniform_item_id === row["ID"]
                );

                if (!originalItem) {
                    toast.error(`Invalid Item ID: ${row["ID"]}`);
                    return;
                }

                if (
                    row["Item Code"] !== originalItem.item_no ||
                    row["Item Description"] !== originalItem.description ||
                    row["Standard UOM"] !== originalItem.uom ||
                    Number(row["Beginning Inventory"] ?? 0) !== Number(originalItem.beginning_inventory) ||
                    Number(row["Total Purchases"] ?? 0) !== Number(originalItem.total_purchases) ||
                    Number(row["Total Outgoing"] ?? 0) !== Number(originalItem.total_outgoing) ||
                    Number(row["Should be Inventory"] ?? 0) !== Number(originalItem.should_be_inventory)
                ) {
                    toast.error(
                        `Generated data was modified for Item ID ${row["ID"]}. Only Physical Count and Item Remarks can be edited.`
                    );
                    return;
                }
            }


            const importedItems = data.map((row) => {
                const originalItem = physicalForm.items.find(
                    (item) => item.uniform_item_id === row["ID"]
                );
                return {
                    ...originalItem,

                    physical_count: Number(row["Physical Count"] ?? 0),
                    item_remarks: row["Item Remarks"] ?? "",
                };
            });


            setPhysicalForm(prev => ({
                ...prev,
                items: importedItems,
            }));

            toast.success("Items imported successfully");

        } catch (error) {
            console.error(error);
            toast.error("Failed to import Excel file");
        } finally {
            if (importInputRef.current) {
                importInputRef.current.value = "";
            }
        }
    };

    const actionsFor = (record: any) => [
        {
            label: "View",
            onClick: () => {
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
            onClick: () => runAction(record, "review"),
        },
        record.status === "Reviewed" && {
            label: "Post",
            permission: performPermission,
            onClick: () => runAction(record, "post"),
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
        { columnHead: "Physical Count No.", path: "physical_count_no", columnType: COLUMNTYPES.string },
        { columnHead: "Begin Date", path: "begin_date", columnType: COLUMNTYPES.date },
        { columnHead: "Ending Date", path: "ending_date", columnType: COLUMNTYPES.date },
        { columnHead: "Counted By", path: "counted_by", columnType: COLUMNTYPES.string },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (record: any) => statusBadge(record.status),
        },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
            function: (record: any) => <ActionDropDown data={record} actions={actionsFor(record)} />,
        },
    ];

    const filterColumns = [
        { columnHead: "Physical Count No.", path: "physical_count_no" },
        { columnHead: "Counted By", path: "counted_by" },
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

    const updatePhysicalItem = (index: number, key: string, value: any) => {
        setPhysicalForm(prev => ({
            ...prev,
            items: prev.items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [key]: value } : item
            ),
        }));
    };

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

    

    const actionbutton = [
        {
            label : "Generate Data",
            onClick : async () => {
                await loadPreview();
                setHasGeneratedData(true);
            }
        },
        {
            label: "Download Template",
            onClick : handleDownloadTemplate,
        },
        {
            label: "Import Data",
            onClick: () => importInputRef.current?.click()
        }
    ]


    return (
        <>
            <FilterCard
                columnSettings={filterColumns}
                filterHandler={filter}
                withStatus
                statusOption={statusOptions}
                hasDateRange
                dateLabel="Physical Count Date"
                defaultColumnSelected="physical_count_no"
                hasExport
                api={exportPhysicalCounts}
                exportFileName={`PHYSICAL-COUNT-${moment().format("YYYY-MM-DD")}.xls`}
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
                size="xxl"
                title={`Generate ${title}`}
                isShowing={formModal.isShowing}
                loading={formModal.loading}
                onClose={() => {formModal.onClose(); setHasGeneratedData(false);  }}
            >
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-2">
                    <Textfield label="Begin Date" type="date" value={physicalForm.begin_date} onChange={(e) => setPhysicalForm(prev => ({ ...prev, begin_date: e.target.value }))} required />
                    <Textfield label="Ending Date" type="date" value={physicalForm.ending_date} onChange={(e) => setPhysicalForm(prev => ({ ...prev, ending_date: e.target.value }))} required />
                    <SearchEmployeeDropDown
                        label="Counted By"
                        placeholder="select employee"
                        name="counted_by_employee"
                        value={physicalForm.counted_by_employee}
                        status="active"
                        required
                        onChange={(event: any) => {
                            const employee = event.target.value;
                            const employeeName = employee?.proper_full_name
                                ?? employee?.full_name
                                ?? [employee?.first_name, employee?.middle_name, employee?.last_name]
                                    .filter(Boolean)
                                    .join(" ");

                            setPhysicalForm(prev => ({
                                ...prev,
                                counted_by_employee: employee,
                                counted_by: employeeName,
                            }));
                        }}
                    />
                    
                    
                </div>
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-2">
                    <TextArea label="Remarks" value={physicalForm.remarks} onChange={(e: any) => setPhysicalForm(prev => ({ ...prev, remarks: e.target.value }))} />
                </div>

                <div className="flex mt-4 font-semibold pb-1 mb-1 items-center justify-between">
                    <span>Request Data</span>
                    <div className="flex items-center gap-2">
                       <input
                            ref={importInputRef}
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls"
                            onChange={(event) => handleImportItems(event.target.files?.[0])}
                        />
                        <DropDownButtons actions={actionbutton} />

                    </div>
                </div>

                <PhysicalCountItemsTable items={physicalForm.items} editable onChange={updatePhysicalItem} />

                <div className="flex justify-end gap-x-2 mt-3">
                    <div className="w-[120px]"><Button label="Submit" onClick={saveRecord} /></div>
                </div>
            </Modal>

            <Modal
                size="xl"
                title={`View ${title}`}
                isShowing={viewModal.isShowing}
                onClose={viewModal.onClose}
            >
                {selected && (
                    <>
                        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                            <Textfield label="Physical Count No." value={selected.physical_count_no ?? ""} disabled />
                            <Textfield label="Status" value={selected.status ?? ""} disabled />
                            <Textfield label="Counted By" value={selected.counted_by ?? ""} disabled />
                            <Textfield label="Begin Date" value={formatDate(selected.begin_date)} disabled />
                            <Textfield label="Ending Date" value={formatDate(selected.ending_date)} disabled />
                            <Textfield label ="Total Amount of all items" value={money(selected.items_sum_total_amount)} disabled />
                        </div>

                        <TextArea label="Remarks" value={selected.remarks ?? ""} disabled />

                        <div className="max-h-[500px] overflow-y-auto overflow-x-auto rounded-md">
                            <Table
                                dataSet={viewItems}
                                columnSettings={physicalViewColumns}
                                smallText
                                dataKey="uniform_item_id"
                            />
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

const PhysicalCountItemsTable = ({
    items,
    editable = false,
    onChange,
}: {
    items: any[];
    editable?: boolean;
    onChange?: (index: number, key: string, value: any) => void;
}) => (
    <div className="overflow-auto max-h-[60vh] relative">
        <table className="table-auto w-full border-collapse dark:text-slate-200 dark:bg-neutral-800">
            <thead className="sticky top-0 z-20">
                <tr>
                    {["Item Code", "Description", "UOM", "Beginning", "Purchases", "Outgoing", "Should Be", "Physical Count", "Remarks"].map(header => (
                        <th key={header} className="p-3 bg-red-800 text-left text-zinc-100">{header}</th>
                    ))}
                </tr>
            </thead>
            
            <tbody>
                {items.length === 0 && (
                    <tr>
                        <td colSpan={10} className="w- border-1 border-slate-300 dark:border-neutral-700` p-2 text-center">
                            <EmptyState />
                            <p>No data available...</p>
                        </td>
                    </tr>
                )}
                {items.map((item, index) => (
                    <tr key={item.uniform_item_id ?? index}>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{item.item_no}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{item.description}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{item.uom ?? "-"}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{money(item.beginning_inventory)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{money(item.total_purchases)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{money(item.total_outgoing)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{money(item.should_be_inventory)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">
                            {editable ? (
                                <input className={inputClassName} type="number" min="0" value={item.physical_count ?? 0} onChange={(e) => onChange?.(index, "physical_count", e.target.value)} />
                            ) : money(item.physical_count)}
                        </td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">
                            {editable ? (
                                <input className={textInputClassName} value={item.item_remarks ?? ""} onChange={(e) => onChange?.(index, "item_remarks", e.target.value)} />
                            ) : item.item_remarks ?? "-"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default PhysicalCountTableCard;
