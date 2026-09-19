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
import { useEffect, useState } from "react";
import moment from "moment";
import { getMyCustodianInfo } from "@/api/petty-cash/department-fund";
import { getAllReplenishments, exportAllReplenishments, checkExistingReplenishment } from "@/api/petty-cash/replenishment";
import ActionDropDown from "@/components/common/ActionDropDown";
import DropDownButtons from "@/components/common/DropDownButtons";
import CreateReplenishmentForm from "./CreateReplenishmentForm";
import ViewReplenishmentModal from "./ViewReplenishmentModal";
import VoidReplenishmentModal from "./VoidReplenishmentModal";

const formatAmount = (value: any) =>
    value != null && value !== ""
        ? Number(value).toLocaleString("en-PH", { style: "currency", currency: "PHP" })
        : "—";

// baliktad ipapakita, kabaligtaran ng raw value sa db (same sa cash issuance)
const renderOverUnder = (value: any) => {
    if (value == null || value === "") return <span className="text-gray-400">—</span>;
    const val = Number(value);
    const formatted = Math.abs(val).toLocaleString("en-PH", { style: "currency", currency: "PHP" });
    if (val === 0) return <span>{formatted}</span>;
    return val < 0
        ? <span className="text-green-600 dark:text-green-400">+{formatted}</span>
        : <span className="text-red-600 dark:text-red-400">-{formatted}</span>;
};

const ReplenishmentTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const createModal = useModal();
    const viewModal = useModal();
    const voidModal = useModal();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [postReview, setPostReview] = useState(false);
    const [checkingExisting, setCheckingExisting] = useState(false);

    const [custodianInfo, setCustodianInfo] = useState<any>(null);
    const [custodianLoading, setCustodianLoading] = useState(true);

    const getDefaultDateRange = () => ({
        date_from: moment().subtract(3, "months").startOf("month").format("YYYY-MM-DD"),
        date_to: moment().format("YYYY-MM-DD"),
    });

    const [filterValues, setFilterValues] = useState({
        replenishment_id: "",
        branch_id: "",
        ...getDefaultDateRange(),
    });

    useEffect(() => {
        filter.setFilters(filterValues);
    }, []);

    useAsyncEffect(() => {
        setCustodianLoading(true);
        getMyCustodianInfo()
            .then((resp) => {
                if (!resp.error) setCustodianInfo(resp.data);
                else setCustodianInfo(null);
            })
            .catch(() => toast.error("Error loading page data"))
            .finally(() => setCustodianLoading(false));
    }, []);

    useAsyncEffect(() => {
        if (!custodianInfo) return;
        api.setLoading(true);
        getAllReplenishments({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
            .then((resp) => {
                if (!resp.error) {
                    api.setDataSet(resp.data.data);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                } else {
                    toast.error(resp.data?.message || "Error fetching replenishments");
                }
            })
            .catch(() => toast.error("Error fetching replenishments"))
            .finally(() => api.setLoading(false));
    }, [custodianInfo, paginator.reload, api.reload, filter.reload]);

    const handleSearch = () => {
        filter.setFilters(filterValues);
        filter.onReload();
        paginator.setPage(1);
    };

    const handleReset = () => {
        const defaults = { replenishment_id: "", branch_id: "", ...getDefaultDateRange() };
        setFilterValues(defaults);
        filter.setFilters(defaults);
        filter.onReload();
        paginator.setPage(1);
    };

    const branchOptions = (custodianInfo?.branches ?? []).map((b: any) => ({
        label: b.name,
        value: b.id,
    }));

    const handleExport = () => {
        exportAllReplenishments(filter.filters)
            .then((resp: any) => {
                const payload = resp?.data ?? resp;
                if (resp?.error || !(payload instanceof Blob)) {
                    toast.error("Export failed");
                    return;
                }
                const url = window.URL.createObjectURL(payload);
                const a = document.createElement("a");
                a.href = url;
                a.download = `PETTY-CASH-REPLENISHMENTS-${moment().format("YYYY-MM-DD")}.xls`;
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => toast.error("Error encountered"));
    };

    const handleAddReplenishment = () => {
        if (checkingExisting) return;
        setCheckingExisting(true);
        checkExistingReplenishment()
            .then((resp) => {
                if (!resp.error) {
                    if (resp.data.has_existing_replenishment) {
                        toast.error("You have an existing replenishment that is not yet Replenished.");
                    } else {
                        createModal.onOpen();
                    }
                } else {
                    toast.error(resp.data?.message || "Error checking existing replenishment");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => setCheckingExisting(false));
    };

    const columnSettings = [
        { columnHead: "Replenishment ID", path: "replenishment_id", columnType: COLUMNTYPES.string },
        { columnHead: "Transaction Date", path: "date", columnType: COLUMNTYPES.date },
        { columnHead: "Branches", path: "branches_summary", columnType: COLUMNTYPES.string },
        { columnHead: "Total Cash Issuance Amount", path: "total_cash_issuance_amount", columnType: COLUMNTYPES.amount },
        {
            columnHead: "Total Over/Under Amount",
            path: "total_overunder_amount",
            columnType: COLUMNTYPES.function,
            function: (row: any) => renderOverUnder(row.total_overunder_amount),
        },
        {
            columnHead: "Total Replenishment",
            path: "total_replenishment_amount",
            columnType: COLUMNTYPES.function,
            function: (row: any) => formatAmount(row.total_replenishment_amount),
        },
        { columnHead: "Status", path: "status", columnType: COLUMNTYPES.string },
        {
            columnHead: "Action",
            path: "action",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                const actions: any[] = [];
                if (row.status === "Pending") {
                    actions.push({
                        label: "Post",
                        onClick: () => {
                            setSelectedId(row.id);
                            setPostReview(true);
                            viewModal.onOpen();
                        },
                    });
                    actions.push({
                        label: "Void",
                        onClick: () => {
                            setSelectedRow(row);
                            voidModal.onOpen();
                        },
                    });
                }
                actions.push({
                    label: "View",
                    onClick: () => {
                        setSelectedId(row.id);
                        setPostReview(false);
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
            <Accordion title="Filters" isExpanded>
                <form className="pt-5" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <Grid cols={4}>
                        <Textfield
                            label="Replenishment ID"
                            placeholder="search replenishment ID"
                            name="replenishment_id"
                            value={filterValues.replenishment_id}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, replenishment_id: e.target.value }))}
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
                            label="Branches"
                            placeholder="all branches"
                            name="branch_id"
                            value={String(filterValues.branch_id)}
                            onChange={(e) => setFilterValues((prev) => ({ ...prev, branch_id: e.target.value }))}
                            options={[{ label: "All Branches", value: "" }, ...branchOptions]}
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

            <Card>
                <div className="flex justify-end gap-x-2 mb-3">
                    <DropDownButtons
                        actions={[
                            { label: "Add Replenishment", onClick: handleAddReplenishment, disabled: checkingExisting },
                        ]}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <CreateReplenishmentForm
                modal={createModal}
                custodianBranches={custodianInfo?.branches ?? []}
                onSubmitCallback={api.triggerReload}
            />
            <ViewReplenishmentModal
                modal={viewModal}
                replenishmentId={selectedId}
                showPostAction={postReview}
                onPosted={api.triggerReload}
            />
            <VoidReplenishmentModal
                modal={voidModal}
                replenishment={selectedRow}
                onSuccess={api.triggerReload}
            />
        </>
    );
};

export default ReplenishmentTableCard;
