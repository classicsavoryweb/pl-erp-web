"use client";

import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
import FilterCard from "@/components/modules/cards/FilterCard";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useState } from "react";
import moment from "moment";
import { getAllPettyCashCustodians, exportAllPettyCashCustodians } from "@/api/maintenance/petty-cash-custodian";
import CreateCustodianForm from "./CreateCustodianForm";
import EditCustodianForm from "./EditCustodianForm";
import Table from "@/components/common/Table";

const CustodianTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState<any>({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllPettyCashCustodians({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching custodians");
                } else {
                    const mapped = resp.data.data.map((c: any) => ({
                        ...c,
                        branches_display: c.branches?.map((b: any) => b.name).join(", ") || "N/A",
                        employee_display: c.user
                            ? `${c.user.last_name}, ${c.user.first_name} ${c.user.middle_name || ""}`.trim() + ` - ${c.user.employee_number}`
                            : "N/A",
                        created_by: c.created_by?.full_name ?? c.created_by?.proper_full_name ?? "System",
                        updated_by: c.updated_by?.full_name ?? c.updated_by?.proper_full_name ?? "—",
                        updated_at: c.updated_by ? c.updated_at : "—",
                    }));
                    api.setDataSet(mapped);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        { columnHead: "Custodian", path: "employee_display", columnType: COLUMNTYPES.string },
        { columnHead: "Branches", path: "branches_display", columnType: COLUMNTYPES.string },
        { columnHead: "Total Cash Fund", path: "total_cash_fund", columnType: COLUMNTYPES.amount },
        { columnHead: "Status", path: "status", columnType: COLUMNTYPES.status },
        { columnHead: "Added By", path: "created_by", columnType: COLUMNTYPES.string },
        { columnHead: "Date Added", path: "created_at", columnType: COLUMNTYPES.timestamp },
        { columnHead: "Last Updated By", path: "updated_by", columnType: COLUMNTYPES.string },
        { columnHead: "Date Updated", path: "updated_at", columnType: COLUMNTYPES.timestamp },
    ];

    const actionSettings = [
        { label: "Create new custodian", onClick: () => createModal.onOpen() },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (row: any) => {
                if (row.status === "inactive") {
                    toast.warning("Inactive custodians cannot be edited. Please create a new custodian for the branch.");
                    return;
                }
                setData(row);
                editModal.onOpen();
            },
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    { columnHead: "Employee Name", path: "user.full_name", columnType: COLUMNTYPES.string },
                    { columnHead: "Branch", path: "branches.name", columnType: COLUMNTYPES.string },
                ]}
                filterHandler={filter}
                withStatus
                hasExport
                api={exportAllPettyCashCustodians}
                exportFileName={`PETTY-CASH-CUSTODIANS-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="user.full_name"
                callBack={() => paginator.setPage(1)}
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons actions={actionSettings} />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>
            <CreateCustodianForm modal={createModal} onSubmitCallback={api.triggerReload} />
            <EditCustodianForm modal={editModal} onSubmitCallback={api.triggerReload} formValue={data} />
        </>
    );
};

export default CustodianTableCard;
