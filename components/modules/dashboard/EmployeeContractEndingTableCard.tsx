"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import Link from "next/link";
import { getEmployeeBirthMonth, getEmployeeExpiringContracts } from "@/api/dashboard";
import moment from "moment";

const EmployeeContractEndingTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeExpiringContracts({
            page: paginator.page,
            per_page: paginator.per_page,
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
            columnHead: "Employee Number",
            path: "employee_number",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                return (
                    <Link
                        href={`/employees/${data.employee_number}`}
                        target="_blank"
                        className="text-blue-700 underline"
                    >
                        {data.employee_number}
                    </Link>
                )
            }
        },
        {
            columnHead: "Full Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "employee.current_branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Position",
            path: "employee.current_position.description",
            columnType: COLUMNTYPES.string
        },
                {
            columnHead: "Contract End Date",
            path: "contract_end_date",
            columnType: COLUMNTYPES.date
        },
    ];

    return (
        <>
            <Card>
                <p className="">Active Employee Contracts</p>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
        </>
    );
};

export default EmployeeContractEndingTableCard;