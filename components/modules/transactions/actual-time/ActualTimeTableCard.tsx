"use client";

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
import { getAllTransactionsActualTime } from "@/api/transactions/actual-time";
import ActualTimeModal from "./ActualTimeModal";
import EditActualTimeModal from "./EditActualTImeModal";
import DropDownButtons from "@/components/common/DropDownButtons";
import CreateLogModal from "./CreateLogModal";
import confirm from "@/components/common/Confirm";
import { triggerFetchBiotime } from "@/api/transactions/time-keeping";
import ImportBiotimeLog from "./ImportBiotimeLog";

const ActualTimeTableCard = () => {
    const api = useApiCall();
    const viewModal = useModal();
    const createLogModal = useModal();
    const editModal = useModal();
    const importModal = useModal();
    const [data, setData] = useState<any[]>([]);
    const [selectedLog, setSelectedLog] = useState<string>("0");
    const paginator = usePagination(15);
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllTransactionsActualTime({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching logs");
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
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Status",
            path: "date",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let status: "danger" | "default" | "warning" | "success" = "default";

                switch(data.status) {
                    case "COMPLETE":
                        status="success"
                    break;
                    case "INCOMPLETE":
                        status="warning"
                    break;
                }

                return (
                    <Badge
                        label={data.status}
                        status={status}                    
                    />
                )
            }
        },
    ];

    const tableActions = [
        {
            label: "View",
            onClick: (data: any) => {
                setSelectedLog(data.id);
                setData(data.punches);
                viewModal.onOpen();
            }
        },
        {
            label: "Edit",
            onClick: (data: any) => {
                setSelectedLog(data.id);
                setData(data.punches);
                editModal.onOpen();
            }
        },
    ];

    const actionSettings = [
        {
            label: "Create Log",
            onClick: () => {
                createLogModal.onOpen();
            }
        },
        {
            label: "Fetch Biotime",
            onClick: async () => {
                const isConfirmed = await confirm({
                    message: "Are you sure?",
                    title: "Biotime Logs"
                });

                if (isConfirmed) {
                    triggerFetchBiotime();
                }
            }
        },
        {
            label: "Import Biotime Logs",
            onClick: async () => {
                importModal.onOpen();
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
                        columnHead: "Biometric Number",
                        path: "employee.biometric_number",
                        columnType: COLUMNTYPES.string
                    },
                ]}
                filterHandler={filter}
                hasDateRange
                withStatus
                dateLabel="Date"
                // hasExport
                // api={exportAllBranches}
                // exportFileName={`BRANCHES-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="full_name"
                callBack={() => {
                    paginator.setPage(1);
                }}
                withBranch
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={actionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <ActualTimeModal
                modal={viewModal}
                data={data}
            />

            <EditActualTimeModal
                modal={editModal}
                data={data}
                selectedLog={selectedLog}
                onSubmitCallBack={() => {
                    api.triggerReload();
                }}
            />

            <CreateLogModal
                modal={createLogModal}
                onSubmitCallback={() => {
                    api.triggerReload();
                }}
            />

            <ImportBiotimeLog
                modal={importModal}
            />
        </>
    );
};

export default ActualTimeTableCard;