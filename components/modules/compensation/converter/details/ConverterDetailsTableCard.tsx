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
import { getAllConverterDetails, voidConverterDetails } from "@/api/compensation/converter";
import CreateConverterDetailForm from "./CreateConverterDetailForm";
import EditConverterDetailForm from "./EditConverterDetailForm";
import { useState } from "react";
import confirm from "@/components/common/Confirm";

const ConverterDetailsTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const [data, setData] = useState<any>({});
    const createModal = useModal();
    const editModal = useModal();
    
    useAsyncEffect(() => {
        api.setLoading(true);
        getAllConverterDetails({
            page: paginator.page,
            per_page: paginator.per_page
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
    }, [paginator.reload, api.reload]);

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
            columnHead: "Transaction Type",
            path: "transaction_type.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.string
        },
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
    ]

    return (
        <>
            <Card>
                <div className="flex justify-end">
                    <div>
                        <DropDownButtons
                            actions={[
                                {
                                    label: "Create",
                                    onClick: () => {
                                        createModal.onOpen();
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
                    withActions
                    actions={actions}
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
        </>
    );
};

export default ConverterDetailsTableCard;