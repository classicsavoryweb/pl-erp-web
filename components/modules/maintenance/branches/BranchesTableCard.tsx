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
import { exportAllBranches, getAllBranches } from "@/api/branches";
import CreateBranchForm from "./CreateBranchForm";
import EditBranchForm from "./EditBranchForm";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";

const BranchesTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllBranches({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
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
    }, [paginator.reload, api.reload, filter.reload]);

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
            columnHead: "Type",
            path: "type",
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
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Travel Time",
            path: "travel_time",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Device Name",
            path: "device_name",
            columnType: COLUMNTYPES.string,
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
                    name : data.name,
                    branch_number : data.branch_number,
                    branch_email : data.branch_email,
                    travel_time : data.travel_time,
                    device_name : data.device_name,
                    status : data.status,
                    short_name : data.short_name,
                    type : data.type,
                    address : data.address,
                    location : data.location,
                    date_open : data.date_open,
                    company : data.company,
                    branch_head_employee_number: data.branch_head_employee_number,
                    group_head_employee_number: data.group_head_employee_number,
                    rate_code: data.rate_code,
                    kitchen_oic_employee_number: data.kitchen_oic_employee_number,
                    mancom_employee_number: data.mancom_employee_number,
                });
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
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
                        columnHead: "Address",
                        path: "address",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Travel Time",
                        path: "travel_time",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Device Name",
                        path: "device_name",
                        columnType: COLUMNTYPES.string,
                    },
                ]}
                filterHandler={filter}
                hasDateRange
                withStatus
                dateLabel="Date Opened"
                hasExport
                api={exportAllBranches}
                exportFileName={`BRANCHES-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="name"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
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