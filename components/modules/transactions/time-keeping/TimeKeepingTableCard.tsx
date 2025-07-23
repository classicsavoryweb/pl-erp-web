"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Grid from "@/components/common/Grid";
import BranchDropDown from "../../generic/BranchDropDown";
import { generateTimeKeeping, getAllTimeKeeping } from "@/api/transactions/time-keeping";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import moment from "moment";
import Dropdown from "@/components/common/Dropdown";
import CutOffDropDown from "../../generic/CutOffDropDown";
import { getCurrentCutoff } from "@/helper/cutoff";

const TimeKeepingTableCard = () => {
    const paginator = usePagination();
    const api = useApiCall();

    const columnSettings = [
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p
                        className = {`${data.employee.current_position.timekeeping_type === "Daily" ? "text-red-500" : ""}`}
                    >
                        {data.employee.full_name}
                    </p>
                );
            }
        },
        {
            columnHead: "Position",
            path: "employee.current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Biometric Number",
            path: "employee.biometric_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Worked Hours",
            path: "worked_hours",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p className="font-semibold">
                        {Math.floor(data.worked_hours * 2) / 2 }
                    </p>
                );
            }
        },
        {
            columnHead: "Tardiness",
            path: "tardiness",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.tardiness == 0) {
                    return "—";
                }

                return (
                    <p className="font-semibold text-red-500">
                        {Math.floor(Number(data.tardiness)) }
                    </p>
                );
            }
        },
        {
            columnHead: "Undertime",
            path: "undertime",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.undertime == 0) {
                    return "—";
                }

                return (
                    <p className="font-semibold text-red-500">
                        {Math.floor(Number(data.undertime)) }
                    </p>
                );
            }
        },
        {
            columnHead: "Overtime",
            path: "regular_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Night Diff Hours",
            path: "night_diff_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Night Diff Overtime",
            path: "night_diff_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday Hours",
            path: "legal_holiday_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday Overtime",
            path: "legal_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday Hours",
            path: "special_holiday_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday Overtime",
            path: "special_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Travel Time",
            path: "travel_time",
            columnType: COLUMNTYPES.timekeeping
        },

    ];

    const formHandler = useFormik({
        initialValues: {
            key_word: "",
            column_type: "",
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
            branch_id: Yup.string().required("Branch is required"),
            year: Yup.string().required("Year is required"),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            if (values.action === "generate") {
                const isConfirmed = await confirm({
                    title: "Timekeeping",
                    message: "Are you sure you want to generate timekeeping?"
                });
    
                if (isConfirmed) {
                    generateTimeKeeping(values)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success(resp.data.message);
                        } else {
                            toast.error(resp.data.message);
                        }
                    }).catch(() => {
                        toast.error("Error encountered");
                    }).finally(() => {
                        setSubmitting(false);
                    });
                }
            }
        }
    });

    useAsyncEffect(() => {
        api.setLoading(false);
        if (formHandler.values.branch_id) {
            api.setLoading(true);
            getAllTimeKeeping({
                page: paginator.page,
                per_page: paginator.per_page,
                ...formHandler.values
            }).then((resp) => {
                if (!resp.error) {
                    api.setDataSet(resp.data.data);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                } else {
                    toast.error("Error fetching timekeeping");
                }
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [paginator.reload, api.reload])
    

    return (
        <>
            <Card>
                <p className="text-sm font-semibold text-red-800">Filters</p>
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
                            label="Branch"
                            name="branch_id"
                            value={formHandler.values.branch_id}
                            onChange={formHandler.handleChange}
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
                    <div className="flex justify-end gap-x-2">
                        <div className="w-[100px]">
                            <Button
                                label="Search"
                                onClick={() => {
                                    formHandler.setFieldValue("action", "search");
                                    formHandler.submitForm();
                                    api.triggerReload();
                                }}
                            />    
                        </div>
                        <div className="w-[100px]">
                            <Button
                                label="Generate"
                                onClick={() => {
                                    formHandler.setFieldValue("action", "generate");
                                    formHandler.submitForm();
                                }}
                            />    
                        </div>
                        <div className="w-[100px]">
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    api.setDataSet([]);
                                    formHandler.resetForm();
                                }}
                                variant="secondary"
                            />    
                        </div>
                    </div>
                </form>
            </Card>
            <Card>
                <p className="text-sm font-semibold text-red-800">Timekeeping</p>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
        </>
    );
};

export default TimeKeepingTableCard;