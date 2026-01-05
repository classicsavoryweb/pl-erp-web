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
import { AuthContext } from "@/context/AuthProvider";
import { useContext, useState } from "react";
import Textfield from "@/components/common/Textfield";
import confirm from "@/components/common/Confirm";
import Grid from "@/components/common/Grid";
import Dropdown from "@/components/common/Dropdown";
import { useFilter } from "@/hooks/use-filter";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import ActionDropDown from "@/components/common/ActionDropDown";
import { exportAllATDs, exportAllEmployeeDeductions, getAllEmployeeATDs, getAllEmployeeDeductions } from "@/api/compensation/employee-deductions";
import DropDownButtons from "@/components/common/DropDownButtons";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import EndLoanTransactionForm from "../employee-deductions/EndLoanTransactionForm";
import EditEmployeeDeductionForm from "../employee-deductions/EditEmployeeDeductionForm";
import FetchCSHubTransactionForm from "../converter/details/FetchCSHubTransactionForm";
import FetchATDCshubModal from "./FetchATDCshubModal";
import ViewATDModal from "./ViewATDModal";
import BranchDropDown from "../../generic/BranchDropDown";
import DeductionDropDown from "../../generic/DeductionDropDown";

interface ATDTableInterface {
    hasExport?: boolean;
    exportPermission?: string;
    unique_api?: (values: any) => any;
};

const ATDTableCard = ({
    unique_api = exportAllATDs,
    hasExport = true,
    exportPermission = "export_compensation_atd",

}: ATDTableInterface) => {
    const api = useApiCall();
    const fetchModal = useModal();
    const viewModal = useModal();
    const [data, setData] = useState({});
    const [employee, setEmployee] = useState<any>({});
    const { permissions } = useContext(AuthContext);
    const paginator = usePagination();
    const filter = useFilter();

    const columnSettings = [
        {
            columnHead: "Transaction Number",
            path: "transaction_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "ATD Branch",
            path: "branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Deduction Type",
            path: "deduction.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Loan Amount",
            path: "amount",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                const value = Number(data.amount);
                return !value || value === 0
                    ? '-'
                    : value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
            }
        },
        {
            columnHead: "Month(s)",
            path: "months",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                const value = Number(data.months);
                return !value || value === 0
                    ? '-'
                    : value;
            }
        },
        {
            columnHead: "Monthly Amortization",
            path: "monthly_amortization",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                const value = Number(data.monthly_amortization);
                return !value || value === 0
                    ? '-'
                    : value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
            }
        },
        {
            columnHead: "Balance",
            path: "balance",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                const value = Number(data.balance);
                return !value || value === 0
                    ? '-'
                    : value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
            }
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
                    label: "View",
                    onClick: () => {
                        viewModal.onOpen();
                        setData(data);
                    }
                });

                return actions.length > 0 ? 
                <ActionDropDown 
                    data={data} 
                    actions={actions} 
                /> : "—";
            }
        }
    ];

    const actionSettings = [
        {
            label: "Fetch ATD From CSHub",
            onClick: () => {
                fetchModal.onOpen();
            }
        }
    ];

    const formHandler = useFormik({
        initialValues: {
            key_word: "",
            column_type: "transaction_number",
            employee_id: "",
            branch_id: "",
            deduction_id: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            key_word: Yup.string(),
            employee_id: Yup.number(),
            column_type: Yup.string().when('key_word', (keyWord, schema) => 
                String(keyWord) !== ""
                    ? schema.required('Column type is required')
                    : schema.notRequired()
            ),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            api.triggerReload();
            filter.onReload();
            filter.setFilters(values);
            setSubmitting(true);
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllEmployeeATDs({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters,
            employee_id: formHandler.values.employee_id,
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
    }, [paginator.reload, api.reload, filter.reload, formHandler.values.employee_id]);

    const exportHandler = useFormik({
        initialValues: {
            key_word: '',
            column_type: "",
            employee_id: "",
            branch_id: "",
            deduction_id: "",
        },
        validateOnChange: false,
        onSubmit: async (values) => {
            const isConfirm = await confirm({
                title: "Export",
                message: "Are you sure you want to export?"
            });

            if (isConfirm) {
                unique_api && unique_api(values).then((resp: any) => {
                    const blob = new Blob([resp.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');

                    a.href = downloadUrl;
                    a.download = `ATD-${moment().format('YYYY-MM-DD')}.xls`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            }
        }
    });

    return (
        <>
            <Card>
                <p className=" font-semibold text-red-800 dark:text-red-500">Filters</p>
                <form onSubmit={formHandler.handleSubmit}>
                    <Grid cols={4}>
                        <SearchEmployeeDropDown
                            label="Employee"
                            placeholder="select employee"
                            name="employee_id"
                            onChange={(e) => {
                                const selectedEmployee = e.target.value;
                                setEmployee(selectedEmployee);
                                formHandler.setFieldValue("employee_id", selectedEmployee.id);
                            }}
                            value={employee}
                            error={formHandler.errors.employee_id}
                        />
                        <Dropdown
                            placeholder="select column"
                            label="Column"
                            name="column_type"
                            value={formHandler.values.column_type}
                            error={formHandler.errors.column_type}
                            onChange={formHandler.handleChange}
                            options={columnSettings
                                .filter((column: any) => column.columnHead !== "Employee Name")
                                .map((column: any) => {
                                    return {
                                        label: column.columnHead,
                                        value: column.path
                                    };
                                })
                            }
                        />
                        <Textfield
                            name="key_word"
                            label="Keyword"
                            placeholder="enter keyword"
                            value={formHandler.values.key_word}
                            onChange={formHandler.handleChange}
                        />
                        <BranchDropDown
                            name="branch_id"
                            label="Branch"
                            placeholder="select branch"
                            value={formHandler.values.branch_id}
                            onChange={formHandler.handleChange}
                        />
                        <DeductionDropDown
                            name="deduction_id"
                            label="Deduction Type"
                            placeholder="select deduction"
                            value={formHandler.values.deduction_id}
                            onChange={formHandler.handleChange}
                        />
                    </Grid>
                    <div className="flex justify-end gap-x-2">
                        <div className="w-[100px]">
                            <Button
                                type="submit"
                                label="Search"
                                onClick={() => {}}
                            />    
                        </div>
                        {(exportPermission === "" || permissions.includes(exportPermission)) &&
                            <>
                                { hasExport &&
                                    <div className="w-[100px]">
                                        <Button
                                            label="Export"
                                            type="button"
                                            onClick={() => {
                                                exportHandler.setValues(prev => ({
                                                    ...prev,
                                                    ...formHandler.values
                                                }));
                                                exportHandler.submitForm();
                                            }}
                                            variant="success"
                                        />    
                                    </div>
                                }
                            </>
                        }
                        <div className="w-[100px]">
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    formHandler.resetForm();
                                    exportHandler.resetForm();
                                    formHandler.submitForm();
                                    setEmployee({});
                                }}
                                variant="secondary"
                            />    
                        </div>
                    </div>
                </form>
            </Card>
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={actionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <ViewATDModal
                modal={viewModal}
                data={data}
            />

            <FetchATDCshubModal
                modal={fetchModal}
                onSubmitCallback={api.triggerReload}
            />
        </>
    );
};

export default ATDTableCard;