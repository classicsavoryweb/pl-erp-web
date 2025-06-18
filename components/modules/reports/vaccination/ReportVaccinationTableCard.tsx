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
import Link from "next/link";
import { getAllReportsVaccination } from "@/api/reports/reports-vaccination";
import Badge from "@/components/common/Badge";

const ReportVaccinationTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllReportsVaccination({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching vaccinations");
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
                        target="_blank"
                        className="text-blue-700 underline"
                    >
                        {data.employee.employee_number}
                    </Link>
                )
            }
        },
        {
            columnHead: "Vaccine",
            path: "vaccine.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Dose",
            path: "dose",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                return <Badge
                    label={data.status}
                    status={ data.status === "Done" ? "success" : "warning"}
                />
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                hasDateRange
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
                />
            </Card>
        </>
    );
};

export default ReportVaccinationTableCard;