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
import {generateTimeKeepingSummary, getAllTimeKeepingSummary, exportAllTimeKeepingSummary } from "@/api/transactions/time-keeping";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import Dropdown from "@/components/common/Dropdown";
import moment from "moment";
import { getCurrentCutoff } from "@/helper/cutoff";
import CutOffDropDown from "../../generic/CutOffDropDown";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useModal } from "@/hooks/modal";
import GenerateTimeKeepingModal from "./GenerateTimekeepingModal";
import ActionDropDown from "@/components/common/ActionDropDown";
import AddTaxableAdjustmentModal from "./AddTaxableAdjustmentModal";

interface FilterInterface {
    hasExport?: boolean;
    exportPermission?: string;
    unique_api?: (values: any) => any;
};

const TimeKeepingSummaryTableCard = ({
    unique_api = exportAllTimeKeepingSummary,
    hasExport = true,
    exportPermission = "export_all_transactions_time_keeping_summary",
}: FilterInterface) => {
    const paginator = usePagination(20);
    const api = useApiCall();
    const { permissions } = useContext(AuthContext);
    const [branch, setBranch] = useState<any>(null);
    const generateModal= useModal();
    const addAdjustmentModal = useModal();
    const [selectedSummary, setSelectedSummary] = useState<any>({});
    const canAddAdjustment = permissions.includes("perform_transactions_adjustments");

    const columnSettings = [
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p
                        className = {`${data.employee.current_position.timekeeping_type === "Monthly" ? "text-blue-600" : ""}`}
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
            columnHead: "Home Branch",
            path: "employee.current_branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Timekeeping Branch",
            path: "branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Regular Days",
            path: "regular_days",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p className="font-semibold">
                        {Math.floor(data.regular_days * 2) / 2 }
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
            path: "night_differential",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Night Diff Overtime",
            path: "night_differential_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday Hours",
            path: "legal_holiday",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday Overtime",
            path: "legal_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday Hours",
            path: "special_holiday",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday Overtime",
            path: "special_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Cancelled Off",
            path: "cancelled_off",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Action",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (!canAddAdjustment) {
                    return "—";
                }

                return (
                    <ActionDropDown
                        containerClassName="w-[115px]"
                        data={data}
                        actions={[
                            {
                                label: "Add Taxable Adjustment",
                                permission: "perform_transactions_adjustments",
                                onClick: (row: any) => {
                                    setSelectedSummary(row);
                                    addAdjustmentModal.onOpen();
                                }
                            }
                        ]}
                        permissions={permissions}
                    />
                );
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
            branch_id: Yup.string(),
            year: Yup.string().required("Year is required"),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            if (values.action === "generate") {
                const isConfirmed = await confirm({
                    title: "Timekeeping Summary",
                    message: "Are you sure you want to generate timekeeping summary?"
                });
    
                if (isConfirmed) {
                    generateTimeKeepingSummary(values)
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

        api.setLoading(true);

        getAllTimeKeepingSummary({
            page: paginator.page,
            per_page: paginator.per_page,
            ...formHandler.values
        }).then((resp) => {
            if (!resp.error) {
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            } else {
                toast.error("Error fetching timekeeping summary");
            }
        }).finally(() => {
            api.setLoading(false);
        });
    }, [paginator.reload, api.reload]);
    
    const exportHandler = useFormik({
        initialValues: {
            key_word: '',
            column_type: '',
            fields: [],
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
                    const branchName = branch?.short_name ?? 'all-branches';
    
                    a.href = downloadUrl;
                    a.download = `${branchName.toUpperCase()}-TIMEKEEPING-SUMMARY-${formHandler.values.selected_cutoff+"-"+formHandler.values.year}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
                
            }
        }
    });

    const actionSettings = [
        {
            label: "Generate Timekeeping",
            onClick: () => {
                generateModal.onOpen();
            }
        },
    ];

    return (
        <>
            <Card>
                <p className=" font-semibold text-red-800 dark:text-red-500">Filters</p>
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
                                const branch = e.target.obj;
                                setBranch(branch);
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
                    <div className="flex justify-end gap-x-2">
                        <div className="w-[100px]">
                            <Button
                                label="Search"
                                onClick={() => {
                                    formHandler.setFieldValue("action", "search");
                                    formHandler.submitForm();
                                    paginator.setPage(1);
                                    api.triggerReload();
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
                                    exportHandler.resetForm();
                                    setBranch(null);
                                }}
                                variant="secondary"
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
                    smallText
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <GenerateTimeKeepingModal
                modal={generateModal}
            />

            <AddTaxableAdjustmentModal
                modal={addAdjustmentModal}
                data={selectedSummary}
                onSubmitCallback={() => {
                    api.triggerReload();
                }}
            />
        </>
    );
};

export default TimeKeepingSummaryTableCard;
