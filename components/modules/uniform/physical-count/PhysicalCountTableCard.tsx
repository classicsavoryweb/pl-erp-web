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
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useState } from "react";
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
    const [selected, setSelected] = useState<any>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [physicalForm, setPhysicalForm] = useState({
        begin_date: today(),
        ending_date: today(),
        counted_by: "",
        counted_by_employee: null as any,
        remarks: "",
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
        setPhysicalForm({
            begin_date: today(),
            ending_date: today(),
            counted_by: "",
            counted_by_employee: null,
            remarks: "",
            items: [],
        });
        formModal.onOpen();
    };

    const loadPreview = async () => {
        formModal.setLoading(true);

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

            setPhysicalForm(prev => ({ ...prev, items: resp.items ?? [] }));
        } catch {
            toast.error("Error encountered");
        } finally {
            formModal.setLoading(false);
        }
    };

    const saveRecord = async () => {
        if (!physicalForm.items.length) {
            toast.error("Load items first.");
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
        { columnHead: "Physical Count", path: "physical_count", columnType: COLUMNTYPES.amount },
        { columnHead: "Remarks", path: "item_remarks", columnType: COLUMNTYPES.string },
    ];

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
                onClose={formModal.onClose}
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

                <div className="flex mt-4 font-semibold border-b border-slate-300 pb-1 mb-1 items-center justify-between">
                    <span>Request Data</span>
                    <button
                        type="button"
                        className="text-sm font-medium text-red-800 hover:text-red-700 hover:underline cursor-pointer"
                        onClick={loadPreview}
                    >
                        Generate Data
                    </button>
                </div>

                <PhysicalCountItemsTable items={physicalForm.items} editable onChange={updatePhysicalItem} />

                <div className="flex justify-end gap-x-2 mt-3">
                    <div className="w-[120px]"><Button label="Submit" onClick={saveRecord} /></div>
                </div>
            </Modal>

            <Modal
                size="lg"
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
                        </div>

                        <TextArea label="Remarks" value={selected.remarks ?? ""} disabled />

                        <div className="mt-3">
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
    <div className="overflow-auto max-h-[55vh]">
        <table className="table-auto w-full text-[12px] dark:text-slate-200">
            <thead className="bg-red-800 text-white">
                <tr>
                    {["Item Code", "Description", "UOM", "Beginning", "Purchases", "Outgoing", "Should Be", "Physical Count", "Remarks"].map(header => (
                        <th key={header} className="p-2 border border-slate-300 text-left whitespace-nowrap">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {items.length === 0 && (
                    <tr>
                        <td colSpan={9} className="w-full p-2 text-center">
                            <EmptyState />
                            <p>No data available...</p>
                        </td>
                    </tr>
                )}
                {items.map((item, index) => (
                    <tr key={item.uniform_item_id ?? index}>
                        <td className="p-2 border border-slate-300">{item.item_no}</td>
                        <td className="p-2 border border-slate-300 min-w-[220px]">{item.description}</td>
                        <td className="p-2 border border-slate-300">{item.uom ?? "-"}</td>
                        <td className="p-2 border border-slate-300 text-right">{money(item.beginning_inventory)}</td>
                        <td className="p-2 border border-slate-300 text-right">{money(item.total_purchases)}</td>
                        <td className="p-2 border border-slate-300 text-right">{money(item.total_outgoing)}</td>
                        <td className="p-2 border border-slate-300 text-right">{money(item.should_be_inventory)}</td>
                        <td className="p-2 border border-slate-300 min-w-[130px]">
                            {editable ? (
                                <input className={inputClassName} type="number" min="0" value={item.physical_count ?? 0} onChange={(e) => onChange?.(index, "physical_count", e.target.value)} />
                            ) : money(item.physical_count)}
                        </td>
                        <td className="p-2 border border-slate-300 min-w-[180px]">
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
