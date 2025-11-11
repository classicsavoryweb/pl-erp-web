"use client";
import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";;
import { toast } from "react-toastify";
import moment from "moment";
import ActionDropDown from "@/components/common/ActionDropDown";
import { generateConverter, getAllConverterMain, sendTransactionEmail, voidBatchConverter } from "@/api/compensation/converter";
import CreateBatchModal from "./CreateBatchModal";
import ViewBatchModal from "./ViewBatchModal";
import Badge from "@/components/common/Badge";
import { useState } from "react";
import confirm from "@/components/common/Confirm";
import { useFilter } from "@/hooks/use-filter";
import FilterCard from "@/components/modules/cards/FilterCard";

const ConverterMainTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const createModal = useModal();
    const viewModal = useModal();
    const [dataSet, setDataSet] = useState<any[]>([]);
    const filterHandler = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllConverterMain({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filterHandler.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching converter details");
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
    }, [paginator.reload, api.reload, filterHandler.reload]);

    const columnSettings = [
        {
            columnHead: "Created At",
            path: "created_at",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Batch #",
            path: "batch_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Total Amount",
            path: "total_amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Count",
            path: "count",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                var status: "success" | "danger" | "default" | "warning" = "default";

                switch (data.status) {
                    case "Pending":
                        status = "warning";
                        break;
                    case "Generated":
                        status = "success";
                        break;
                    case "Voided":
                        status = "default";
                        break;
                    default:
                        status = "default";
                        break;
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
            function: (data:any) => {
                
                var statusActions : any[] = [];

                switch (data.status) {
                    case "Pending":
                        statusActions = tableActions;
                        break;
                    case "Generated":
                        status = "success";
                        statusActions = [
                            tableActions[0],
                            tableActions[2],
                            tableActions[3]
                        ];
                        break;
                    case "Voided":
                        statusActions = [
                            tableActions[0]
                        ];
                        break;
                    default:
                        statusActions = [
                            tableActions[0]
                        ];
                        break;
                }

                return (
                    <ActionDropDown
                        data={data}
                        actions={statusActions}
                    />
                )
            }
        },
    ];

    const actions = [
        {
            label: "Create converter",
            onClick: () => {
                createModal.onOpen();
            }
        }
    ];

    const tableActions = [
        {
            label: "View",
            onClick: (data: any) => {
                viewModal.onOpen();
                setDataSet(data.converter_details);
            }
        },
        {
            label: "Void",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Void Batch Converter",
                    message: "Are you sure you want to void this batch?"
                });

                if (isConfirmed) {
                    voidBatchConverter(data.id)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Batch voided successfully");
                            api.triggerReload();
                        } else {
                            toast.error(resp.data.message);
                        }
                    }).catch(() => {
                        toast.error("Error encountered");
                    });
                }
            }
        },
        {
            label: "Generate Converter",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Generate Converter",
                    message: "Are you sure you want to generate converter?"
                });

                if (isConfirmed) {
                    generateConverter(data.id)
                    .then((resp) => {
                        const blob = new Blob([resp.data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });

                        const downloadUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
        
                        a.href = downloadUrl;
                        a.download = `${data.batch_number}_${moment().format('YYYY-MM-DD')}.xlsm`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    });
                }
            }
        },
        {
            label: "Send Email",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Email Batch Converter",
                    message: "Are you sure you want to send email?"
                });

                if (isConfirmed) {
                    sendTransactionEmail(data.id)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Emails sent successfully");
                            api.triggerReload();
                        } else {
                            toast.error(resp.data.message);
                        }
                    }).catch(() => {
                        toast.error("Error encountered");
                    });
                }
            }
        }
    ];

    return (
        <>
            <FilterCard
                filterHandler={filterHandler}
                columnSettings={columnSettings}
                hasDateRange
                dateLabel="Created"
                withBranch
                withStatus
                statusOption={[
                    {
                        label: "Voided",
                        value: "Voided"
                    },
                    {
                        label: "Pending",
                        value: "Pending"
                    },
                    {
                        label: "Generated",
                        value: "Generated"
                    },

                ]}
            />
            <Card>
                <div className="flex justify-end">
                    <div>
                        <DropDownButtons
                            actions={actions}
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
            <CreateBatchModal
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <ViewBatchModal
                modal={viewModal}
                dataSet={dataSet}
            />
        </>
    );
};

export default ConverterMainTableCard;