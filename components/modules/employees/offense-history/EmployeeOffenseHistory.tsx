"use client";
import { exportEmployeeOffensesHistory, getEmployeeOffensesHistory, } from "@/api/employee";
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
import Button from "@/components/common/Button";
import EmployeeOffenseForm from "./EmployeeOffenseForm";
import DropDownButtons from "@/components/common/DropDownButtons";
import confirm from "@/components/common/Confirm";
import moment from "moment";
import { AuthContext } from "@/context/AuthProvider";
import { canEditRestrictedRecords } from "@/helper/restriction";

const EmployeeOffenseHistory = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();
    const paginator = usePagination(5);
    const [data, setData] = useState<any>({});
    const modal = useModal();
    const [action, setAction] = useState<"add" | "edit">("add");
    const { triggerReload } = useContext(EmployeeContext);
    const { permissions } = useContext(AuthContext);

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeOffensesHistory(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching offenses");
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
            columnHead: "Date Committed",
            path: "date_committed",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Category",
            path: "offense.category",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Transgression",
            path: "transgression",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Summary",
            path: "summary",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Repetition",
            path: "repetition",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Offense Action Status",
            path: "offense_action",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Sanction",
            path: "sanction.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Total Days of Suspension",
            path: "sanction.suspension_days",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Written Reprimand",
            path: "sanction.description",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                return row?.sanction?.description === "Written Reprimand"
                ? row.sanction.description
                : "—";
            }
        },
        {
            columnHead: "Final Reminder Memo",
            path: "sanction.description",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                return row?.sanction?.description === "Final Reminder Memo"
                ? row.sanction.description
                : "—";
            }
        },
        {
            columnHead: "Reminder Memo",
            path: "sanction.description",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                return row?.sanction?.description === "Reminder Memo"
                ? row.sanction.description
                : "—";
            }
        },
        {
            columnHead: "Voided",
            path: "voided",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let status = "—";

                if (data.voided == "Yes") {
                    status = data.voided;
                }

                return status;
            }
        },
    ];

    const actionSettings = [
        {
            label: "Edit",
            onClick: (data:any) => {
                if (!canEditRestrictedRecords(permissions, "EMPLOYEE", String(employeeNumber), 0)) {
                    toast.error("You cannot this record");
                    return;
                }
                setAction("edit");
                setData({
                    id: data.id,
                    offense_id : data.offense_id,
                    sanction_id : data.sanction_id,
                    transgression : data.transgression,
                    repetition : data.repetition,
                    summary : data.summary,
                    date_committed : data.date_committed,
                    offense_action : data.offense_action,
                    date_served_ao : data.date_served_ao,
                    suspension_dates : data.suspension_dates,
                    date_served_da : data.date_served_da,
                    remarks : data.remarks,
                    attachment : data.attachment,
                    attachment_file_name : data.attachment_file_name,
                    attached_file: data.attached_file,
                    voided: data.voided,
                    void_reason: data.void_reason,
                    tardiness_id: data.tardiness_id,
                });
                modal.onOpen();
            }
        }
    ]
    const writtenTotal = api.dataSet?.filter((row: any) =>
        row?.sanction?.description === "Written Reprimand" || 
        row?.sanction?.description === "Written Memo"
    ).length || 0;
    
    const suspensionTotal = api.dataSet?.filter((row: any) => 
        Number(row?.sanction?.suspension_days) > 0 
    ).length || 0;
    
    return (
        <>
            <EmployeeOffenseForm
                modal={modal}
                onSubmitCallback={() => {
                    api.triggerReload();
                    modal.onClose();
                }}
                action={action}
                data={data}
            />
            <div className="flex justify-between items-center mt-4">
                {/* <div>
                    <Button
                        label="Add"
                        onClick={() => {
                            setAction("add");
                            modal.onOpen();
                        }}
                    />
                </div> */}
                <div className="flex gap-6 text-sm font-medium mt-1">
                    <div>
                        Written Memo: 
                        <span className="font-bold ml-1">{writtenTotal}</span>
                    </div>
                    <div>
                        Suspension: 
                        <span className="font-bold ml-1">{suspensionTotal}</span>
                    </div>
                </div>
                <div>
                    <DropDownButtons
                        actions={[
                            {
                                label: "Add",
                                onClick: () => {
                                    if (!canEditRestrictedRecords(permissions, "EMPLOYEE", String(employeeNumber), 0)) {
                                        toast.error("You cannot this record");
                                        return;
                                    }
                                    setAction("add");
                                    modal.onOpen();
                                }
                            },
                            {
                                label: "Export",
                                onClick: async () => {
                                    const isConfirmed = await confirm({
                                        title: "Export",
                                        message: "Are you sure you wawnt to export?"
                                    });

                                    if (isConfirmed) {
                                        exportEmployeeOffensesHistory(String(employeeNumber))
                                        .then((resp) => {
                                            const blob = new Blob([resp.data], {
                                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                            });
                                            const downloadUrl = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                            
                                            a.href = downloadUrl;
                                            a.download = `${employeeNumber}-EMPLOYEE-OFFENSES-${moment().format("YYYY-MM-DD")}.xls`;
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
                withActions
                actions={actionSettings}
            />
        </>
    );
};

export default EmployeeOffenseHistory;