"use client";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";;
import { toast } from "react-toastify";
import { exportAllPayrollList, getAllPayrollList } from "@/api/compensation/payroll-list";
import FilterCard from "../../cards/FilterCard";
import { useState } from "react";
import { useModal } from "@/hooks/modal";
import { useFilter } from "@/hooks/use-filter";
import Badge from "@/components/common/Badge";
import DropDownButtons from "@/components/common/DropDownButtons";
import CreatePayrollListForm from "./CreatePayrollListForm";
import EditPayrollListForm from "./EditPayrollListForm";
import moment from "moment";

const PayrollListTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const filter = useFilter();    
    const [data, setData] = useState<any>(null);
    const createModal = useModal();
    const editModal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllPayrollList({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching payroll list");
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
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employee Number",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Payroll Status",
            path: "is_included",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return <Badge
                        status={ data.is_included === 1 ? "success": "danger"}
                        label={data.is_included === 1 ? "included": "excluded"}
                    />
            }
        },
        {
            columnHead: "Payroll Type",
            path: "is_included",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return <Badge
                        status={data.is_statutory_only === 1 ? "warning": "success"}
                        label={data.is_statutory_only === 1 ? "statutory only": "full payroll"}
                    />
            }
        }
    ];

    const actionSettings = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    employee_id: data.employee_id,
                    employee_number: data.employee.employee_number,
                    is_included: data.is_included,
                    is_statutory_only: data.is_statutory_only,
                    is_mancom: data.is_mancom,
                    is_on_maternity_leave: data.is_on_maternity_leave,
                    is_bank: data.is_bank,
                    is_hold: data.is_hold,
                    remarks: data.remarks,
                    employee: data.employee
                });
            }
        }
    ];

    const globalActionSettings = [
        {
            label: "Add employee to payroll list",
            onClick: () => {
                createModal.onOpen();
            }
        },
    ];

    return (
        <>
            <FilterCard
                hasExport
                exportFileName={`PAYROLL-LIST-${moment().format('YYYY-MM-DD')}.xls`}
                api={exportAllPayrollList}
                columnSettings={[
                    {
                        columnHead: "Employee Name",
                        path: "employee.full_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Employee Number",
                        path: "employee.employee_number",
                        columnType: COLUMNTYPES.string
                    },
                ]}
                filterHandler={filter}
                withStatus
                statusOption={[
                    {
                        label: "Included",
                        value: "included",
                    },
                    {
                        label: "Excluded",
                        value: "Excluded"
                    }
                ]}
                defaultColumnSelected="employee.full_name"
                callBack={() => {
                    paginator.setPage(1);
                }}
                
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={globalActionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={actionSettings}
                />
            </Card>

            <CreatePayrollListForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            {data?.employee && (
                <EditPayrollListForm
                    modal={editModal}
                    onSubmitCallback={api.triggerReload}
                    formValue={data}
                />
            )}
        </>
    );
};

export default PayrollListTableCard;