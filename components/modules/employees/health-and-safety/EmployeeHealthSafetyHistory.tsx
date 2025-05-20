"use client";
import { getEmployeeContractHistory, getEmployeeHealthAndSafety, getEmployeePositions } from "@/api/employee";
import ActionDropDown from "@/components/common/ActionDropDown";
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
// import EmployeeContractForm from "./EmployeeContractForm";
import Button from "@/components/common/Button";
import EmployeeHealthSafetyForm from "./EmployeeHealthSafetyForm";

const EmployeeHealthSafetyHistory = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();
    const paginator = usePagination(5);
    const [data, setData] = useState<any>({});
    const modal = useModal();
    const [action, setAction] = useState<"add" | "edit">("add");

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeHealthAndSafety(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching health and safety");
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
            columnHead: "Date of Consultation",
            path: "consultation_date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "HSO",
            path: "hso",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date of Last Duty",
            path: "last_duty_date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Complaint",
            path: "chief_complaint",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Diagnosis",
            path: "diagnosis.description",
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
                    diagnosis_id : data.diagnosis_id,
                    consultation_date : data.consultation_date,
                    last_duty_date : data.last_duty_date,
                    hso : data.hso,
                    chief_complaint : data.chief_complaint,
                    attending_physician : data.attending_physician,
                    physician_name : data.physician_name,
                    swab_test : data.swab_test,
                    swab_test_date : data.swab_test_date,
                    swab_test_type : data.swab_test_type,
                    swab_test_result : data.swab_test_result,
                    return_to_work_date : data.return_to_work_date,
                    quarantine_period_from : data.quarantine_period_from,
                    quarantine_period_to : data.quarantine_period_to,
                });
                modal.onOpen();
            }
        }
    ];

    return (
        <>
            <EmployeeHealthSafetyForm
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

export default EmployeeHealthSafetyHistory;