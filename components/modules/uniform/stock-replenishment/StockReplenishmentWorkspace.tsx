"use client";

import {
    cancelReceiving,
    cancelReplenishment,
    createReceiving,
    createReplenishment,
    getReceivableReplenishments,
    getReceivings,
    getReplenishments,
    getStockOptions,
    postReceiving,
    postReplenishment,
    reviewReceiving,
    reviewReplenishment,
} from "@/api/uniform/stock-replenishment";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import confirm from "@/components/common/Confirm";
import ActionDropDown from "@/components/common/ActionDropDown";
import DropDownButtons from "@/components/common/DropDownButtons";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import Table from "@/components/common/Table";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import FilterCard from "@/components/modules/cards/FilterCard";
import SearchEmployeeDropDown from "@/components/modules/generic/SearchEmployeeDropDown";
import { COLUMNTYPES } from "@/constants/column";
import { AuthContext } from "@/context/AuthProvider";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";

export type StockModule = "requests" | "receiving";

const today = () => new Date().toISOString().slice(0, 10);

const createEmptyRequest = () => ({
    supplier_id: "",
    replenishment_type: "Purchasing Department",
    requested_date: today(),
    remarks: "",
    items: [] as any[],
});

const createEmptyReceiving = () => ({
    replenishment_id: "",
    date_received: today(),
    crf_no: "",
    document_no: "",
    checker_employee: null as any,
    checker_name: "",
    transmitted_by: "",
    remarks: "",
    items: [] as any[],
});

const lineInputClassName = [
    "w-full min-h-10 rounded-md border-2 border-slate-300 bg-transparent p-2",
    "focus:border-slate-400 focus:outline-none",
    "dark:border-neutral-700 dark:bg-neutral-800",
].join(" ");

const numericLineInputClassName = `${lineInputClassName} text-right`;

const messageOf = (response: any) =>
    response?.data?.message ?? response?.message ?? "Unable to complete the request.";

const formatAuditDate = (value?: string | null) =>
    value ? moment(value).format("MMMM DD, YYYY h:mm A") : "-";

const formatDate = (value?: string | null) =>
    value ? moment(value).format("YYYY-MM-DD") : "";

interface StockReplenishmentWorkspaceProps {
    module: StockModule;
    performPermission: string;
}

