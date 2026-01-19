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
import ActionDropDown from "@/components/common/ActionDropDown";
import { exportConverterDetails, getAllConverterDetails, voidConverterDetails } from "@/api/compensation/converter";
import CreateConverterDetailForm from "./CreateConverterDetailForm";
import EditConverterDetailForm from "./EditConverterDetailForm";
import { useState } from "react";
import confirm from "@/components/common/Confirm";
import FilterCard from "@/components/modules/cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import Badge from "@/components/common/Badge";
import FetchCSHubTransactionForm from "./FetchCSHubTransactionForm";
import ImportConverterTransactionForm from "./ImportConverterTransactionForm";
import moment from "moment";

const ConverterDetailsTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const [data, setData] = useState<any>({});
    const createModal = useModal();
    const editModal = useModal();
    const fetchModal = useModal();
    const importModal = useModal();
    const filterHandler = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllConverterDetails({
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
            columnHead: "Date Created",
            path: "created_at",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Employee",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Transaction Number",
            path: "transaction_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Transaction Type",
            path: "transaction_type.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Approved Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
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
            function: (data: any) => {
                var tableActions:any[] = [];

                if (data.status === "Pending") {
                    tableActions = actions;
                }

                return (
                    <ActionDropDown
                        data={data}
                        actions={tableActions}
                    />
                );
            }
        }
    ];

    const actions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                setData(data);
                editModal.onOpen();
            }
        },
        {
            label: "Void",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    message: "Are you sure you want to void?",
                    title: "Transaction"
                });

                if (isConfirmed) {
                    voidConverterDetails(data.id)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Details voided successfully");
                            api.triggerReload();
                        } else {
                            toast.error(resp.data.message);
                        }
                    }).catch(() => {
                        toast.error("Error encountered");
                    })
                }

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
                hasExport
                exportFileName={`CONVERTER-TRANSACTION-LIST-${moment().format('YYYY-MM-DD')}.xls`}
                api={exportConverterDetails}
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end">
                    <div>
                        <DropDownButtons
                            actions={[
                                {
                                    label: "Create Transaction",
                                    onClick: () => {
                                        createModal.onOpen();
                                    }
                                },
                                {
                                    label: "Fetch CSHub Transactions",
                                    onClick: () => {
                                        fetchModal.onOpen();
                                    }
                                },
                                {
                                    label: "Import Transactions",
                                    onClick: () => {
                                        importModal.onOpen();
                                    }
                                }
                            ]}
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
            <CreateConverterDetailForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditConverterDetailForm
                modal={editModal}
                data={data}
                onSubmitCallback={api.triggerReload}
            />
            <FetchCSHubTransactionForm
                modal={fetchModal}
                onSubmitCallback={api.triggerReload}
            />
            <ImportConverterTransactionForm
                modal={importModal}
                onSubmitCallback={api.triggerReload}
            />
        </>
    );
};

export default ConverterDetailsTableCard;