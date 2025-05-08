"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { getAllEmployees } from "@/api/employee";
import { useRouter } from "next/navigation";

const EmployeeTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const router = useRouter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllEmployees({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching employees");
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
            columnHead: "Employee number",
            path: "employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Full name",
            path: "full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Position",
            path: "current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "current_branch.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date hired",
            path: "date_hired",
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
            label: "View",
            onClick: (data: any) => {
                router.push(`/employees/${data.employee_number}`);
            }
        },
    ];

    return (
        <>
            <Card>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>
        </>
    );
};

export default EmployeeTableCard;