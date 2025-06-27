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
import { approveCOERequest, cancelCOERequest, getAllReportsCoeRequests } from "@/api/reports/reports-coe-request";
import Button from "@/components/common/Button";
import { useModal } from "@/hooks/modal";
import CreateReportCoeRequestForm from "./CreateReportCoeRequestForm";
import CoePreviewModal from "./CoePreviewModal";
import { useState } from "react";
import ActionDropDown from "@/components/common/ActionDropDown";
import confirm from "@/components/common/Confirm";
import EditReportCoeRequestForm from "./EditReportCoeRequestForm";

const ReportCoeRequestsTableCard = () => {
    const [selectedRequest, setSelectedRequest] = useState<number>(0);
    const [data, setData] = useState<any>({});
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const createModal = useModal();
    const viewCoeModal = useModal();
    const editCoeModal = useModal();

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
                        target="_blank"
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
            columnType: COLUMNTYPES.timestamp
        },
        {
            columnHead: "COE Purpose",
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
        {
            columnHead: "Action",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let actions = actionSettings;
                if (data.status === "Pending") {
                    actions = [
                        actionSettings[3],
                        actionSettings[1],
                        actionSettings[2],
                    ];
                } else if (data.status === "Approved") {
                    actions = [
                        actionSettings[0],
                    ];
                }

                if (data.status === "Pending" || data.status === "Approved") {
                    return (
                        <ActionDropDown
                            data={data}
                            actions={actions}
                        />
                    );
                } else {
                    return "—";
                }

            }

        }
    ];

    const actionSettings = [
        {
            label: "View",
            onClick: async (data: any) => {
                setSelectedRequest(data.id);
                viewCoeModal.onOpen();
            }
        },
        {
            label: "Cancel",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Cancel Request",
                    message: "Are you sure you want to cancel this request?",
                });

                isConfirmed &&
                cancelCOERequest(data.id).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            },
            permission: "cancel_all_records_coe_requests"
        },
        {
            label: "Approve",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Approve Request",
                    message: "Are you sure you want to approve this request?",
                });

                isConfirmed &&
                approveCOERequest(data.id).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            },
            permission: "approve_all_records_coe_requests"
        },
        {
            label: "Edit",
            onClick: async (data: any) => {
                setData({
                    id: data.id,
                    coe_reason: data.coe_reason,
                    employee: data.employee,
                    coe_format: data.coe_format,
                    include_salary: data.include_salary,
                    employee_number: data.employee.employee_number,
                    places: data.places,
                    leave_from: data.leave_from,
                    leave_to: data.leave_to,
                })
                editCoeModal.onOpen();
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                hasDateRange
                isExpanded
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <CreateReportCoeRequestForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <CoePreviewModal
                modal={viewCoeModal}
                requestId={Number(selectedRequest)}
            />
            <EditReportCoeRequestForm
                modal={editCoeModal}
                onSubmitCallback={api.triggerReload}
                data={data}
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
                />
            </Card>
        </>
    );
};

export default ReportCoeRequestsTableCard;