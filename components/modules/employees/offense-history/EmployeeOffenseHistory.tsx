"use client";
import { getEmployeeOffensesHistory, } from "@/api/employee";
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

const EmployeeOffenseHistory = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();
    const paginator = usePagination(5);
    const [data, setData] = useState<any>({});
    const modal = useModal();
    const [action, setAction] = useState<"add" | "edit">("add");
    const { triggerReload } = useContext(EmployeeContext);

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
            columnType: COLUMNTYPES.string
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
    ];

    const actionSettings = [
        {
            label: "Edit",
            onClick: (data:any) => {
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
                    attached_file: data.attached_file
                });
                modal.onOpen();
            }
        }
    ]
    
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
                withActions
                actions={actionSettings}
            />
        </>
    );
};

export default EmployeeOffenseHistory;