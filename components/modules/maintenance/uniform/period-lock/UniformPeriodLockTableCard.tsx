"use client";

import { getUniformPeriodLocks } from "@/api/maintenance/uniform-period-lock";
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
import UniformPeriodLockForm from "./UniformPeriodLockForm";

interface Props {
    lockType: "Issuance" | "Receiving";
}

const UniformPeriodLockTableCard = ({ lockType }: Props) => {
    const api = useApiCall();
    const { permissions } = useContext(AuthContext);
    const createModal = useModal();
    const editModal = useModal();
    const paginator = usePagination();
    const filter = useFilter();
    const [selected, setSelected] = useState<any>(null);
    const performPermission = lockType === "Issuance"
        ? "perform_uniform_period_lock_issuance"
        : "perform_uniform_period_lock_receiving";
    const canPerform = permissions.includes(performPermission);

    useAsyncEffect(() => {
        api.setLoading(true);
        getUniformPeriodLocks({
            page: paginator.page,
            per_page: paginator.per_page,
            lock_type: lockType,
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
        { columnHead: "Period Name", path: "period_name", columnType: COLUMNTYPES.string },
        { columnHead: "Date From", path: "date_from", columnType: COLUMNTYPES.date },
        { columnHead: "Date To", path: "date_to", columnType: COLUMNTYPES.date },
        { columnHead: "Status", path: "status", columnType: COLUMNTYPES.status },
    ];

    const tableActions = [
        {
            label: "Edit",
            permission: performPermission,
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

    return (
        <>
            <FilterCard
                columnSettings={[
                    { columnHead: "Period Name", path: "period_name" },
                    { columnHead: "Status", path: "status" },
                    { columnHead: "Prepared By", path: "prepared_by" },
                    { columnHead: "Updated By", path: "updated_by" },
                ]}
                filterHandler={filter}
                defaultColumnSelected="period_name"
                callBack={() => paginator.setPage(1)}
            />
            <Card>
                {canPerform && (
                    <div className="flex justify-end gap-x-3">
                        <DropDownButtons
                            actions={[
                                {
                                    label: "Add Uniform Period",
                                    onClick: () => {
                                        setSelected(null);
                                        createModal.onOpen();
                                    },
                                },
                            ]}
                        />
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
            <UniformPeriodLockForm
                modal={createModal}
                lockType={lockType}
                onSubmitCallback={api.triggerReload}
            />
            <UniformPeriodLockForm
                modal={editModal}
                formValue={selected}
                lockType={lockType}
                onSubmitCallback={api.triggerReload}
            />
        </>
    );
};

export default UniformPeriodLockTableCard;
