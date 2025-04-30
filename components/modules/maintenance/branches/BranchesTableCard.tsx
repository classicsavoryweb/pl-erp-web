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
import { getAllBranches } from "@/api/branches";
import CreateBranchForm from "./CreateBranchForm";
import EditBranchForm from "./EditBranchForm";

const BranchesTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllBranches({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching branches");
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
            columnHead: "Branch Name",
            path: "name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch Number",
            path: "branch_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Short Name",
            path: "short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Mall Admin",
            path: "mall_admin",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Address",
            path: "address",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date Opened",
            path: "date_open",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.status === "inactive") {
                    return <Badge status="danger" label={data.status}/>
                } else {
                    return <Badge status="success" label={data.status}/>
                }
            }
        }
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    name : data.name ,
                    branch_number : data.branch_number ,
                    status : data.status ,
                    mall_admin : data.mall_admin ,
                    short_name : data.short_name ,
                    address : data.address ,
                    location : data.location ,
                    date_open : data.date_open ,
                });
            }
        },
    ];

    return (
        <>
            <Card>
                <div className="flex justify-end items-center">
                    <div
                        className="w-[170px]"
                    >
                        <Button
                            label="Create new branch"
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
            <CreateBranchForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditBranchForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default BranchesTableCard;