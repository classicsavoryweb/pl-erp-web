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
import Badge from "@/components/common/Badge";
import moment from "moment";
import { exportAllIncorrectLogs, getAllIncorrectLogs } from "@/api/transactions/incorrect-logs";

const IncorrectLogsTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllIncorrectLogs({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching incorrect logs");
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
            columnHead: "Cutoff",
            path: "cutoff_period",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "employee.current_branch.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Cancelled RD",
            path: "cancelled_rd",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Taxable Adjustment",
            path: "adjust_taxable",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                let status: "default" | "success" | "danger" = "default";

                switch(data.status) {
                    case "Approved": 
                        status = "success";
                        break;
                    case "Unapproved":
                        status = "danger";
                        break;
                    default:
                        status = "default";
                        break;
                };

                return <Badge
                    label={data.status}
                    status={status}
                />
            }
        },
        {
            columnHead: "Payroll Status",
            path: "load_status",
            columnType: COLUMNTYPES.string,
        }
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Cutoff",
                        path: "cutoff_period",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Name",
                        path: "employee.full_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Cancelled RD",
                        path: "cancelled_rd",
                        columnType: COLUMNTYPES.date,
                    },
                    {
                        columnHead: "Taxable Adjustment",
                        path: "adjust_taxable",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Payroll Status",
                        path: "load_status",
                        columnType: COLUMNTYPES.string,
                    }
                ]}
                withStatus
                statusOption={[
                    {
                        label: "Approved",
                        value: "Approved"
                    },
                    {
                        label: "Unapproved",
                        value: "Unapproved"
                    }
                ]}
                filterHandler={filter}
                hasExport
                api={exportAllIncorrectLogs}
                exportFileName={`INCORRECT-LOGS-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="employee.full_name"
                callBack={() => {
                    paginator.setPage(1);
                }}
                withBranch
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

export default IncorrectLogsTableCard;