"use client";

import Card from "@/components/common/Card";
import Accordion from "@/components/common/Accordion";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import Dropdown from "@/components/common/Dropdown";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import ActionDropDown from "@/components/common/ActionDropDown";
import FilterBranchDropDown from "@/components/modules/generic/FilterBranchDropDown";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useFilter } from "@/hooks/use-filter";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import moment from "moment";
import { getAllReplenishmentsForAudit } from "@/api/petty-cash/audit";
import { getAllPettyCashCustodians } from "@/api/maintenance/petty-cash-custodian";
import ViewReplenishmentModal from "../replenishment/ViewReplenishmentModal";

const formatAmount = (value: any) =>
    value != null && value !== ""
        ? Number(value).toLocaleString("en-PH", { style: "currency", currency: "PHP" })
        : "—";

// baliktad ipapakita, kabaligtaran ng raw value sa db (same sa replenishment/cash issuance)
const renderOverUnder = (value: any) => {
    if (value == null || value === "") return <span className="text-gray-400">—</span>;
    const val = Number(value);
    const formatted = Math.abs(val).toLocaleString("en-PH", { style: "currency", currency: "PHP" });
    if (val === 0) return <span>{formatted}</span>;
    return val < 0
        ? <span className="text-green-600 dark:text-green-400">+{formatted}</span>
        : <span className="text-red-600 dark:text-red-400">-{formatted}</span>;
};

const PettyCashAuditTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const viewModal = useModal();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [custodianOptions, setCustodianOptions] = useState<any[]>([]);

    const getDefaultDateRange = () => ({
        date_from: moment().subtract(3, "months").startOf("month").format("YYYY-MM-DD"),
        date_to: moment().format("YYYY-MM-DD"),
    });

    const [filterValues, setFilterValues] = useState({
        replenishment_id: "",
        custodian_id: "",
        branch_id: "",
        status: "",
        ...getDefaultDateRange(),
    });

    useEffect(() => {
        filter.setFilters(filterValues);
    }, []);

    useAsyncEffect(() => {
        getAllPettyCashCustodians({ per_page: 9999, status: "active" })
            .then((resp) => {
                if (!resp.error) {
                    const rows = resp.data?.data ?? [];
                    setCustodianOptions(
                        rows.map((custodian: any) => ({
                            label: custodian.user?.full_name ?? "—",
                            value: custodian.id,
                        }))
                    );
                }
            })
            .catch(() => toast.error("Error loading custodian list"));
    }, []);

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllReplenishmentsForAudit({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
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
    }, [paginator.reload, api.reload, filter.reload]);

    const handleSearch = () => {
        filter.setFilters(filterValues);
        filter.onReload();
        paginator.setPage(1);
    };

    const handleReset = () => {
        const defaults = { replenishment_id: "", custodian_id: "", branch_id: "", status: "", ...getDefaultDateRange() };
        setFilterValues(defaults);
        filter.setFilters(defaults);
        filter.onReload();
        paginator.setPage(1);
    };

    const columnSettings = [
        { columnHead: "Replenishment ID", path: "replenishment_id", columnType: COLUMNTYPES.string },
        { columnHead: "Custodian", path: "custodian.user.full_name", columnType: COLUMNTYPES.string },
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
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            // "Pending" dito ay Posted na ng custodian pero pending pa i-audit
            function: (row: any) => row.status === "Posted" ? "Pending" : row.status,
        },
        {
            columnHead: "Action",
            path: "action",
            columnType: COLUMNTYPES.function,
            function: (row: any) => (
                <ActionDropDown
                    data={row}
                    actions={[
                        {
                            label: "View",
                            onClick: () => {
                                setSelectedId(row.id);
                                viewModal.onOpen();
                            },
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <>
            <Accordion title="Filters" isExpanded>
                <form className="pt-5" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <Grid cols={12}>
                        <div className="col-span-3">
                            <Textfield
                                label="Replenishment ID"
                                placeholder="search replenishment ID"
                                name="replenishment_id"
                                value={filterValues.replenishment_id}
                                onChange={(e) => setFilterValues((prev) => ({ ...prev, replenishment_id: e.target.value }))}
                            />
                        </div>
                        <div className="col-span-3">
                            <SearchableDropDown
                                label="Custodian"
                                placeholder="all custodians"
                                name="custodian_id"
                                value={filterValues.custodian_id}
                                onChange={(e: any) => setFilterValues((prev) => ({ ...prev, custodian_id: e.target.value }))}
                                allowClear
                                options={[{ label: "All Custodians", value: "" }, ...custodianOptions]}
                            />
                        </div>
                        <div className="col-span-3">
                            <FilterBranchDropDown
                                label="Branches"
                                placeholder="all branches"
                                name="branch_id"
                                value={filterValues.branch_id}
                                onChange={(e: any) => setFilterValues((prev) => ({ ...prev, branch_id: e.target.value }))}
                                withAllOption
                            />
                        </div>
                        <div className="col-span-3">
                            <Dropdown
                                label="Status"
                                placeholder="all statuses"
                                name="status"
                                value={filterValues.status}
                                onChange={(e) => setFilterValues((prev) => ({ ...prev, status: e.target.value }))}
                                options={[
                                    { label: "All Statuses", value: "" },
                                    { label: "Pending", value: "Pending" },
                                    { label: "Reviewed", value: "Reviewed" },
                                    { label: "Audited", value: "Audited" },
                                ]}
                            />
                        </div>
                    </Grid>
                    <div className="mt-3" />
                    <Grid cols={12}>
                        <div className="col-span-3">
                            <Textfield
                                label="Date From"
                                name="date_from"
                                type="date"
                                value={filterValues.date_from}
                                onChange={(e) => setFilterValues((prev) => ({ ...prev, date_from: e.target.value }))}
                            />
                        </div>
                        <div className="col-span-3">
                            <Textfield
                                label="Date To"
                                name="date_to"
                                type="date"
                                value={filterValues.date_to}
                                onChange={(e) => setFilterValues((prev) => ({ ...prev, date_to: e.target.value }))}
                            />
                        </div>
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
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <ViewReplenishmentModal
                modal={viewModal}
                replenishmentId={selectedId}
                showPostAction={false}
            />
        </>
    );
};

export default PettyCashAuditTableCard;
