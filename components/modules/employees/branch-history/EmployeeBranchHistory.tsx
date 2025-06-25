"use client";
import { deleteEmployeeBranches, exportEmployeeBranchHistory, getEmployeeBranchhes } from "@/api/employee";
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
import DropDownButtons from "@/components/common/DropDownButtons";
import moment from "moment";
import confirm from "@/components/common/Confirm";

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
            columnHead: "Branch OIC",
            path: "branch.branch_head",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date Assigned",
            path: "date_assigned",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Action",
            path: "date_appointed",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const dataIndex = api.dataSet.findIndex(item => data.id === item.id);
                const actionsSettings = [
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
                    },
                    {
                        label: "Delete",
                        onClick: async () => {
                            const isConfirm = await confirm({
                                title: "Delete Branch",
                                message: "Are you sure you want to delete?"
                            });

                            if (isConfirm) {
                                deleteEmployeeBranches(data.id)
                                .then((resp) => {
                                    if (!resp.error) {
                                        toast.success("Branch successfully deleted");
                                        api.triggerReload();
                                        triggerReload();
                                    } else {
                                        toast.error(resp.data.message);
                                    }
                                }).catch((() => {
                                    toast.error("Error encountered");
                                }));
                            }
                        }
                    }
                ];

                let actions = actionsSettings;
                if (employee.branch_id === data.branch_id && dataIndex === 0 && api.dataSet.length === 1) {
                    actions = [
                        actionsSettings[0]
                    ];
                } else if (employee.branch_id === data.branch_id && dataIndex === 0 && api.dataSet.length > 1) {
                    actions = actionsSettings;
                } else {
                    return "—";
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
                    <DropDownButtons
                        actions={[
                            {
                                label: "Add",
                                onClick: () => {
                                    setAction("add");
                                    modal.onOpen();
                                    setData(api.dataSet[0]);
                                }
                            },
                            {
                                label: "Export",
                                onClick: async () => {
                                    exportEmployeeBranchHistory(String(employeeNumber))
                                    .then((resp) => {
                                        const blob = new Blob([resp.data], {
                                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                        });
                                        const downloadUrl = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                        
                                        a.href = downloadUrl;
                                        a.download = `${employeeNumber}-EMPLOYEE-BRANCHES-${moment().format("YYYY-MM-DD")}.xls`;
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                    });
                                },
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
        </>
    );
};

export default EmployeeBranchHistory;