"use client";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";;
import { toast } from "react-toastify";
import Badge from "@/components/common/Badge";
import { exportPayrollProoflistConverter, generatePayrollProoflistConverter, getAllPayrollProofList } from "@/api/compensation/payroll-prooflist";
import confirm from "@/components/common/Confirm";
import { useFormik } from "formik";
import { getCurrentCutoff } from "@/helper/cutoff";
import moment from "moment";
import * as Yup from "yup";
import Grid from "@/components/common/Grid";
import Dropdown from "@/components/common/Dropdown";
import CutOffDropDown from "../../../generic/CutOffDropDown";
import Button from "@/components/common/Button";
import BankAccountTypeDropDown from "../../../generic/BankAccounTypeDropDown";
import BranchDropDown from "../../../generic/BranchDropDown";

const PayrollProofListTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllPayrollProofList({
            page: paginator.page,
            per_page: paginator.per_page,
            ...formHandler.values
        })
        .then((resp) => {
            if (resp.error) {
                toast.error(resp.data.message);
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
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return data.last_name + ", " + data.first_name;
            }
        },
        {
            columnHead: "Employee Number",
            path: "employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Net Pay",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                switch(data.status) {
                    case "final": 
                        status = "success";
                        break;
                    case "initial":
                        status = "warning";
                        break;
                    default:
                        status = "default";
                        break;
                };

                return <Badge
                    label={data.status}
                    status={status}
                />
            }
        },
    ];

    const formHandler = useFormik({
        initialValues: {
            action: "",
            cutoff: {
                ...getCurrentCutoff()
            },
            selected_cutoff: getCurrentCutoff().range,
            bank_account_type_id: "1",
            type: "PAYROLL",
            year: moment().year(),
            branch_id: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            year: Yup.string().required("Year is required"),
            type: Yup.string().required("Type is required"),
            bank_account_type_id: Yup.string().required("Bank Account Type is required"),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            if (values.action === "generate") {
                const isConfirmed = await confirm
                ({
                    title: "Payroll Prooflist",
                    message: "Are you sure you want to generate converter?"
                });

                if (isConfirmed) {
                    generatePayrollProoflistConverter(values)
                    .then((resp) => {
                        if (!resp.error) {
                            const blob = new Blob([resp.data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
        
                            const downloadUrl = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
            
                            a.href = downloadUrl;
                            a.download = `${values.bank_account_type_id == "1" ? "CASH_CARD" : "SAVINGS"}_${values.type}_${moment().format('YYYY-MM-DD')}.xlsm`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                        } else {
                            if (resp.status === 404) {
                                toast.error("You cant generate inactive cutoff");
                            } else if (resp.status === 409) {
                                toast.error("You cant generate unfinalized cutoff");
                            }
                        }
                    });
                }
            }

            if (values.action === "export") {
                const isConfirmed = await confirm({
                    title: "Prooflist",
                    message: "Are you sure you want to export?"
                });

                if (isConfirmed) {
                    exportPayrollProoflistConverter(values).then((resp: any) => {
                        const blob = new Blob([resp.data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        const downloadUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');

                        a.href = downloadUrl;
                        a.download = `${formHandler.values.type}-PROOFLIST-${moment().format('YYYY-MM-DD')}.xls`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    });
                }
            }
            
        }
    });

    return (
        <>
            <Card>
                <p className=" font-semibold text-red-800 dark:text-red-500">Filters</p>
                <form onSubmit={formHandler.handleSubmit}>
                    <Grid cols={5}>
                        <BankAccountTypeDropDown
                            placeholder="select bank account type"
                            label="Bank Account Type"
                            name="bank_account_type_id"
                            value={formHandler.values.bank_account_type_id}
                            error={formHandler.errors.bank_account_type_id}
                            onChange={formHandler.handleChange}
                            withCashOption
                            withAllOption 
                        />
                        <Dropdown
                            placeholder="select type"
                            label="Type"
                            name="type"
                            value={formHandler.values.type}
                            error={formHandler.errors.type}
                            options={[
                                {
                                    label: "Incentives",
                                    value: "INCENTIVES"
                                },
                                {
                                    label: "Payroll",
                                    value: "PAYROLL"
                                }
                            ]}
                            onChange={(e) => {
                                formHandler.handleChange(e);
                                api.setDataSet([]);
                            }}
                        />
                        <CutOffDropDown
                            value={formHandler.values.selected_cutoff}
                            onChange={(e) => {
                                formHandler.setFieldValue("selected_cutoff", e.target.value);
                                formHandler.setFieldValue("cutoff", e.target.obj);
                            }}
                        />
                        <Dropdown
                            placeholder="select year"
                            label="Year"
                            name="year"
                            value={String(formHandler.values.year)}
                            onChange={formHandler.handleChange}
                            options={Array.from({ length: 100 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return { label: year.toString(), value: year.toString() };
                            })}
                        />
                        <BranchDropDown
                            placeholder="select branch"
                            label="Branch"
                            name="branch_id"
                            value={formHandler.values.branch_id}
                            onChange={formHandler.handleChange}
                        />
                    </Grid>
                    <div className="flex justify-end gap-x-2">
                        <div>
                            <Button
                                label="Search"
                                type="button"
                                onClick={() => {
                                    paginator.setPage(1);
                                    if (formHandler.values.bank_account_type_id === "ALL") {
                                        paginator.setPerPage(9999); 
                                    } else {
                                        paginator.setPerPage(10); 
                                    }
                                    api.triggerReload();
                                }}
                            />    
                        </div>
                        { formHandler.values.bank_account_type_id !== "ALL" && Number(formHandler.values.bank_account_type_id) !== 0 &&
                            <div>
                                <Button
                                    variant="success"
                                    label="Converter"
                                    type="button"
                                    onClick={() => {
                                        formHandler.setFieldValue("action", "generate");
                                        formHandler.submitForm();
                                    }}
                                />    
                            </div>
                        }
                        <div>
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    formHandler.resetForm();
                                }}
                                variant="secondary"
                            />    
                        </div>
                        <div>
                            <Button
                                variant="success"
                                label="Export"
                                type="button"
                                onClick={async () => {
                                    formHandler.setFieldValue("action", "export");
                                    formHandler.submitForm();
                                }}
                            />    
                        </div>
                    </div>
                </form>
            </Card>
            <Card>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={
                        formHandler.values.type === "PAYROLL"
                        ? columnSettings
                        : [
                            columnSettings[0],
                            columnSettings[1],
                            {
                                columnHead: "Deduction Percent",
                                path: "adjustment_percent",
                                columnType: COLUMNTYPES.amount
                            },
                            {
                                columnHead: "Additional Incentives",
                                path: "additional_incentive",
                                columnType: COLUMNTYPES.amount
                            },
                            {
                                columnHead: "1st Cutoff Worked Days",
                                path: "first_cut_off_worked_days",
                                columnType: COLUMNTYPES.string
                            },
                            {
                                columnHead: "2nd Cutoff Worked Days",
                                path: "second_cut_off_worked_days",
                                columnType: COLUMNTYPES.string
                            },
                            {
                                columnHead: "Incentive Amount",
                                path: "amount",
                                columnType: COLUMNTYPES.amount
                            },
                            columnSettings[3],
                        ]
                    }
                    loading={api.loading}
                    paginator={paginator}
                    // withActions
                    // actions={actionSettings}
                />
            </Card>
        </>
    );
};

export default PayrollProofListTableCard;