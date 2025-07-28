"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useState } from "react";
import DropDownButtons from "@/components/common/DropDownButtons";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import Badge from "@/components/common/Badge";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import ActionDropDown from "@/components/common/ActionDropDown";
import { approveAdjustments, getAllAdjustments, unapproveAdjustments } from "@/api/transactions/adjustments";
import CreateAdjustmentsModal from "./CreateAdjustmentsModal";

const AdjustmentsTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(15);
    const createAdjustments = useModal();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllAdjustments({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching overtime");
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
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Biometric Number",
            path: "employee.biometric_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Position",
            path: "employee.current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Cancelled RD",
            path: "cancelled_rd",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Taxable Amount",
            path: "taxable_amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                let status: "default" | "success" | "danger" = "default";

                switch (data.status) {
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
            columnHead: "Action",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let actions = tableActions;
                if (data.status === "Unapproved") {
                    actions = [
                        tableActions[0],
                        tableActions[2]
                    ];
                } else if (data.status === "Approved") {
                    // actions = [
                    //     tableActions[1],
                    // ];
                } else {
                    actions = [tableActions[0]]; 
                }
                
                return (
                    <ActionDropDown
                        data={data}
                        actions={actions}
                    />
                );
            }
        }
    ];

    const tableActions = [
        {
            label: "Approve",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Approve Adjustments",
                    message: "Are you sure you want to approve this adjustments?",
                });

                isConfirmed &&
                approveAdjustments(data.id).then((resp) => {
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
            permission: "approve_transactions_adjustments"
        },
        {
            label: "Unapprove",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Unapprove Adjustments",
                    message: "Are you sure you want to unapprove this adjustments?",
                });

                isConfirmed &&
                unapproveAdjustments(data.id).then((resp) => {
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
            permission: "unapprove_transactions_adjustments"
        },
        {
            label: "Edit",
            onClick: async (data: any) => {
                console.log("WEWEW");
            },
            permission: "perform_transactions_adjustments"
        },
    ];

    const globalActionSettings = [
        {
            label: "Create Adjustments",
            onClick: () => {
                createAdjustments.onOpen();
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Employee Name",
                        path: "employee.full_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Position",
                        path: "employee.current_position.description",
                        columnType: COLUMNTYPES.string
                    },
                ]}
                withStatus
                defaultColumnSelected="employee.full_name"
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
                hasDateRange
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={globalActionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <CreateAdjustmentsModal
                modal={createAdjustments}
            />
        </>
    );
};

export default AdjustmentsTableCard;