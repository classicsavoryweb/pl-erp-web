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
import Badge from "@/components/common/Badge";
import { getAllReportsCoeRequests } from "@/api/reports/reports-coe-request";
import Button from "@/components/common/Button";
import { useModal } from "@/hooks/modal";
import CreateReportCoeRequestForm from "./CreateReportCoeRequestForm";
import CoePreviewModal from "./CoePreviewModal";

const ReportCoeRequestsTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const createModal = useModal();
    const viewCoeModal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllReportsCoeRequests({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching coe requests");
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
            columnHead: "Date Requested",
            path: "date_requested",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Coe Reason",
            path: "coe_reason",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                switch(data.status) {
                    case "Approved": 
                        status = "success";
                        break;
                    case "Pending":
                        status = "warning";
                        break;
                    case "Cancelled":
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
    ];

    const actionSettings = [
        {
            label: "View",
            onClick: async (data: any) => {
                viewCoeModal.onOpen();
                console.log("VIEW >>>> ", data);
            }
        },
        {
            label: "Cancel",
            onClick: async (data: any) => {
                //Cancelled

                console.log("CANCEL >>>> ", data);
            }
        },
        {
            label: "Approve",
            onClick: async (data: any) => {
                //Approved

                console.log("APPROVE >>>> ", data);
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                hasDateRange
            />
            <CreateReportCoeRequestForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <CoePreviewModal
                modal={viewCoeModal}
                onSubmitCallback={api.triggerReload}
                data={{}}
            />

            <Card>
                <div className="flex justify-end items-center">
                    <div
                        className="w-[180px]"
                    >
                        <Button
                            label="Create new request"
                            onClick={createModal.onOpen}
                        />
                    </div>
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    actions={actionSettings}
                    withActions
                />
            </Card>
        </>
    );
};

export default ReportCoeRequestsTableCard;