"use client";
import { getEmployeeBranchhes } from "@/api/employee";
import Button from "@/components/common/Button";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import EmployeeBranchForm from "./EmployeeBranchForm";
import { EmployeeContext } from "@/context/EmployeeProvider";
import ActionDropDown from "@/components/common/ActionDropDown";

const EmployeeBranchHistory = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();
    const paginator = usePagination(5);
    const [data, setData] = useState<any>({});
    const modal = useModal();
    const [action, setAction] = useState<"add" | "edit">("add");
    const { triggerReload, employee } = useContext(EmployeeContext);

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeBranchhes(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching branches");
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
            columnHead: "Branch",
            path: "branch.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch Head",
            path: "branch.branch_head",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date Assigned",
            path: "date_assigned",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Action",
            path: "date_appointed",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const dataIndex = api.dataSet.findIndex(item => data.id === item.id);
                if (employee.branch_id === data.branch_id && dataIndex === 0) {
                    return (
                        <ActionDropDown
                            data={data}
                            actions={[
                                {
                                    label: "Edit",
                                    onClick: () => {
                                        setAction("edit");
                                        modal.onOpen();
                                        setData({
                                            id: data.id,
                                            date_assigned: data.date_assigned,
                                            branch_id: data.branch_id,
                                            remarks: data.remarks,
                                        });
                                    }
                                }
                            ]}
                        />
                    )
                }
            }
        },
    ];
    
    return (
        <>
            <EmployeeBranchForm
                modal={modal}
                onSubmitCallback={() => {
                    api.triggerReload();
                    modal.onClose();
                    triggerReload();
                }}
                action={action}
                data={data}
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

export default EmployeeBranchHistory;