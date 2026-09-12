"use client";
import { getEmployeeBankDetailsHistory } from "@/api/employee";
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
import Button from "@/components/common/Button";
import BankDetailsForm from "./BankDetailsForm";
import { AuthContext } from "@/context/AuthProvider";
import { canEditRestrictedRecords } from "@/helper/restriction";

const EmployeeBankDetailsHistory = () => {
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
        getEmployeeBankDetailsHistory(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching bank details");
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
            columnHead: "Bank Number",
            path: "bank_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Bank Type",
            path: "bank_account_type.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Updated At",
            path: "updated_at",
            columnType: COLUMNTYPES.timestamp
        },
        {
            columnHead: "Remarks",
            path: "remarks",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Action",
            path: "bank_number",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const dataIndex = api.dataSet.findIndex(item => data.id === item.id);
                if (dataIndex === 0) {
                    return (
                        <ActionDropDown
                            data={data}
                            actions={[
                                {
                                    label: "Edit",
                                    onClick: () => {
                                        if (!canEditRestrictedRecords(permissions, "EMPLOYEES", "EMPLOYEE", String(employeeNumber), 0)) {
                                            return;
                                        }
                                        setAction("edit");
                                        modal.onOpen();
                                        setData({
                                            id: data.id,
                                            bank_number: data.bank_number,
                                            bank_account_type_id: data.bank_account_type_id,
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
            <BankDetailsForm
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
                            if (!canEditRestrictedRecords(permissions, "EMPLOYEES", "EMPLOYEE", String(employeeNumber), 0)) {
                                return;
                            }
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

export default EmployeeBankDetailsHistory;