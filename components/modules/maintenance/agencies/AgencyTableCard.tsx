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
import { useState } from "react";
import Badge from "@/components/common/Badge";
import { getAllAgencies } from "@/api/agencies";
import CreateAgencyForm from "./CreateAgencyForm";
import EditAgencyForm from "./EditAgencyForm";

const AgencyTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllAgencies({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching agencies");
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
    }, [paginator.reload, api.reload]);

    const columnSettings = [
        {
            columnHead: "Name",
            path: "name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Code",
            path: "employee_code",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Address",
            path: "address",
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
                    status: data.status,
                    name: data.name,
                    employee_code: data.employee_code,
                    address: data.address
                });
            }
        },
    ];

    return (
        <>
            <Card>
                <div className="flex justify-end items-center">
                    <div
                        className="w-[180px]"
                    >
                        <Button
                            label="Create new agency"
                            onClick={createModal.onOpen}
                        />
                    </div>
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

            <CreateAgencyForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditAgencyForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

        </>
    );
};

export default AgencyTableCard;