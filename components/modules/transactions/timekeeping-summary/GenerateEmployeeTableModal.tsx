"use client";
import { generateTimeKeepingPerEmployee } from "@/api/transactions/time-keeping";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    dataSet: any[];
}

const GenerateEmployeeTableModal = ({
    modal,
    dataSet = []
}: ModalInterface) => {

    const [tableData, setTableData] = useState<any[]>(dataSet);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

    useEffect(() => {
        setTableData(dataSet);
    }, [dataSet]);

    const columnSettings = [
        {
            columnHead: "Timekeeping Branch",
            path: "timekeeping_branch_code",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employee",
            path: "user.full_name",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return `${data.last_name}, ${data.first_name} ${data.middle_name ?? ""}`;
            }
        },
        {
            columnHead: "Biometric Number",
            path: "biometric_number",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Current Position",
            path: "current_position",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const label = data.status ?? "pending";
                let status : "danger" | "default" | "warning" | "success" = "default";

                switch (label) {
                    case "pending":
                        status = "default";
                        break;
                    case "success":
                        status = "success";
                        break;
                    case "error":
                        status = "danger";
                        break;
                    case "loading":
                        status = "warning";
                        break;
                    default:
                        status = "default";
                }

                return (
                    <div className="flex gap-x-5">
                        <Badge
                            status={status}
                            label={label}
                        />
                    </div>
                );
            }
        },
    ];
    

    return (
        <Modal
            size = "xxl"
            isShowing = {modal.isShowing}
            title = "Generate Timekeeping"
            onClose = {() => {
                setTableData([]);
                modal.onClose();
            }}
        >
            <p className="mt-3">Details</p>
            <div className="max-h-[500px] overflow-hidden overflow-y-auto">
                <Table
                    dataKey="employee_id"
                    withCheckBox
                    onCheck={(selectedRecord) => {
                        setSelectedEmployees(selectedRecord);
                    }}
                    columnSettings={columnSettings}
                    dataSet={tableData}
                    smallText
                />
            </div>
            <div className="flex justify-end">
                <div>
                    <Button
                        label="Generate"
                        loading={loading}
                        onClick={async () => {
                            if (selectedEmployees.length == 0) {
                                toast.error("Select atleast 1 record");
                                return;
                            }
                            setLoading(true);

                            // await Promise.all(
                            //     selectedEmployees.map(async (employeeId) => {
                            //         const record = tableData.find(
                            //             (x) => x.employee_id === employeeId
                            //         );
                            //         if (!record) return;
                                    
                            //         setTableData((prev: any) =>
                            //             prev.map((item: any) => {
                            //                 if (item.employee_id === employeeId) {
                            //                     return {
                            //                         ...item,
                            //                         status: "loading",
                            //                     };
                            //                 }

                            //                 return item;
                            //             })
                            //         );
                                    
                            //         try {
                            //             const resp = await generateTimeKeepingPerEmployee({
                            //                 employee_id: record.employee_id,
                            //                 timekeeping_branch_id: record.timekeeping_branch_id,
                            //             });

                            //             setTableData((prev: any) =>
                            //                 prev.map((item: any) => {
                            //                     if (item.employee_id === employeeId) {
                            //                         return {
                            //                             ...item,
                            //                             status: !resp.error
                            //                                 ? "success"
                            //                                 : "error",
                            //                         };
                            //                     }

                            //                     return item;
                            //                 })
                            //             );
                            //         } catch (error) {
                            //             setTableData((prev: any) =>
                            //                 prev.map((item: any) => {
                            //                     if (item.employee_id === employeeId) {
                            //                         return {
                            //                             ...item,
                            //                             status: "error",
                            //                         };
                            //                     }

                            //                     return item;
                            //                 })
                            //             );
                            //         }

                            //     })
                            // );

                            for (const employeeId of selectedEmployees) {
                                const record = tableData.find(
                                    (x) => x.employee_id === employeeId
                                );
                                if (!record) return;
                                
                                setTableData((prev: any) =>
                                    prev.map((item: any) => {
                                        if (item.employee_id === employeeId) {
                                            return {
                                                ...item,
                                                status: "loading",
                                            };
                                        }

                                        return item;
                                    })
                                );

                                try {
                                    const resp = await generateTimeKeepingPerEmployee({
                                        employee_id: record.employee_id,
                                        timekeeping_branch_id: record.timekeeping_branch_id,
                                    });

                                    setTableData((prev: any) =>
                                        prev.map((item: any) => {
                                            if (item.employee_id === employeeId) {
                                                return {
                                                    ...item,
                                                    status: !resp.error
                                                        ? "success"
                                                        : "error",
                                                };
                                            }

                                            return item;
                                        })
                                    );
                                } catch (error) {
                                    setTableData((prev: any) =>
                                        prev.map((item: any) => {
                                            if (item.employee_id === employeeId) {
                                                return {
                                                    ...item,
                                                    status: "error",
                                                };
                                            }

                                            return item;
                                        })
                                    );
                                }
                            }

                            setLoading(false);
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default GenerateEmployeeTableModal;