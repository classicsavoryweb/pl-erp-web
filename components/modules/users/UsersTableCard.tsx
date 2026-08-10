"use client";

import { exportAllUsers, getAllUsers } from "@/api/users";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { COLUMNTYPES } from "@/constants/column";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { useModal } from "@/hooks/modal";
import CreateUsersForm from "./CreateUsersForm";
import EditUsersForm from "./EditUsersForm";
import { useState } from "react";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useFilter } from "@/hooks/use-filter";
import FilterCard from "../cards/FilterCard";
import moment from "moment";

const UsersTableCard = () => {

    const users = useApiCall();
    const paginator = usePagination(10);
    const createUser = useModal();
    const editUser = useModal();
    const [data, setData] = useState<any>({});
    const filter = useFilter();
    
    useAsyncEffect(() => {
        users.setLoading(true);
        getAllUsers({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching users");
            } else {
                users.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            users.setLoading(false);
        });
    }, [paginator.reload, users.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Employee Number",
            path: "employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Name",
            path: "full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Email",
            path: "email",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Role",
            path: "role.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        }
    ];

    const actionSettings = [
        {
            label: "Create new user",
            onClick: () => {
                createUser.onOpen();
            }
        },
    ];
    
    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                setData({
                    first_name: data.first_name,
                    middle_name: data.middle_name ?? "",
                    last_name: data.last_name,
                    id: data.id,
                    role_id: data.role_id,
                    employee_number: data.employee_number,
                    email: data.email,
                    password: "",
                    confirm_password: "",
                    status: data.status
                });
                editUser.onOpen();
            }
        }
    ];

    return (
        <>
            <FilterCard
                filterHandler={filter}
                columnSettings={columnSettings}
                hasExport
                api={exportAllUsers}
                exportFileName={`ADMINISTRATORS-USERS-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="full_name"
                withStatus
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={actionSettings}
                    />
                </div>
                <Table
                    dataSet={users.dataSet}
                    columnSettings={columnSettings}
                    loading={users.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <CreateUsersForm
                modal={createUser}
                onSubmitCallback={users.triggerReload}
            />

            <EditUsersForm
                modal={editUser}
                onSubmitCallback={users.triggerReload}
                formValue={data}
            />
        </>
    )
};

export default UsersTableCard;