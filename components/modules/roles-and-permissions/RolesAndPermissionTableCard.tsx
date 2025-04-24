"use client";

import { getAllRolesAndPermissions } from "@/api/roles-and-permissions";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { toast } from "react-toastify";

const RolesAndPermissionTableCard = () => {

    const roles = useApiCall();

    useAsyncEffect(() => {
        roles.setLoading(true);
        getAllRolesAndPermissions()
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching roles and permissions");
            } else {
                roles.setDataSet(resp.data.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            roles.setLoading(false);
        });
    }, []);

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
                return data.permissions.map((permission: any, idx: number) => {
                    return (
                        <Badge
                            key={idx}
                            label={permission.name}
                        />
                    )
                })
            }
        }
    ];

    return (
        <Card>
            <Table
                dataSet={roles.dataSet}
                columnSettings={columnSettings}
            />
        </Card>
    );
};

export default RolesAndPermissionTableCard;