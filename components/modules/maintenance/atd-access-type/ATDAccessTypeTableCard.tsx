"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import DropDownButtons from "@/components/common/DropDownButtons";
import {
    exportAllATDAccessTypes,
    getAllATDAccessTypes,
} from "@/api/maintenance/atd-access-type";
import CreateATDAccessTypeForm from "./CreateATDAccessTypeForm";
import EditATDAccessTypeForm from "./EditATDAccessTypeForm";
import Badge from "@/components/common/Badge";

const ATDAccessTypeTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState<any>({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllATDAccessTypes({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters,
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching ATD Access Types");
            } else {
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            api.setLoading(false);
        });
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Deduction",
            path: "deduction.description",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Role",
            path: "",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                const roles =
                    (row.roles_display && [].concat(row.roles_display)) ||
                    (row.roles && [].concat(row.roles)) ||
                    (row.role ? [].concat(row.role) : []);
                if (roles.length === 0) return "N/A";
                return (
                    <div className="flex flex-wrap gap-1 max-h-[160px] overflow-y-auto">
                        {roles.map((role: any, idx: number) => (
                            <Badge
                                key={idx}
                                label={typeof role === "string" ? role : role.name ?? role.label ?? ""}
                            />
                        ))}
                    </div>
                );
            },
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        },
    ];

    const actionSettings = [
        {
            label: "Create ATD Access Type",
            onClick: () => {
                createModal.onOpen();
            },
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (row: any) => {
                editModal.onOpen();
                setData({
                    id: row.id,
                    deduction_id: row.deduction_id || row.deduction?.id || "",
                    role_id: row.role_id || (row.role && row.role.id) || "",
                    role: row.role,
                    roles: row.roles,
                    status: row.status,
                });
            },
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Deduction",
                        path: "deduction.description",
                        columnType: COLUMNTYPES.string,
                    },
                ]}
                filterHandler={filter}
                hasExport
                api={exportAllATDAccessTypes}
                exportFileName={`ATD-ACCESS-TYPES-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="deduction.description"
                callBack={() => {
                    paginator.setPage(1);
                }}
                withStatus
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

            <CreateATDAccessTypeForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditATDAccessTypeForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default ATDAccessTypeTableCard;
