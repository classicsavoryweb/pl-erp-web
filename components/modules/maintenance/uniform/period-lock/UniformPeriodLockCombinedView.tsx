"use client";

import { getUniformPeriodLocks } from "@/api/maintenance/uniform-period-lock";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
import Table from "@/components/common/Table";
import FilterCard from "@/components/modules/cards/FilterCard";
import { COLUMNTYPES } from "@/constants/column";
import { AuthContext } from "@/context/AuthProvider";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import UniformPeriodLockPeriodForm from "./UniformPeriodLockPeriodForm";

const UniformPeriodLockCombinedView = () => {
    const api = useApiCall();
    const { permissions } = useContext(AuthContext);
    const createModal = useModal();
    const editModal = useModal();
    const paginator = usePagination();
    const filter = useFilter();
    const [selected, setSelected] = useState<any>(null);
    const canPerform = permissions.includes("perform_uniform_period_lock");
    const statusLabel = (status: string) => status === "active" ? "Open" : "Lock";

    useAsyncEffect(() => {
        api.setLoading(true);
        getUniformPeriodLocks({
            page: paginator.page,
            per_page: paginator.per_page,
            combined: true,
            ...filter.filters,
        })
            .then((resp: any) => {
                if (resp.error) {
                    toast.error("Error fetching uniform periods");
                } else {
                    api.setDataSet(resp.data.data);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Date Period",
            path: "date_from",
            columnType: COLUMNTYPES.function,
            function: (record: any) => {
                const dateFrom = record.date_from ? moment(record.date_from).format("MMMM DD, YYYY") : "";
                const dateTo = record.date_to ? moment(record.date_to).format("MMMM DD, YYYY") : "";

                if (!dateFrom && !dateTo) return "-";
                return `${dateFrom} - ${dateTo}`;
            },
        },
        {
            columnHead: "Issuance Lock",
            path: "issuance.status",
            columnType: COLUMNTYPES.function,
            function: (record: any) => record.issuance
                ? <Badge status={record.issuance.status === "inactive" ? "danger" : "success"} label={statusLabel(record.issuance.status)} />
                : "-",
        },
        {
            columnHead: "Receiving Lock",
            path: "receiving.status",
            columnType: COLUMNTYPES.function,
            function: (record: any) => record.receiving
                ? <Badge status={record.receiving.status === "inactive" ? "danger" : "success"} label={statusLabel(record.receiving.status)} />
                : "-",
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            permission: "perform_uniform_period_lock",
            onClick: (record: any) => {
                setSelected({
                    ...record,
                    date_from: record.date_from ? moment(record.date_from).format("YYYY-MM-DD") : "",
                    date_to: record.date_to ? moment(record.date_to).format("YYYY-MM-DD") : "",
                });
                editModal.onOpen();
            },
        },
    ];

    const addActions = [
        {
            label: "Create Date Period",
            disabled: !canPerform,
            onClick: () => {
                setSelected(null);
                createModal.onOpen();
            },
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    { columnHead: "Date From", path: "date_from" },
                    { columnHead: "Date To", path: "date_to" },
                    { columnHead: "Status", path: "status" },
                    { columnHead: "Prepared By", path: "prepared_by" },
                    { columnHead: "Updated By", path: "updated_by" },
                ]}
                filterHandler={filter}
                defaultColumnSelected="date_from"
                callBack={() => paginator.setPage(1)}
            />
            <Card>
                {canPerform && (
                    <div className="flex justify-end gap-x-3">
                        <DropDownButtons actions={addActions} />
                    </div>
                )}
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>
            <UniformPeriodLockPeriodForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <UniformPeriodLockPeriodForm
                modal={editModal}
                formValue={selected}
                onSubmitCallback={api.triggerReload}
            />
        </>
    );
};

export default UniformPeriodLockCombinedView;
