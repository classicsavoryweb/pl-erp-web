"use client";
import { getEmployeeContractHistory, getEmployeePositions } from "@/api/employee";
import ActionDropDown from "@/components/common/ActionDropDown";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { EmployeeContext } from "@/context/EmployeeProvider";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import EmployeeContractForm from "./EmployeeContractForm";
import Button from "@/components/common/Button";
import PrintInitialContractModal from "./PrintInitialContractModal";

const EmployeeContractHistory = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();
    const paginator = usePagination(5);
    const [data, setData] = useState<any>({});
    const modal = useModal();
    const [action, setAction] = useState<"add" | "edit">("add");
    const { triggerReload } = useContext(EmployeeContext);

    const [id, setId] = useState<number>(0);
    const initialContractModal = useModal();
    const extensionContractModal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeContractHistory(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching contracts");
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
            columnHead: "Contract Number",
            path: "contract_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Contract Start Date",
            path: "contract_start_date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Contract End Date",
            path: "contract_end_date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Duration",
            path: "duration",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status
        },
        {
            columnHead: "Action",
            path: "date_appointed",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const dataIndex = api.dataSet.findIndex(item => data.id === item.id);
                let contractAction = [
                    {
                        label: "Edit",
                        onClick: () => {
                            setAction("edit");
                            modal.onOpen();
                            setData({
                                id: data.id,
                                contract_start_date: data.contract_start_date,
                                contract_end_date: data.contract_end_date,
                                status: data.status,
                                remarks: data.remarks,
                            });
                        }
                    },
                    //initial contract [1]
                    {
                        label: "Print Contract",
                        onClick: () => {
                            setId(data.id);
                            initialContractModal.onOpen();
                        }
                    },
                    //extension contract [2]
                    {
                        label: "Print Contract",
                        onClick: () => {
                            setId(data.id);
                        }
                    },
                ];

                let actions = contractAction;
                if (dataIndex === 0) {
                    actions=[
                        contractAction[0],
                        contractAction[2]
                    ];
                } else {
                    actions = [
                        contractAction[1]
                    ];
                }

                return (
                    <ActionDropDown
                        data={data}
                        actions={actions}
                    />
                )

            }
        },
    ];
    
    return (
        <>
            <EmployeeContractForm
                modal={modal}
                onSubmitCallback={() => {
                    api.triggerReload();
                    modal.onClose();
                    triggerReload();
                }}
                action={action}
                data={data}
            />

            <PrintInitialContractModal
                modal={initialContractModal}
                contractId={id}
            />

            <div className="flex justify-end">
                <div>
                    <Button
                        label="Add"
                        onClick={() => {
                            setAction("add");
                            modal.onOpen();
                        }}
                    />
                </div>
            </div>
            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                paginator={paginator}
            />
        </>
    );
};

export default EmployeeContractHistory;