"use client";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";;
import { toast } from "react-toastify";
import moment from "moment";
import { getAllPayroll } from "@/api/compensation/payroll";
import * as Yup from "yup";
import { useFormik } from "formik";
import confirm from "@/components/common/Confirm";
import { getCurrentCutoff } from "@/helper/cutoff";
import Grid from "@/components/common/Grid";
import Dropdown from "@/components/common/Dropdown";
import Textfield from "@/components/common/Textfield";
import BranchDropDown from "../../generic/BranchDropDown";
import CutOffDropDown from "../../generic/CutOffDropDown";
import Button from "@/components/common/Button"
import Badge from "@/components/common/Badge";
import Accordion from "@/components/common/Accordion";

const PayrollTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllPayroll({
            page: paginator.page,
            per_page: paginator.per_page,
            ...formHandler.values
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching payroll");
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
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employee Number",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Branch",
            path: "timekeeping_branch.short_name",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Position",
            path: "position.description",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Regular Days",
            path: "details.regular_days",
            columnType: COLUMNTYPES.string,
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
            key_word: "",
            column_type: "employee.full_name",
            branch_id : "",
            action: "",
            cutoff: {
                ...getCurrentCutoff()
            },
            selected_cutoff: getCurrentCutoff().range,
            year: moment().year(),
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            key_word: Yup.string(),
            column_type: Yup.string().when('key_word', (keyWord, schema) => 
                String(keyWord) !== ""
                    ? schema.required('Column type is required')
                    : schema.notRequired()
            ),
            year: Yup.string().required("Year is required"),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            if (values.action === "generate") {
                const isConfirmed = await confirm({
                    title: "Payroll",
                    message: "Are you sure you want to generate payroll?"
                });
    
                if (isConfirmed) {
                    
                }
            }
        }
    });

    const actionSettings = [
        {
            label: "View",
            onClick: (data:any) => {
                window.open(`/compensation/payroll/${data.id}`, "_blank");
            }
        }
    ];

    return (
        <>
            <Accordion
                title="Filters"
                isExpanded
            >
                <form onSubmit={formHandler.handleSubmit}>
                    <Grid cols={4}>
                        <Dropdown
                            placeholder="select column"
                            label="Column"
                            name="column_type"
                            value={formHandler.values.column_type}
                            error={formHandler.errors.column_type}
                            onChange={formHandler.handleChange}
                            options={columnSettings.map((column:any) => {
                                return {
                                    label: column.columnHead,
                                    value: column.path
                                }
                            })}
                        />
                        <Textfield
                            name="key_word"
                            label="Keyword"
                            placeholder="enter keyword"
                            value={formHandler.values.key_word}
                            onChange={formHandler.handleChange}
                        />
                        <BranchDropDown
                            placeholder="select branch"
                            label="Timekeeping Branch"
                            name="branch_id"
                            value={formHandler.values.branch_id}
                            onChange={(e) => {
                                formHandler.handleChange(e);
                            }}
                            error={formHandler.errors.branch_id}
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
                    </Grid>
                    <div className="flex justify-end gap-x-1">
                        <div>
                            <Button
                                label="Search"
                                onClick={() => {
                                    formHandler.setFieldValue("action", "search");
                                    formHandler.submitForm();
                                    paginator.setPage(1);
                                    api.triggerReload();
                                }}
                                isIcon
                                iconType="search"
                            />    
                        </div>
                        <div>
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    api.setDataSet([]);
                                    formHandler.resetForm();
                                    // exportHandler.resetForm();
                                }}
                                variant="secondary"
                                isIcon
                                iconType="reset"
                            />    
                        </div>
                    </div>
                </form>
            </Accordion>
            <Card>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={actionSettings}
                />
            </Card>
        </>
    );
};

export default PayrollTableCard;