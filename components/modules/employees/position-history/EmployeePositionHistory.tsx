"use client";
import { exportEmployeePositionHistory, getEmployeePositions } from "@/api/employee";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import EmployeePositionForm from "./EmployeePositionForm";
import { EmployeeContext } from "@/context/EmployeeProvider";
import ActionDropDown from "@/components/common/ActionDropDown";
import confirm from "@/components/common/Confirm";
import DropDownButtons from "@/components/common/DropDownButtons";
import moment from "moment";

const EmployeePositionHistory = () => {
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
        getEmployeePositions(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching positions");
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
            columnHead: "Position",
            path: "position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date Started",
            path: "date_started",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "OIC",
            path: "oic_assignment",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date Appointed",
            path: "date_appointed",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Remarks",
            path: "remarks",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Action",
            path: "date_appointed",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const dataIndex = api.dataSet.findIndex(item => data.id === item.id);
                if (employee.position_id === data.position_id && dataIndex === 0) {
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
                                            date_started: data.date_started,
                                            oic_assignment: data.oic_assignment,
                                            position_id: data.position_id,
                                            date_appointed: data.date_appointed,
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
            <EmployeePositionForm
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
                                    setData(api.dataSet[0]);
                                    setAction("add");
                                    modal.onOpen();
                                }
                            },
                            {
                                label: "Export",
                                onClick: async () => {
                                    const isConfirmed = await confirm({
                                        title: "Export",
                                        message: "Are you sure you want to export?"
                                    });

                                    if (isConfirmed) {
                                        exportEmployeePositionHistory(String(employeeNumber))
                                        .then((resp) => {
                                            const blob = new Blob([resp.data], {
                                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                            });
                                            const downloadUrl = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                            
                                            a.href = downloadUrl;
                                            a.download = `${employeeNumber}-EMPLOYEE-POSITIONS-${moment().format("YYYY-MM-DD")}.xls`;
                                            document.body.appendChild(a);
                                            a.click();
                                            a.remove();
                                        });
                                    }
                                }
                            },
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

export default EmployeePositionHistory;