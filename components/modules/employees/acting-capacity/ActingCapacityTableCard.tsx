"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import Badge from "@/components/common/Badge";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import { exportAllActingCapacity, getAllActingCapacity } from "@/api/acting-capacity";
import ActionDropDown from "@/components/common/ActionDropDown";
import CreateActingCapacityForm from "./CreateActingCapacityForm";
import ViewActingCapacity from "./ViewActingCapacity";
import ViewACFModal from "./ViewACFModal";
import EditActingCapacityForm from "./EditActingCapacityForm";
import GeneratePromotionConfirmationForm from "./GeneratePromotionConfirmationForm";
import ViewConfirmationDocumentModal from "./ViewConfirmationDocumentsModal";
import RejectPromotionModal from "./RejectPromotionForm";
import ConfirmPromotionModal from "./ConfirmPromotionModal";
import Link from "next/link";

const ActingCapacityTableCard = () => {
    const api = useApiCall();
    const [id, setId] = useState<number>(0);
    const viewModal = useModal();
    const viewACF = useModal();
    const editModal = useModal();
    const createModal = useModal();
    const generateConfirmationModal = useModal();
    const viewConfirmationDocumentModal = useModal();
    const rejectPromotion = useModal();
    const confirmPromotion = useModal();
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllActingCapacity({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching acting capacities");
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
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Current Branch",
            path: "branch.name",
            columnType: COLUMNTYPES.string
        },
                {
            columnHead: "Branch Assignment",
            path: "branch_assignment.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Current Position",
            path: "current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Recommended Position",
            path: "recommended_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                if (data.status === "Pending") {
                    status = "warning";
                } else if (data.status === "Confirmed") {
                    status = "success";
                } else if (data.status === "Rejected") {
                    status = "danger";
                }

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
                let tableActions = actions;

                if (data.status === "Pending") {
                    tableActions = [
                        actions[0], 
                        actions[1],
                        actions[2],
                        actions[3],
                        actions[5],
                    ];
                } else if (data.status === "Confirmed") {
                    tableActions = [
                        actions[0],
                        actions[1],
                        actions[6],
                    ];
                } else if (data.status === "For Signature") {
                    tableActions = [
                        actions[0], 
                        actions[1],
                        actions[6],
                        actions[4],
                        actions[5],
                    ];
                } else {
                    tableActions =  [
                        actions[0], 
                    ];
                }

                return (

                    <ActionDropDown
                        data={data}
                        actions={tableActions}
                    />
                )
            }
        },
    ];

    const actions = [
        {
            label: "View",
            onClick: (data: any) => {
                viewModal.onOpen();
                setId(data.id);
            }
        },
        {
            label: "View ACF",
            onClick: (data: any) => {
                viewACF.onOpen();
                setId(data.id);
            }
        },
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setId(data.id);
            }
        },
        {
            label: "Generate Confirmation Documents",
            onClick: (data: any) => {
                generateConfirmationModal.onOpen();
                setId(data.id);
            }
        },
        {
            label: "Confirm Promotion",
            onClick: (data: any) => {
                confirmPromotion.onOpen();
                setId(data.id);
            }
        },
        {
            label: "Reject Promotion",
            onClick: (data: any) => {
                rejectPromotion.onOpen();
                setId(data.id);
            }
        },
        {
            label: "View Documents",
            onClick: (data: any) => {
                viewConfirmationDocumentModal.onOpen();
                setId(data.id);
            }
        },
    ];

    return (
        <>
            <FilterCard
                filterHandler={filter}
                withStatus
                hasExport
                hasDateRange
                dateLabel="Date Confirmed"
                statusOption={[
                    {
                        label: "Pending",
                        value: "Pending"
                    },
                    {
                        label: "For Signature",
                        value: "For Signature"
                    },
                    {
                        label: "Confirmed",
                        value: "Confirmed"
                    },
                    {
                        label: "Rejected",
                        value: "Rejected"
                    },
                ]}
                columnSettings={[
                    {
                        columnHead: "Employee Name",
                        path: "employee.full_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Current Position",
                        path: "current_position.description",
                        columnType: COLUMNTYPES.string
                    },
                ]}
                withBranch
                api={exportAllActingCapacity}
                defaultColumnSelected="employee.full_name"
                exportFileName={`ACTING-CAPACITY-${moment().format("YYYY-MM-DD")}.xls`}
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new record"
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

            <CreateActingCapacityForm
                modal={createModal}
                onSubmitCallback={() => {
                    createModal.onClose();
                    api.triggerReload();
                }}
            />

            <ViewActingCapacity
                modal={viewModal}
                id={String(id)}
            />

            <ViewACFModal
                modal={viewACF}
                id={String(id)}
            />

            <EditActingCapacityForm
                modal={editModal}
                id={String(id)}
                onSubmitCallback={() => {
                    editModal.onClose();
                    api.triggerReload();
                }}
            />

            <GeneratePromotionConfirmationForm
                modal={generateConfirmationModal}
                id={String(id)}
                onSubmitCallBack={() => {
                    api.triggerReload();
                    viewConfirmationDocumentModal.onOpen();
                    generateConfirmationModal.onClose();
                }}
            />

            <ViewConfirmationDocumentModal
                modal={viewConfirmationDocumentModal}
                id={String(id)}
            />

            <RejectPromotionModal
                modal={rejectPromotion}
                id={String(id)}
                onSubmitCallBack={() => {
                    api.triggerReload();
                    rejectPromotion.onClose();
                }}
            />

            <ConfirmPromotionModal
                modal={confirmPromotion}
                id={String(id)}
                onSubmitCallBack={() => {
                    api.triggerReload();
                    confirmPromotion.onClose();
                }}
            />
        </>
    );
};

export default ActingCapacityTableCard;