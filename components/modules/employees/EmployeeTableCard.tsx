"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { exportEmployeeList, getAllEmployees } from "@/api/employee";
import { useRouter } from "next/navigation";
import FilterCard from "../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";

const EmployeeTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(15);
    const router = useRouter();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllEmployees({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
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
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Employee Number",
            path: "employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Full Name",
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
            columnHead: "Date Hired",
            path: "date_hired",
            columnType: COLUMNTYPES.date
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
                window.open(`/employees/${data.employee_number}`, '_blank');
            }
        },
    ];

    return (
        <>
            <FilterCard
                hasDateRange
                withStatus
                filterHandler={filter}
                withBranch
                withEmployeeType
                withEmploymentStatus
                withPosition
                isExpanded
                hasExport
                api={exportEmployeeList}
                exportFileName={`EMPLOYEES-${moment().format('YYYY-MM-DD')}.xls`}
                defaultColumnSelected="full_name"
                dateLabel="Date Hired"
                columnSettings={[
                    {
                        columnHead: "Employee Number",
                        path: "employee_number",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Full Name",
                        path: "full_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Last Name",
                        path: "last_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Middle Name",
                        path: "middle_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "First Name",
                        path: "first_name",
                        columnType: COLUMNTYPES.string
                    },

                ]}
                exportPermission="can_export_employee_tracking"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
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