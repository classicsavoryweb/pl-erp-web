"use client";

import { deleteRole, getAllRolesAndPermissions } from "@/api/roles-and-permissions";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import CreateRolesAndPermissionsForm from "./CreateRolesAndPermissionsForm";
import { useModal } from "@/hooks/modal";
import EditRolesAndPermissionsForm from "./EditRolesAndPermissionsForm";
import { useState } from "react";
import confirm from "@/components/common/Confirm";
import DropDownButtons from "@/components/common/DropDownButtons";

const RolesAndPermissionTableCard = () => {
    const roles = useApiCall();
    const createModal = useModal();
    const [data, setData] = useState<any>({});
    const editModal = useModal();
    const paginator = usePagination(10);

    useAsyncEffect(() => {
        roles.setLoading(true);
        getAllRolesAndPermissions({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching roles and permissions");
            } else {
                roles.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            roles.setLoading(false);
        });
    }, [paginator.reload, roles.reload]);

    const columnSettings = [
        {
            columnHead: "Role",
            path: "name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Permissions",
            path: "",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <div className="max-h-[200px] overflow-y-auto flex gap-1">
                        {
                        data.permissions.map((permission: any, idx: number) => {
                            return (
                                <Badge
                                    key={idx}
                                    label={permission.name}
                                />
                            )
                        })
                        }
                    </div>
                )
            }
        }
    ];

    const actionSettings = [
        {
            label: "Create new role",
            onClick: () => {
                createModal.onOpen();
            }
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                const permissionNames = data.permissions.map((p:any) => p.name);
                setData({
                    name: data.name,
                    permissions: permissionNames
                });
                editModal.onOpen();
            }
        },
        {
            label: "Delete",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Delete roles and permission",
                    message: "Are you sure you want to delete?"
                });

                isConfirmed &&
                deleteRole(data.id).then((resp) => {
                    if (resp.error) {
                        toast.error(resp.data.message);
                    } else {
                        toast.success("Roles and permission deleted successfully.");
                        roles.triggerReload();
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        },
    ];

    return (
        <>
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={actionSettings}
                    />
                </div>
                <Table
                    dataSet={roles.dataSet}
                    columnSettings={columnSettings}
                    loading={roles.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <CreateRolesAndPermissionsForm
                modal={createModal}
                onSubmitCallback={roles.triggerReload}
            />

            <EditRolesAndPermissionsForm
                formValue={data}
                modal={editModal}
                onSubmitCallback={roles.triggerReload}
            />
        </>
    );
};

export default RolesAndPermissionTableCard;