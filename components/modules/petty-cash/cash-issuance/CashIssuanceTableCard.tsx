"use client";

import Card from "@/components/common/Card";
import Accordion from "@/components/common/Accordion";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import Dropdown from "@/components/common/Dropdown";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useFilter } from "@/hooks/use-filter";
import { toast } from "react-toastify";
import { useState } from "react";
import moment from "moment";
import { getMyCustodianInfo } from "@/api/petty-cash/department-fund";
import { getAllCashIssuances, exportAllCashIssuances, getMyEmployees, getApproverEmployees, voidCashIssuance } from "@/api/petty-cash/cash-issuance";
import confirm from "@/components/common/Confirm";
import ActionDropDown from "@/components/common/ActionDropDown";
import DropDownButtons from "@/components/common/DropDownButtons";
import CreateCashIssuanceForm from "./CreateCashIssuanceForm";
import ViewCashIssuanceForm from "./ViewCashIssuanceForm";
import LiquidateModal from "./LiquidateModal";
import PrintCashIssuanceModal from "./PrintCashIssuanceModal";

const STATUS_OPTIONS = [
    { label: "Unliquidated", value: "Unliquidated" },
    { label: "Liquidated", value: "Liquidated" },
    { label: "Fully Liquidated", value: "Fully Liquidated" },
    { label: "Voided", value: "Voided" },
];

const CashIssuanceTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const createModal = useModal();
    const viewModal = useModal();
    const liquidateModal = useModal();
    const printModal = useModal();
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [viewModalMode, setViewModalMode] = useState<"view" | "void">("view");

    const [custodianInfo, setCustodianInfo] = useState<any>(null);
    const [custodianLoading, setCustodianLoading] = useState(true);
    const [custodianReload, setCustodianReload] = useState(0);
    const [filterRequesterEmployees, setFilterRequesterEmployees] = useState<any[]>([]);
    const [filterApproverEmployees, setFilterApproverEmployees] = useState<any[]>([]);

    const refreshCustodian = () => setCustodianReload((n) => n + 1);

    const [filterValues, setFilterValues] = useState({
        pcv_number: "",
        branch_id: "",
        status: "",
        date_from: "",
        date_to: "",
        requested_by: "",
        received_by: "",
        approved_by: "",
    });

    useAsyncEffect(() => {
        setCustodianLoading(true);
        Promise.all([
            getMyCustodianInfo(),
            getMyEmployees(),
            getApproverEmployees(),
        ])
            .then(([custodianResp, empResp, approverResp]) => {
                if (!custodianResp.error) setCustodianInfo(custodianResp.data);
                else setCustodianInfo(null);
                if (empResp && !empResp.error) setFilterRequesterEmployees(empResp.data?.employees ?? []);
                if (approverResp && !approverResp.error) setFilterApproverEmployees(approverResp.data?.employees ?? []);
            })
            .catch(() => toast.error("Error loading page data"))
            .finally(() => setCustodianLoading(false));
    }, [custodianReload]);

    useAsyncEffect(() => {
        if (!custodianInfo) return;
        api.setLoading(true);
        getAllCashIssuances({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
            .then((resp) => {
                if (!resp.error) {
                    const mapped = resp.data.data.map((item: any) => ({
                        ...item,
                        branch_name: item.branch?.name ?? "—",
                        requested_by_name: item.requested_by ? `${item.requested_by.last_name}, ${item.requested_by.first_name}` : "—",
                        received_by_name: item.received_by ? `${item.received_by.last_name}, ${item.received_by.first_name}` : "—",
                        approved_by_name: item.approved_by ? `${item.approved_by.last_name}, ${item.approved_by.first_name}` : "—",
                    }));
                    api.setDataSet(mapped);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                } else {
                    toast.error(resp.data?.message || "Error fetching cash issuances");
                }
            })
            .catch(() => toast.error("Error fetching cash issuances"))
            .finally(() => api.setLoading(false));
    }, [custodianInfo, paginator.reload, api.reload, filter.reload]);

    const handleSearch = () => {
        filter.setFilters(filterValues);
        filter.onReload();
        paginator.setPage(1);
    };

    const handleReset = () => {
        const empty = { pcv_number: "", branch_id: "", status: "", date_from: "", date_to: "", requested_by: "", received_by: "", approved_by: "" };
        setFilterValues(empty);
        filter.setFilters({});
        filter.onReload();
        paginator.setPage(1);
    };

    const handleExport = () => {
        exportAllCashIssuances(filter.filters)
            .then((resp: any) => {
                const payload = resp?.data ?? resp;
                if (resp?.error || !(payload instanceof Blob)) {
                    toast.error("Export failed");
                    return;
                }
                const url = window.URL.createObjectURL(payload);
                const a = document.createElement("a");
                a.href = url;
                a.download = `CASH-ISSUANCES-${moment().format("YYYY-MM-DD")}.xls`;
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => toast.error("Error encountered"));
    };

    const requesterOptions = filterRequesterEmployees.map((e: any) => ({
        label: `${e.last_name}, ${e.first_name}`,
        value: e.employee_number,
    }));

    const approverOptions = filterApproverEmployees.map((e: any) => ({
        label: `${e.last_name}, ${e.first_name}`,
        value: e.employee_number,
    }));

    const branchOptions = (custodianInfo?.branches ?? []).map((b: any) => ({
        label: b.name,
        value: b.id,
    }));

    const columnSettings = [
        { columnHead: "PCV Number", path: "pcv_number", columnType: COLUMNTYPES.string },
        { columnHead: "Date", path: "date", columnType: COLUMNTYPES.date },
        { columnHead: "Branch", path: "branch_name", columnType: COLUMNTYPES.string },
        { columnHead: "Requested By", path: "requested_by_name", columnType: COLUMNTYPES.string },
        { columnHead: "Received By", path: "received_by_name", columnType: COLUMNTYPES.string },
        { columnHead: "Approved By", path: "approved_by_name", columnType: COLUMNTYPES.string },
        { columnHead: "Cash Issuance Amount", path: "amount", columnType: COLUMNTYPES.amount },
        { columnHead: "Unliquidated Amount", path: "unliquidated_amount", columnType: COLUMNTYPES.amount },
        {
            columnHead: "Over/Under Amount",
            path: "overunder_amount",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                if (row.overunder_amount == null) return <span className="text-gray-400">—</span>;
                const val = Number(row.overunder_amount);
                const formatted = Math.abs(val).toLocaleString("en-PH", { style: "currency", currency: "PHP" });
                if (val === 0) return <span>{formatted}</span>;
                // under (val < 0): change returned → fund increased → positive/green
                // over  (val > 0): excess deducted → fund decreased → negative/red
                return val < 0
                    ? <span className="text-green-600 dark:text-green-400">+{formatted}</span>
                    : <span className="text-red-600 dark:text-red-400">-{formatted}</span>;
            },
        },
        { columnHead: "Status", path: "status", columnType: COLUMNTYPES.string },
        {
            columnHead: "Action",
            path: "action",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                const actions: any[] = [];
                if (row.status === "Unliquidated") {
                    actions.push({
                        label: "Print",
                        onClick: () => {
                            setSelectedRow(row);
                            printModal.onOpen();
                        },
                    });
                    actions.push({
                        label: "Liquidate",
                        onClick: () => {
                            setSelectedRow(row);
                            liquidateModal.onOpen();
                        },
                    });
                    actions.push({
                        label: "Void",
                        onClick: () => {
                            setSelectedRow(row);
                            setViewModalMode("void");
                            viewModal.onOpen();
                        },
                    });
                }
                actions.push({
                    label: "View",
                    onClick: () => {
                        setSelectedRow(row);
                        setViewModalMode("view");
                        viewModal.onOpen();
                    },
                });
                return <ActionDropDown data={row} actions={actions} />;
            },
        },
    ];

    if (custodianLoading && !custodianInfo) {
        return (
            <Card>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Loading...</p>
            </Card>
        );
    }

    if (!custodianInfo) {
        return (
            <Card>
                <div className="py-8 text-center">
                    <p className="text-lg font-semibold text-red-500">Access Denied</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                        You are not registered as an active petty cash custodian.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <>
            {/* Filters */}
            <Accordion title="Filters" isExpanded>
                <form className="pt-5" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <Grid cols={4}>
                        <Textfield
                            label="PCV Number"
                            placeholder="search PCV number"
                            name="pcv_number"
                            value={filterValues.pcv_number}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, pcv_number: e.target.value }))}
                        />
                        <Dropdown
                            label="Branch"
                            placeholder="all branches"
                            name="branch_id"
                            value={String(filterValues.branch_id)}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, branch_id: e.target.value }))}
                            options={[{ label: "All Branches", value: "" }, ...branchOptions]}
                        />
                        <Textfield
                            label="Date From"
                            name="date_from"
                            type="date"
                            value={filterValues.date_from}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, date_from: e.target.value }))}
                        />
                        <Textfield
                            label="Date To"
                            name="date_to"
                            type="date"
                            value={filterValues.date_to}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, date_to: e.target.value }))}
                        />
                        <Dropdown
                            label="Status"
                            placeholder="all statuses"
                            name="status"
                            value={filterValues.status}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, status: e.target.value }))}
                            options={[{ label: "All Statuses", value: "" }, ...STATUS_OPTIONS]}
                        />
                        <Dropdown
                            label="Requested By"
                            placeholder="all"
                            name="requested_by"
                            value={filterValues.requested_by}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, requested_by: e.target.value }))}
                            options={[{ label: "All", value: "" }, ...requesterOptions]}
                        />
                        <Dropdown
                            label="Received By"
                            placeholder="all"
                            name="received_by"
                            value={filterValues.received_by}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, received_by: e.target.value }))}
                            options={[{ label: "All", value: "" }, ...requesterOptions]}
                        />
                        <Dropdown
                            label="Approved By"
                            placeholder="all"
                            name="approved_by"
                            value={filterValues.approved_by}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, approved_by: e.target.value }))}
                            options={[{ label: "All", value: "" }, ...approverOptions]}
                        />
                    </Grid>
                    <div className="flex justify-between gap-x-2">
                        <div></div>
                        <div className="flex gap-x-1">
                            <Button
                                type="submit"
                                label="Search"
                                onClick={() => { }}
                                isIcon
                                iconType="search"
                            />
                            <Button
                                label="Export"
                                type="button"
                                onClick={handleExport}
                                variant="success"
                                isIcon
                                iconType="export"
                            />
                            <Button
                                label="Reset"
                                type="button"
                                onClick={handleReset}
                                variant="secondary"
                                isIcon
                                iconType="reset"
                            />
                        </div>
                    </div>
                </form>
            </Accordion>

            {/* Table */}
            <Card>
                <div className="grid grid-cols-12 items-center mb-3 text-sm">
                    <div className="col-span-4" />
                    <div className="col-span-3">
                        <p className="font-semibold text-gray-500">Total Cash Fund</p>
                        <p>{Number(custodianInfo.total_cash_fund).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</p>
                    </div>
                    <div className="col-span-3">
                        <p className="font-semibold text-gray-500">Remaining Cash Fund</p>
                        <p>{Number(custodianInfo.remaining_cash_fund).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</p>
                    </div>
                    <div className="col-span-2 flex justify-end">
                        <DropDownButtons
                            actions={[
                                {
                                    label: "Add Cash Issuance",
                                    onClick: () => createModal.onOpen(),
                                },
                            ]}
                        />
                    </div>
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <CreateCashIssuanceForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
                onRefreshCustodian={refreshCustodian}
                custodianBranches={custodianInfo?.branches ?? []}
            />
            <ViewCashIssuanceForm
                modal={viewModal}
                formValue={selectedRow}
                isVoidMode={viewModalMode === "void"}
                onVoid={async () => {
                    const isConfirmed = await confirm({
                        title: "Void Cash Issuance",
                        message: `Are you sure you want to void ${selectedRow?.pcv_number}? This action cannot be undone.`,
                    });
                    if (!isConfirmed) return;
                    voidCashIssuance(selectedRow?.id)
                        .then((resp) => {
                            if (!resp.error) {
                                toast.success("Cash issuance voided successfully.");
                                viewModal.onClose();
                                api.triggerReload();
                                refreshCustodian();
                            } else {
                                toast.error(resp.data?.message || "Error voiding cash issuance");
                            }
                        })
                        .catch(() => toast.error("Error encountered"));
                }}
            />
            <LiquidateModal
                modal={liquidateModal}
                issuance={selectedRow}
                onRefreshCustodian={refreshCustodian}
                onPostSuccess={() => {
                    api.triggerReload();
                    refreshCustodian();
                }}
            />
            <PrintCashIssuanceModal
                modal={printModal}
                issuance={selectedRow}
                custodianName={custodianInfo?.user?.name ?? ""}
            />
        </>
    );
};

export default CashIssuanceTableCard;
