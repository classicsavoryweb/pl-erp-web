"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import { exportAllReportsOffenses, getAllReportsOffenses } from "@/api/reports/reports-offenses";
import Link from "next/link";
import moment from "moment";

const EmployeeOffensesTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllReportsOffenses({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching offenses");
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
            columnHead: "Employee",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Number",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                return (
                    <Link
                        href={`/employees/${data.employee.employee_number}`}
                        className="text-blue-700 underline"
                    >
                        {data.employee.employee_number}
                    </Link>
                )
            }
        },
        {
            columnHead: "Date Committed",
            path: "date_committed",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Offense Category",
            path: "offense.category",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Summary",
            path: "summary",
            columnType: COLUMNTYPES.string
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                hasDateRange
                hasExport
                api={exportAllReportsOffenses}
                exportFileName={`EMPLOYEE-OFFENSES-${moment().format('YYYY-MM-DD')}.xls`}
                exportPermission="can_export_all_records_offenses"
            />
            <Card>
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

export default EmployeeOffensesTableCard;