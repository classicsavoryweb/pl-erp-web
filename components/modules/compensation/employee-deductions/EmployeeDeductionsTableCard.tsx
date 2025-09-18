"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import CreateEmployeeDeductionForm from "./CreateEmployeeDeductionForm";
import EditEmployeeDeductionForm from "./EditEmployeeDeductionForm";
import ActionDropDown from "@/components/common/ActionDropDown";
import EndLoanTransactionForm from "./EndLoanTransactionForm";
import { exportAllEmployeeDeductions, getAllEmployeeDeductions } from "@/api/compensation/employee-deductions";
    
const EmployeeDeductionsTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const editLoanModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllEmployeeDeductions({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching deductions");
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
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Reference Doc",
            path: "reference_doc",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Description",
            path: "deduction.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Loan Amount",
            path: "amount",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Month(s)",
            path: "months",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Monthly Amortization",
            path: "monthly_amortization",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Balance",
            path: "balance",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date Start",
            path: "start_date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date End",
            path: "end_date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Approved Status",
            path: "approved_status",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Action",
            path: "action",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const actions = [];

                actions.push({
                    label: "Edit",
                    onClick: () => {
                        editModal.onOpen();
                        setData({
                        id: data.id,
                        employee_id: data.employee_id,
                        employee_number: data.employee.employee_number,
                        deduction_id: data.deduction_id,
                        months: data.months,
                        amount: data.amount,
                        start_date: data.start_date,
                        end_date: data.end_date,
                        monthly_amortization: data.monthly_amortization,
                        balance: data.balance,
                        remarks: data.remarks,
                        branch_id: data.branch_id,
                        block_payment: data.block_payment,
                        });
                    }
                });

                const balance = parseFloat(data.balance);
                const status = data.end_loan_status;

                if (balance > 0  && status !== "Yes") {
                    actions.push({
                            label: "End Loan Transaction",
                            onClick: () => {
                            editLoanModal.onOpen();
                            setData({
                                id: data.id,
                                amount: data.amount,
                                balance: data.balance,
                                end_loan_reason: data.end_loan_reason,
                                end_loan_status: data.end_loan_status,
                            });
                        }
                    });
                }

                return actions.length > 0 ? 
                <ActionDropDown 
                    data={data} 
                    actions={actions} 
                /> : "—";
            }
        }
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                hasExport
                api={exportAllEmployeeDeductions}
                exportFileName={`EMPLOYEE-DEDUCTIONS-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="employee.full_name"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new deduction"
                            onClick={createModal.onOpen}
                        />
                    </div>
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <CreateEmployeeDeductionForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditEmployeeDeductionForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

            <EndLoanTransactionForm
                modal={editLoanModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default EmployeeDeductionsTableCard;