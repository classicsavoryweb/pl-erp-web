"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import Badge from "@/components/common/Badge";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useState } from "react";
import { getAllBir1601C } from "@/api/reports/reports-bir-1601c";
import { useModal } from "@/hooks/modal";
import Button from "@/components/common/Button";
import ActionDropDown from "@/components/common/ActionDropDown";
import GenerateBir1601CModal from "./GenerateBir1601CModal";
import ViewBir1601CModal from "./ViewBir1601CModal";
import ActivityLogsModal from "../../generic/ActivityLogsModal";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Bir1601CTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const generateModal = useModal();
    const viewModal = useModal();
    const activityLogsModal = useModal();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedRow, setSelectedRow] = useState<any>({});

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllBir1601C({
            page: paginator.page,
            per_page: paginator.per_page,
        })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching 1601-C records");
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
            columnHead: "Year",
            path: "year",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Month",
            path: "month",
            columnType: COLUMNTYPES.function,
            function: (data: any) => monthNames[data.month - 1] || "-"
        },
        {
            columnHead: "Total Taxes Withheld",
            path: "total_taxes_withheld",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Total Remittance",
            path: "total_remittance",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => (
                <Badge
                    status={data.status === "final" ? "success" : "warning"}
                    label={String(data.status).toUpperCase()}
                />
            )
        },
        {
            columnHead: "Action",
            path: "action",
            columnType: COLUMNTYPES.function,
            function: (data: any) => (
                <ActionDropDown
                    data={data}
                    actions={[
                        {
                            label: "View",
                            onClick: (row: any) => {
                                setSelectedId(row.id);
                                viewModal.onOpen();
                            }
                        },
                        {
                            label: "Logs",
                            onClick: (row: any) => {
                                setSelectedRow(row);
                                activityLogsModal.onOpen();
                            }
                        }
                    ]}
                />
            )
        }
    ];

    return (
        <>
            <Card>
                <div className="flex justify-end gap-x-3">
                    <div className="w-[180px]">
                        <Button
                            label="Generate 1601-C"
                            onClick={() => generateModal.onOpen()}
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

            <GenerateBir1601CModal
                modal={generateModal}
                onSubmitCallback={api.triggerReload}
            />

            <ViewBir1601CModal
                modal={viewModal}
                id={selectedId}
                onSubmitCallback={api.triggerReload}
            />

            <ActivityLogsModal
                modal={activityLogsModal}
                title="Activity Logs"
                logName="BIR 1601-C"
                data={selectedRow}
            />
        </>
    );
};

export default Bir1601CTableCard;
