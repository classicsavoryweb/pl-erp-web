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
import { exportConverterBatchTransactions, exportConverterDetails, generateConverter, getAllConverterMain, postBatchConverter, sendTransactionEmail, voidBatchConverter } from "@/api/compensation/converter";
import CreateBatchModal from "./CreateBatchModal";
import ViewBatchModal from "./ViewBatchModal";
import Badge from "@/components/common/Badge";
import { useState } from "react";
import confirm from "@/components/common/Confirm";
import { useFilter } from "@/hooks/use-filter";
import FilterCard from "@/components/modules/cards/FilterCard";
import ResendBatchModalForm from "./ResendBatchModalForm";
import ViewLogsModal from "./ViewLogsModal";
import ViewExcludedTransactions from "./ViewExcludedTransactions";
import CountLabel from "@/components/common/CountLabel";

const ConverterMainTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const createModal = useModal();
    const resendModal = useModal();
    const viewModal = useModal();
    const excludedTransactionModal = useModal();
    const exportModal = useModal();
    const logsModal = useModal();
    const [dataSet, setDataSet] = useState<any[]>([]);
    const filterHandler = useFilter();
    const [excludedTransactions, setExcludedTransactions] = useState<any[]>([]);
    const [summary, setSummary] = useState({
        total_count: 0,
        total_amount: 0,
        total_pending: 0,
        total_generated: 0
    });

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
                const converters = resp.data.converters ?? resp.data;
                api.setDataSet(converters.data);
                paginator.setPage(converters.current_page);
                paginator.setPaginationData(converters);
                setSummary({
                    total_count: Number(resp.data.summary?.total_count ?? 0),
                    total_amount: Number(resp.data.summary?.total_amount ?? 0),
                    total_pending: Number(resp.data.summary?.total_pending ?? 0),
                    total_generated: Number(resp.data.summary?.total_generated?? 0),
                });      
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
            columnHead: "Batch Number",
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
            columnHead: "Type",
            path: "bank_account_type.description",
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
                    case "Posted":
                        status = "default";
                        break;
                    case "Generated":
                        status = "success";
                        break;
                    case "Sent":
                        status = "success";
                        break;
                    case "Voided":
                        status = "danger";
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
                        statusActions = [
                            tableActions[0],
                            tableActions[1],
                            tableActions[2],
                            tableActions[6],
                            tableActions[7],
                        ];
                        break;
                    case "Posted":
                        statusActions = [
                            tableActions[0],
                            tableActions[2],
                            tableActions[3],
                            tableActions[6],
                            tableActions[7],
                        ];
                        break;
                    case "Generated":
                        statusActions = [
                            tableActions[0],
                            tableActions[3],
                            tableActions[4],
                            tableActions[6],
                            tableActions[7],
                        ];
                        break;
                    case "Voided":
                        statusActions = [
                            tableActions[7],
                        ];
                        break;
                     case "Sent":
                        statusActions = [
                            tableActions[0],
                            tableActions[5],
                            tableActions[6],
                            tableActions[7],
                        ];
                        break;
                    default:
                        statusActions = [
                            tableActions[0],
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
                api.setData(data);
            }
        },
        {
            label: "Post",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Post Batch",
                    message: "Are you sure you want to save changes?"
                });

                if (isConfirmed) {
                    postBatchConverter(data.id)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Batch posted successfully");
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
                    }).finally(() => {
                        api.triggerReload();
                    });

                }
            }
        },
        {
            label: "Send Email",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Send Email",
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
        },
        {
            label: "Resend Email",
            onClick: (data: any) => {
                resendModal.onOpen();
                setDataSet(data.converter_details);
            }
        },
        {
            label: "Export Transactions",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Export Transactions",
                    message: "Are you sure you want to export?"
                });

                if (isConfirmed) {
                    exportConverterDetails({
                        converter_main_id: data.id
                    }).then((resp) => {
                        const blob = new Blob([resp.data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        const downloadUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = `TRANSACTIONS-${data.batch_number}.xls`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }).catch(() => {
                        toast.error("Error encountered");
                    })

                }
            }
        },
        {
            label: "Logs",
            onClick: (data: any) => {
                logsModal.onOpen();
                api.setData(data);
            }
        },
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
                hasExport
                defaultColumnSelected="batch_number"
                exportFileName={`CONVERTER-TRANSACTIONS-LIST-${moment().format('YYYY-MM-DD')}.xls`}
                api={exportConverterBatchTransactions}
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
                        label: "Posted",
                        value: "Posted"
                    },
                    {
                        label: "Generated",
                        value: "Generated"
                    },
                    {
                        label: "Sent",
                        value: "Sent"
                    },
                ]}
                callBack={() => {
                    paginator.setPage(1);
                }}
            >
                <div className="flex flex-wrap items-end gap-4">
                    <CountLabel
                        label="Total Count"
                        count={summary.total_count}
                    />
                    <CountLabel
                        label="Total Amount"
                        count={summary.total_amount}
                    />
                     <CountLabel
                        label="Total Pending"
                        count={summary.total_pending}
                    />
                     <CountLabel
                        label="Total Generated"
                        count={summary.total_generated}
                    />
                </div>
            </FilterCard>
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
                callBack={(resp:any) => {
                    if (resp.data.has_excluded_transactions) {
                        excludedTransactionModal.onOpen();
                        setExcludedTransactions(resp.data.transactions)
                    }
                }}
            />
            <ViewBatchModal
                modal={viewModal}
                dataSet={dataSet}
                data={api.data}
            />
            <ResendBatchModalForm
                modal={resendModal}
                dataSet={dataSet}
            />
            <ViewLogsModal
                modal={logsModal}
                data={api.data}
            />
            <ViewExcludedTransactions
                modal={excludedTransactionModal}
                dataSet={excludedTransactions}
                onCloseCallBack={() => {
                    setExcludedTransactions([]);
                }}
            />
        </>
    );
};

export default ConverterMainTableCard;