const StockReplenishmentWorkspace = ({
    module,
    performPermission,
}: StockReplenishmentWorkspaceProps) => {
    const { permissions } = useContext(AuthContext);
    const canPerform = permissions.includes(performPermission);
    const api = useApiCall();
    const filter = useFilter();
    const paginator = usePagination();
    const [submitting, setSubmitting] = useState(false);
    const [receivable, setReceivable] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [requestForm, setRequestForm] = useState(createEmptyRequest);
    const [receivingForm, setReceivingForm] = useState(createEmptyReceiving);
    const [requestItemId, setRequestItemId] = useState("");
    const [requestOpen, setRequestOpen] = useState(false);
    const [receivingOpen, setReceivingOpen] = useState(false);
    const [cancelTarget, setCancelTarget] = useState<{ kind: StockModule; record: any } | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelSubmitting, setCancelSubmitting] = useState(false);
    const [detail, setDetail] = useState<any>(null);
    const [detailType, setDetailType] = useState<StockModule>(module);

    useAsyncEffect(() => {
        api.setLoading(true);
        const recordsRequest = module === "requests"
            ? getReplenishments({
                page: paginator.page,
                per_page: paginator.per_page,
                ...filter.filters,
            })
            : getReceivings({
                page: paginator.page,
                per_page: paginator.per_page,
                ...filter.filters,
            });
        const receivableRequest = module === "receiving"
            ? getReceivableReplenishments()
            : Promise.resolve({ error: false, data: [] });

        Promise.all([getStockOptions(), recordsRequest, receivableRequest])
            .then(([options, records, receivableData]) => {
                if (options.error || records.error || receivableData.error) {
                    toast.error("Error fetching stock replenishment records");
                    return;
                }
                setSuppliers(options.data.suppliers ?? []);
                setItems(options.data.items ?? []);
                api.setDataSet(records.data.data ?? []);
                paginator.setPage(records.data.current_page);
                paginator.setPaginationData(records.data);
                setReceivable(receivableData.data ?? []);
            })
            .catch(() => toast.error("Error fetching stock replenishment records"))
            .finally(() => api.setLoading(false));
    }, [module, paginator.reload, api.reload, filter.reload]);

    const selectedSupplier = suppliers.find(
        (supplier) => String(supplier.id) === String(requestForm.supplier_id)
    );

    const availableItems = useMemo(() => {
        if (!selectedSupplier) return [];
        const linked = items.filter((item) =>
            item.suppliers?.some(
                (supplier: any) => supplier.vendor_no === selectedSupplier.vendor_number
            )
        );
        return linked.length ? linked : items;
    }, [items, selectedSupplier]);

    const runAction = async (title: string, action: () => Promise<any>) => {
        const accepted = await confirm({ title, message: `Are you sure you want to ${title.toLowerCase()}?` });
        if (!accepted) return;
        const response = await action();
        if (response.error) {
            toast.error(messageOf(response));
            return;
        }
        toast.success(response.data.message);
        api.triggerReload();
    };

    const closeCancelModal = () => {
        setCancelTarget(null);
        setCancelReason("");
    };

    const closeRequestModal = () => {
        setRequestOpen(false);
        setRequestForm(createEmptyRequest());
        setRequestItemId("");
    };

    const closeReceivingModal = () => {
        setReceivingOpen(false);
        setReceivingForm(createEmptyReceiving());
    };

    const submitCancellation = async () => {
        const reason = cancelReason.trim();
        if (!cancelTarget || !reason) {
            toast.error("Cancel reason is required.");
            return;
        }

        const accepted = await confirm({
            title: cancelTarget.kind === "requests" ? "Cancel Request" : "Cancel Receiving",
            message: "Are you sure you want to cancel this record?",
        });
        if (!accepted) return;

        setCancelSubmitting(true);
        try {
            const response = cancelTarget.kind === "requests"
                ? await cancelReplenishment(cancelTarget.record.id, reason)
                : await cancelReceiving(cancelTarget.record.id, reason);

            if (response.error) {
                toast.error(messageOf(response));
                return;
            }

            toast.success(response.data.message);
            closeCancelModal();
            api.triggerReload();
        } catch {
            toast.error("Error encountered");
        } finally {
            setCancelSubmitting(false);
        }
    };

    const addRequestItem = (itemId: string) => {
        const item = items.find((record) => String(record.id) === String(itemId));
        if (!itemId) {
            toast.error("Description is required.");
            return;
        }
        if (!item) return;
        if (requestForm.items.some((record) => record.uniform_item_id === item.id)) {
            toast.error("Item description already exists.");
            return;
        }
        const supplierPrice = item.suppliers?.find(
            (supplier: any) => supplier.vendor_no === selectedSupplier?.vendor_number
        )?.unit_price;
        setRequestForm((form) => ({
            ...form,
            items: [...form.items, {
                uniform_item_id: item.id,
                item,
                requested_qty: Number(item.minimum_rpl ?? 1),
                approved_qty: Number(item.minimum_rpl ?? 1),
                unit_price: Number(supplierPrice ?? item.standard_unit_price ?? 0),
                remarks: "",
            }],
        }));
        setRequestItemId("");
    };

    const updateRequestItem = (index: number, field: string, value: string) => {
        setRequestForm((form) => ({
            ...form,
            items: form.items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const submitRequest = async () => {
        if (!requestForm.supplier_id || requestForm.items.length === 0) {
            toast.error("Supplier and at least one item are required.");
            return;
        }

        const hasInvalidItem = requestForm.items.some((item) =>
            Number(item.requested_qty) <= 0 ||
            Number(item.approved_qty) <= 0 ||
            Number(item.unit_price) < 0
        );
        if (hasInvalidItem) {
            toast.error("Requested and approved quantities must be greater than zero, and unit price cannot be negative.");
            return;
        }

        const accepted = await confirm({
            title: "Create Replenishment Request",
            message: "Are you sure you want to create this request?",
        });
        if (!accepted) return;

        setSubmitting(true);
        try {
            const response = await createReplenishment(requestForm);
            if (response.error) {
                toast.error(messageOf(response));
                return;
            }
            toast.success(response.data.message);
            closeRequestModal();
            api.triggerReload();
        } catch {
            toast.error("Error encountered");
        } finally {
            setSubmitting(false);
        }
    };

    const selectReceivingRequest = (requestId: string) => {
        const request = receivable.find((record) => String(record.id) === String(requestId));
        setReceivingForm((form) => ({
            ...form,
            replenishment_id: requestId,
            transmitted_by: request?.supplier?.vendor_name ?? "",
            items: (request?.items ?? []).map((item: any) => ({
                replenishment_item_id: item.id,
                item: item.item,
                remaining_qty: Number(item.remaining_qty),
                quantity: Number(item.remaining_qty),
                unit_price: Number(item.unit_price),
                remarks: "",
            })),
        }));
    };

    const updateReceivingItem = (index: number, field: string, value: string) => {
        setReceivingForm((form) => ({
            ...form,
            items: form.items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const submitReceiving = async () => {
        const payload = {
            ...receivingForm,
            items: receivingForm.items.filter((item) => Number(item.quantity) > 0),
        };
        if (!payload.replenishment_id || !payload.crf_no || !payload.document_no ||
            !payload.checker_name || payload.items.length === 0) {
            toast.error("Complete the receiving details and enter at least one received quantity.");
            return;
        }

        const hasInvalidItem = payload.items.some((item) =>
            Number(item.quantity) <= 0 ||
            Number(item.quantity) > Number(item.remaining_qty) ||
            Number(item.unit_price) < 0
        );
        if (hasInvalidItem) {
            toast.error("Receiving quantities must be within the remaining quantity, and unit price cannot be negative.");
            return;
        }

        const accepted = await confirm({
            title: "Create Receiving",
            message: "Are you sure you want to create this receiving transaction?",
        });
        if (!accepted) return;

        setSubmitting(true);
        try {
            const response = await createReceiving(payload);
            if (response.error) {
                toast.error(messageOf(response));
                return;
            }
            toast.success(response.data.message);
            closeReceivingModal();
            api.triggerReload();
        } catch {
            toast.error("Error encountered");
        } finally {
            setSubmitting(false);
        }
    };

    const renderStatus = (record: any) => {
        let status: "default" | "success" | "warning" | "danger" = "default";

        switch (record.status) {
            case "Posted":
            case "Fully Received":
                status = "success";
                break;
            case "Cancelled":
                status = "danger";
                break;
            case "Reviewed":
            case "Partially Received":
                status = "warning";
                break;
        }

        return <Badge label={record.status} status={status} />;
    };

    const requestColumns = [
        { columnHead: "Request No.", path: "request_no", columnType: COLUMNTYPES.string },
        { columnHead: "Date", path: "requested_date", columnType: COLUMNTYPES.date },
        { columnHead: "Supplier", path: "supplier.vendor_name", columnType: COLUMNTYPES.string },
        { columnHead: "Type", path: "replenishment_type", columnType: COLUMNTYPES.string },
        { columnHead: "Amount", path: "total_amount", columnType: COLUMNTYPES.amount },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: renderStatus,
        },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
            function: (record: any) => {
                const actions: any[] = [{
                    label: "View",
                    onClick: () => {
                        setDetail(record);
                        setDetailType("requests");
                    },
                }];

                if (record.status === "Unposted") {
                    actions.push({
                        label: "Review",
                        permission: performPermission,
                        onClick: () => runAction(
                            "Review request",
                            () => reviewReplenishment(record.id)
                        ),
                    });
                }

                if (record.status === "Reviewed") {
                    actions.push({
                        label: "Post",
                        permission: performPermission,
                        onClick: () => runAction(
                            "Post request",
                            () => postReplenishment(record.id)
                        ),
                    });
                }

                if (["Unposted", "Reviewed"].includes(record.status)) {
                    actions.push({
                        label: "Cancel",
                        permission: performPermission,
                        onClick: () => setCancelTarget({ kind: "requests", record }),
                    });
                }

                return <ActionDropDown data={record} actions={actions} />;
            },
        },
    ];

    const receivingColumns = [
        { columnHead: "Receiving No.", path: "receiving_no", columnType: COLUMNTYPES.string },
        { columnHead: "Request No.", path: "replenishment.request_no", columnType: COLUMNTYPES.string },
        { columnHead: "Date Received", path: "date_received", columnType: COLUMNTYPES.date },
        { columnHead: "CRF No.", path: "crf_no", columnType: COLUMNTYPES.string },
        { columnHead: "Document No.", path: "document_no", columnType: COLUMNTYPES.string },
        { columnHead: "Amount", path: "total_amount", columnType: COLUMNTYPES.amount },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: renderStatus,
        },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
            function: (record: any) => {
                const actions: any[] = [{
                    label: "View",
                    onClick: () => {
                        setDetail(record);
                        setDetailType("receiving");
                    },
                }];

                if (record.status === "Unposted") {
                    actions.push({
                        label: "Review",
                        permission: performPermission,
                        onClick: () => runAction(
                            "Review receiving",
                            () => reviewReceiving(record.id)
                        ),
                    });
                }

                if (record.status === "Reviewed") {
                    actions.push({
                        label: "Post",
                        permission: performPermission,
                        onClick: () => runAction(
                            "Post receiving",
                            () => postReceiving(record.id)
                        ),
                    });
                }

                if (["Unposted", "Reviewed"].includes(record.status)) {
                    actions.push({
                        label: "Cancel",
                        permission: performPermission,
                        onClick: () => setCancelTarget({ kind: "receiving", record }),
                    });
                }

                return <ActionDropDown data={record} actions={actions} />;
            },
        },
    ];

    const detailItems = detail?.items ?? [];
    const requestTotal = requestForm.items.reduce(
        (total, item) => total + Number(item.approved_qty || 0) * Number(item.unit_price || 0),
        0
    );
    const receivingTotal = receivingForm.items.reduce(
        (total, item) => total + Number(item.quantity || 0) * Number(item.unit_price || 0),
        0
    );

    return (
        <>
            <FilterCard
                columnSettings={module === "requests"
                    ? [
                        { columnHead: "Request Number", path: "request_no", columnType: COLUMNTYPES.string },
                        { columnHead: "Supplier", path: "supplier", columnType: COLUMNTYPES.string },
                    ]
                    : [
                        { columnHead: "Receiving Number", path: "receiving_no", columnType: COLUMNTYPES.string },
                        { columnHead: "Request Number", path: "request_no", columnType: COLUMNTYPES.string },
                        { columnHead: "CRF Number", path: "crf_no", columnType: COLUMNTYPES.string },
                        { columnHead: "Document Number", path: "document_no", columnType: COLUMNTYPES.string },
                    ]}
                filterHandler={filter}
                defaultColumnSelected={module === "requests" ? "request_no" : "receiving_no"}
                callBack={() => paginator.setPage(1)}
                withStatus
                statusOption={module === "requests"
                    ? [
                        { label: "Unposted", value: "Unposted" },
                        { label: "Reviewed", value: "Reviewed" },
                        { label: "Posted", value: "Posted" },
                        { label: "Partially Received", value: "Partially Received" },
                        { label: "Fully Received", value: "Fully Received" },
                        { label: "Cancelled", value: "Cancelled" },
                    ]
                    : [
                        { label: "Unposted", value: "Unposted" },
                        { label: "Reviewed", value: "Reviewed" },
                        { label: "Posted", value: "Posted" },
                        { label: "Cancelled", value: "Cancelled" },
                    ]}
            />
            <Card>
                {canPerform && (
                    <div className="flex justify-end gap-x-3">
                        <DropDownButtons actions={[{
                            label: module === "requests"
                                ? "Create replenishment request"
                                : "Create receiving transaction",
                            onClick: () => module === "requests"
                                ? setRequestOpen(true)
                                : setReceivingOpen(true),
                        }]} />
                    </div>
                )}
                <Table
                    dataSet={api.dataSet ?? []}
                    columnSettings={module === "requests" ? requestColumns : receivingColumns}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <Modal
                isShowing={cancelTarget !== null}
                title={cancelTarget?.kind === "receiving" ? "Cancel Receiving" : "Cancel Request"}
                onClose={closeCancelModal}
                size="md"
            >
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        submitCancellation();
                    }}
                >
                    <TextArea
                        label="Cancel Reason"
                        placeholder="Enter cancel reason"
                        name="cancel_reason"
                        value={cancelReason}
                        onChange={(event: any) => setCancelReason(event.target.value)}
                    />
                    <hr className="mt-6 pb-2 text-slate-300" />
                    <div className="flex justify-end">
                        <div className="w-1/2 flex justify-end items-center gap-x-2">
                            <Button
                                label="Cancel"
                                variant="secondary"
                                onClick={closeCancelModal}
                            />
                            <Button
                                type="submit"
                                label="Submit"
                                loading={cancelSubmitting}
                                onClick={() => {}}
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal isShowing={requestOpen} title="New Replenishment Request"
                onClose={closeRequestModal} size="xxl">
                <form onSubmit={(event) => {
                    event.preventDefault();
                    submitRequest();
                }}>
                    <SearchableDropDown
                        label="Supplier"
                        placeholder="select supplier"
                        name="supplier_id"
                        value={requestForm.supplier_id}
                        required
                        onChange={(event) => {
                            setRequestForm({
                                ...requestForm,
                                supplier_id: event.target.value,
                                items: [],
                            });
                            setRequestItemId("");
                        }}
                        options={suppliers.map((supplier) => ({
                            label: supplier.vendor_name,
                            value: String(supplier.id),
                        }))}
                    />
                    <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                        <Dropdown
                            label="Request Type"
                            placeholder="select request type"
                            name="replenishment_type"
                            value={requestForm.replenishment_type}
                            required
                            onChange={(event) => setRequestForm({
                                ...requestForm,
                                replenishment_type: event.target.value,
                            })}
                            options={[
                                { label: "Purchasing Department", value: "Purchasing Department" },
                                { label: "Made to Order", value: "Made to Order" },
                            ]}
                        />
                        <Textfield
                            label="Requested Date"
                            name="requested_date"
                            type="date"
                            value={requestForm.requested_date}
                            required
                            onChange={(event) => setRequestForm({
                                ...requestForm,
                                requested_date: event.target.value,
                            })}
                        />
                        <Textfield
                            label="Status"
                            name="status"
                            value="Unposted"
                            disabled
                        />
                        <Textfield
                            label="Total"
                            name="total_amount"
                            value={requestTotal.toFixed(2)}
                            disabled
                        />
                    </div>
                    <div className="flex mt-4 font-semibold border-b border-slate-300 pb-1 mb-1 items-center justify-between">
                        <span>Request Items</span>
                        <button
                            type="button"
                            className="text-sm font-medium text-red-800 hover:text-red-700 hover:underline cursor-pointer"
                            onClick={() => addRequestItem(requestItemId)}
                        >
                            Add Request
                        </button>
                    </div>
                    <SearchableDropDown
                        label="Description"
                        placeholder="select description"
                        name="uniform_item_id"
                        value={requestItemId}
                        disabled={!requestForm.supplier_id}
                        onChange={(event) => setRequestItemId(event.target.value)}
                        options={availableItems.map((item) => ({
                            label: `${item.item_no} - ${item.description} (${item.size?.description ?? ""})`,
                            value: String(item.id),
                        }))}
                    />
                    <LineEditor
                        items={requestForm.items}
                        mode="request"
                        onChange={updateRequestItem}
                        onRemove={(index: number) => setRequestForm((form) => ({
                            ...form,
                            items: form.items.filter((_, itemIndex) => itemIndex !== index),
                        }))}
                    />
                    <TextArea
                        label="Remarks"
                        name="remarks"
                        value={requestForm.remarks}
                        onChange={(event) => setRequestForm({
                            ...requestForm,
                            remarks: event.target.value,
                        })}
                    />
                    <ModalFooter loading={submitting} onCancel={closeRequestModal} />
                </form>
            </Modal>

            <Modal isShowing={receivingOpen} title="Receive Stock"
                onClose={closeReceivingModal} size="xxl">
                <form onSubmit={(event) => {
                    event.preventDefault();
                    submitReceiving();
                }}>
                    <SearchableDropDown
                        label="Replenishment Request"
                        placeholder="select posted request"
                        name="replenishment_id"
                        value={receivingForm.replenishment_id}
                        required
                        onChange={(event) => selectReceivingRequest(event.target.value)}
                        options={receivable.map((record) => ({
                            label: `${record.request_no} - ${record.supplier?.vendor_name ?? ""}`,
                            value: String(record.id),
                        }))}
                    />
                    <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                        <Textfield
                            label="Date Received"
                            name="date_received"
                            type="date"
                            value={receivingForm.date_received}
                            required
                            onChange={(event) => setReceivingForm({
                                ...receivingForm,
                                date_received: event.target.value,
                            })}
                        />
                        <SearchEmployeeDropDown
                            label="Checker"
                            placeholder="select employee"
                            name="checker_employee"
                            value={receivingForm.checker_employee}
                            required
                            status="active"
                            onChange={(event: any) => {
                                const employee = event.target.value;
                                const checkerName = employee?.full_name
                                    ?? [employee?.first_name, employee?.middle_name, employee?.last_name]
                                        .filter(Boolean)
                                        .join(" ");

                                setReceivingForm({
                                    ...receivingForm,
                                    checker_employee: employee,
                                    checker_name: checkerName,
                                });
                            }}
                        />
                        <Textfield
                            label="CRF Number"
                            name="crf_no"
                            value={receivingForm.crf_no}
                            required
                            onChange={(event) => setReceivingForm({
                                ...receivingForm,
                                crf_no: event.target.value,
                            })}
                        />
                        <Textfield
                            label="Document Number"
                            name="document_no"
                            value={receivingForm.document_no}
                            required
                            onChange={(event) => setReceivingForm({
                                ...receivingForm,
                                document_no: event.target.value,
                            })}
                        />
                        <Textfield
                            label="Transmitted By"
                            name="transmitted_by"
                            value={receivingForm.transmitted_by}
                            onChange={(event) => setReceivingForm({
                                ...receivingForm,
                                transmitted_by: event.target.value,
                            })}
                        />
                        <Textfield
                            label="Total"
                            name="total_amount"
                            value={receivingTotal.toFixed(2)}
                            disabled
                        />
                    </div>
                    <div className="flex mt-4 font-semibold border-b border-slate-300 pb-1 mb-1 items-center justify-between">
                        <span>Receiving Items</span>
                    </div>
                    <LineEditor
                        items={receivingForm.items}
                        mode="receiving"
                        onChange={updateReceivingItem}
                    />
                    <TextArea
                        label="Remarks"
                        name="remarks"
                        value={receivingForm.remarks}
                        onChange={(event) => setReceivingForm({
                            ...receivingForm,
                            remarks: event.target.value,
                        })}
                    />
                    <ModalFooter loading={submitting} onCancel={closeReceivingModal} />
                </form>
            </Modal>

            <Modal isShowing={Boolean(detail)}
                title={detailType === "requests" ? "View Request" : "View Receiving"}
                onClose={() => setDetail(null)} size="lg">
                {detailType === "requests" ? (
                    <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                        <Textfield
                            label="Request Number"
                            value={detail?.request_no ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Status"
                            value={detail?.status ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Supplier"
                            value={detail?.supplier?.vendor_name ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Request Type"
                            value={detail?.replenishment_type ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Requested Date"
                            value={formatDate(detail?.requested_date)}
                            disabled
                        />
                        <Textfield
                            label="Total"
                            value={Number(detail?.total_amount ?? 0).toFixed(2)}
                            disabled
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                        <Textfield
                            label="Receiving Number"
                            value={detail?.receiving_no ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Request Number"
                            value={detail?.replenishment?.request_no ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Supplier"
                            value={detail?.supplier?.vendor_name ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Status"
                            value={detail?.status ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Date Received"
                            value={formatDate(detail?.date_received)}
                            disabled
                        />
                        <Textfield
                            label="Checker"
                            value={detail?.checker_name ?? ""}
                            disabled
                        />
                        <Textfield
                            label="CRF Number"
                            value={detail?.crf_no ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Document Number"
                            value={detail?.document_no ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Transmitted By"
                            value={detail?.transmitted_by ?? ""}
                            disabled
                        />
                        <Textfield
                            label="Total"
                            value={Number(detail?.total_amount ?? 0).toFixed(2)}
                            disabled
                        />
                    </div>
                )}
                <TextArea
                    label="Remarks"
                    value={detail?.remarks ?? ""}
                    disabled
                />
                <Table dataSet={detailItems} columnSettings={[
                    { columnHead: "Item", path: "item.description", columnType: COLUMNTYPES.string },
                    {
                        columnHead: detailType === "requests" ? "Approved" : "Received",
                        path: detailType === "requests" ? "approved_qty" : "quantity",
                        columnType: COLUMNTYPES.amount,
                    },
                    ...(detailType === "requests" ? [{
                        columnHead: "Remaining", path: "remaining_qty", columnType: COLUMNTYPES.amount,
                    }] : []),
                    { columnHead: "Unit Price", path: "unit_price", columnType: COLUMNTYPES.amount },
                    { columnHead: "Remarks", path: "remarks", columnType: COLUMNTYPES.string },
                ]} />
                <hr className="mt-6 pb-2 text-slate-300" />
                <p>Report Log:</p>
                <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                    <Textfield
                        label="Prepared By:"
                        value={detail?.prepared_by ?? ""}
                        disabled
                    />
                    <Textfield
                        label="Date & Time"
                        value={formatAuditDate(detail?.created_at)}
                        disabled
                    />
                    <Textfield
                        label="Reviewed By:"
                        value={detail?.reviewed_by ?? ""}
                        disabled
                    />
                    <Textfield
                        label="Date & Time"
                        value={formatAuditDate(detail?.reviewed_at)}
                        disabled
                    />
                    <Textfield
                        label="Posted By:"
                        value={detail?.posted_by ?? ""}
                        disabled
                    />
                    <Textfield
                        label="Date & Time"
                        value={formatAuditDate(detail?.posted_at)}
                        disabled
                    />
                    <Textfield
                        label="Cancelled By:"
                        value={detail?.cancelled_by ?? ""}
                        disabled
                    />
                    <Textfield
                        label="Date & Time"
                        value={formatAuditDate(detail?.cancelled_at)}
                        disabled
                    />
                </div>
                <TextArea
                    label="Cancel Reason"
                    value={detail?.cancelled_reason ?? ""}
                    disabled
                />
            </Modal>

        </>
    );
};

const ModalFooter = ({ loading, onCancel }: any) => (
    <>
        <hr className="mt-6 pb-2 text-slate-300" />
        <div className="flex justify-end">
            <div className="w-1/2 flex justify-end items-center gap-x-2">
                <Button label="Cancel" variant="secondary" onClick={onCancel} />
                <Button
                    type="submit"
                    label="Submit"
                    loading={loading}
                    onClick={() => {}}
                />
            </div>
        </div>
    </>
);

const LineEditor = ({ items, mode, onChange, onRemove }: any) => (
    <div className="my-3 overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-sm">
            <thead className="bg-red-800 text-white">
                <tr>
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-right">Stock</th>
                    {mode === "request" && <th className="p-2 text-right">Requested</th>}
                    {mode === "request" && <th className="p-2 text-right">Approved</th>}
                    {mode === "receiving" && <th className="p-2 text-right">Remaining</th>}
                    {mode === "receiving" && <th className="p-2 text-right">Receiving Now</th>}
                    <th className="p-2 text-right">Unit Price</th>
                    <th className="p-2 text-left">Remarks</th>
                    {mode === "request" && <th className="w-20 p-2 text-left">Action</th>}
                </tr>
            </thead>
            <tbody>
                {items.length === 0 && (
                    <tr>
                        <td
                            colSpan={mode === "request" ? 7 : 6}
                            className="border p-4 text-center text-slate-500"
                        >
                            No items selected.
                        </td>
                    </tr>
                )}
                {items.map((line: any, index: number) => (
                    <tr className="align-middle" key={line.uniform_item_id ?? line.replenishment_item_id}>
                        <td className="border border-slate-300 p-2">
                            {line.item?.item_no} - {line.item?.description}
                        </td>
                        <td className="border border-slate-300 p-2 text-right">
                            {Number(line.item?.stock_on_hand ?? 0).toLocaleString()}
                        </td>
                        {mode === "request" && (
                            <td className="border border-slate-300 p-1">
                                <input type="number" min="0.01" step="0.01" className={numericLineInputClassName}
                                    value={line.requested_qty}
                                    onChange={(event) => onChange(index, "requested_qty", event.target.value)} />
                            </td>
                        )}
                        {mode === "request" && (
                            <td className="border border-slate-300 p-1">
                                <input type="number" min="0.01" step="0.01" className={numericLineInputClassName}
                                    value={line.approved_qty}
                                    onChange={(event) => onChange(index, "approved_qty", event.target.value)} />
                            </td>
                        )}
                        {mode === "receiving" && (
                            <td className="border border-slate-300 p-2 text-right">
                                {Number(line.remaining_qty).toLocaleString()}
                            </td>
                        )}
                        {mode === "receiving" && (
                            <td className="border border-slate-300 p-1">
                                <input type="number" min="0" max={line.remaining_qty} step="0.01" className={numericLineInputClassName}
                                    value={line.quantity}
                                    onChange={(event) => onChange(index, "quantity", event.target.value)} />
                            </td>
                        )}
                        <td className="border border-slate-300 p-1">
                            <input type="number" min="0" step="0.01" className={numericLineInputClassName}
                                value={line.unit_price}
                                onChange={(event) => onChange(index, "unit_price", event.target.value)} />
                        </td>
                        <td className="border border-slate-300 p-1">
                            <input className={lineInputClassName} value={line.remarks}
                                onChange={(event) => onChange(index, "remarks", event.target.value)} />
                        </td>
                        {mode === "request" && (
                            <td className="border border-slate-300 p-2">
                                <button
                                    type="button"
                                    className="font-medium text-red-800 hover:text-red-700 hover:underline cursor-pointer"
                                    onClick={() => onRemove(index)}
                                >
                                    Remove
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default StockReplenishmentWorkspace;
