"use client";

import { getPhysicalCounts } from "@/api/uniform/physical-count";
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
import { useState } from "react";
import { toast } from "react-toastify";

interface TableCardProps {
    performPermission: string;
}

const title = "Variance Report";

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

const VarianceReportTableCard = ({ performPermission }: TableCardProps) => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const formModal = useModal();
    const viewModal = useModal();
    const cancelModal = useModal();
    const [selected, setSelected] = useState<any>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [postedPhysicalCounts, setPostedPhysicalCounts] = useState<any[]>([]);
    const [varianceForm, setVarianceForm] = useState({
        physical_count_id: "",
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
            physical_count_id: "",
            remarks: "",
            items: [],
        });

        getPhysicalCounts({ status: "Posted", per_page: 1000 })
            .then((resp: any) => setPostedPhysicalCounts(resp?.data ?? []))
            .catch(() => toast.error("Unable to load posted physical counts."));

        formModal.onOpen();
    };

    const selectedPhysicalCount = postedPhysicalCounts.find(
        (record) => record.id == varianceForm.physical_count_id
    )

    const loadPreview = async () => {
        formModal.setLoading(true);

        try {
            const resp = await previewVariance({
                physical_count_id: varianceForm.physical_count_id,
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

    const saveRecord = async () => {
        if (!varianceForm.items.length) {
            toast.error("Load items first.");
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
        { columnHead: "Variance No.", path: "variance_no", columnType: COLUMNTYPES.string },
        { columnHead: "Physical Count No.", path: "physical_count.physical_count_no", columnType: COLUMNTYPES.string },
        { columnHead: "Begin Date", path: "begin_date", columnType: COLUMNTYPES.date },
        { columnHead: "Ending Date", path: "ending_date", columnType: COLUMNTYPES.date },
        { columnHead: "Posted Date", path: "posted_at", columnType:COLUMNTYPES.date},
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
                size="xxl"
                title={`Generate ${title}`}
                isShowing={formModal.isShowing}
                loading={formModal.loading}
                onClose={formModal.onClose}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                        <p className="mb-[-2px]">
                            Physical Count<span className="text-red-400">*</span>
                        </p>
                        <select
                            className="w-full h-[40px] rounded-md border-2 border-slate-300 bg-transparent p-2 focus:border-slate-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
                            value={varianceForm.physical_count_id}
                            onChange={(e) =>
                                setVarianceForm((prev) => ({
                                    ...prev,
                                    physical_count_id: e.target.value,
                                    items: [],
                                }))
                            }
                        >
                            <option value="">Select posted physical count</option>
                            {postedPhysicalCounts.map((record) => (
                                <option key={record.id} value={record.id}>
                                    {record.physical_count_no}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Textfield
                            label="Begin Date"
                            type="date"
                            disabled
                            value={
                                selectedPhysicalCount
                                    ? moment(selectedPhysicalCount.begin_date).format("YYYY-MM-DD")
                                    : ""
                            }
                        />
                        <Textfield
                            label="End Date"
                            type="date"
                            disabled
                            value={
                                selectedPhysicalCount
                                    ? moment(selectedPhysicalCount.ending_date).format("YYYY-MM-DD")
                                    : ""
                            }
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <TextArea
                            label="Remarks"
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

                <div className="flex mt-4 font-semibold pb-1 mb-1 items-center justify-between">
                    <span>Request Data</span>
                    <div>
                        <Button 
                            type="button"
                            label="Generate Data"
                            onClick={loadPreview}
                        />
                    </div>
                </div>

                <VarianceItemsTable items={varianceForm.items} editable onChange={updateVarianceItem} />

                <div className="flex justify-end gap-x-2 mt-3">
                    <div className="w-[120px]"><Button label="Submit" onClick={saveRecord} /></div>
                </div>
            </Modal>

            <Modal
                size="xxl"
                title={`View ${title}`}
                isShowing={viewModal.isShowing}
                onClose={viewModal.onClose}
            >
                {selected && (
                    <>
                        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                            <Textfield label="Variance No." value={selected.variance_no ?? ""} disabled />
                            <Textfield label="Physical Count No." value={selected.physical_count?.physical_count_no ?? ""} disabled />
                            <Textfield label="Status" value={selected.status ?? ""} disabled />
                            <Textfield label="Begin Date" value={formatDate(selected.begin_date)} disabled />
                            <Textfield label="Ending Date" value={formatDate(selected.ending_date)} disabled />
                        </div>

                        <TextArea label="Remarks" value={selected.remarks ?? ""} disabled />

                        <div className="max-h-[500px] overflow-y-auto overflox-x-auto rounded-md">
                            <Table
                                dataSet={viewItems}
                                columnSettings={varianceViewColumns}
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

const VarianceItemsTable = ({
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
                    {["Item Code", "Description", "Beginning", "Purch Dept", "Made Order", "ATD", "Free", "Should Be", "Physical", "Variance", "Adjustment", "Final Variance", "Standard Cost", "Variance Cost", "Reason"].map(header => (
                        <th key={header} className="p-3 bg-red-800 text-left text-zinc-100">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
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
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{item.item_no}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{item.description}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.beginning_inventory)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.purchasing_department)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.made_to_order)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.atd)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.free_uniform)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.should_be_inventory)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.physical_count)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.variance)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">
                            {editable ? (
                                <input className={inputClassName} type="number" value={item.adjustment ?? 0} onChange={(e) => onChange?.(index, "adjustment", e.target.value)} />
                            ) : money(item.adjustment)}
                        </td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.final_variance)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.standard_cost)}</td>
                        <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.total_variance_cost)}</td>
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
);

export default VarianceReportTableCard;
