"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { deleteEmployeeStatus, getAllStatus } from "@/api/employee-status";
import CreateEmployeeStatusForm from "./CreateEmployeeStatusForm";
import { useState } from "react";
import EditEmployeeStatusForm from "./EditEmployeeStatusForm";
import Badge from "@/components/common/Badge";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";

const EmployeeStatusCard = () => {
    const status = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        status.setLoading(true);
        getAllStatus({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching employee status");
            } else {
                status.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            status.setLoading(false);
        });
    }, [paginator.reload, status.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Type",
            path: "type",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        }
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    type: data.type,
                    description: data.description,
                    status: data.status
                });
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                withStatus
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div
                        className="w-[170px]"
                    >
                        <Button
                            label="Create new status"
                            onClick={createModal.onOpen}
                        />
                    </div>
                </div>
                <Table
                    dataSet={status.dataSet}
                    columnSettings={columnSettings}
                    loading={status.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <CreateEmployeeStatusForm
                modal={createModal}
                onSubmitCallback={status.triggerReload}
            />

            <EditEmployeeStatusForm
                modal={editModal}
                onSubmitCallback={status.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default EmployeeStatusCard;