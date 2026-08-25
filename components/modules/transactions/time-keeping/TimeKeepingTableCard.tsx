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
import { generateTimeKeeping, getAllTimeKeeping, exportAllTimeKeeping} from "@/api/transactions/time-keeping";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import moment from "moment";
import Dropdown from "@/components/common/Dropdown";
import CutOffDropDown from "../../generic/CutOffDropDown";
import { getCurrentCutoff } from "@/helper/cutoff";
import { useModal } from "@/hooks/modal";
import EditUndertimeModal from "./EditUndertimeModal";
import Accordion from "@/components/common/Accordion";

interface FilterInterface {
    hasExport?: boolean;
    exportPermission?: string;
    unique_api?: (values: any) => any;
};

const TimeKeepingTableCard = ({
    unique_api = exportAllTimeKeeping,
    hasExport = true,
    exportPermission = "export_all_transactions_time_keeping",
}: FilterInterface) => {
    const paginator = usePagination(10);
    const api = useApiCall();
    const editModal = useModal();
    const { permissions } = useContext(AuthContext);
    const [branch, setBranch] = useState<any>(null);
    const [selectedTimekeeping, setSelectedTimekeeping] = useState<any>({});

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
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Actual Worked Hours",
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
            columnHead: "Final Worked Hours",
            path: "final_worked_hours",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p className="font-semibold">
                        {Math.floor(data.final_worked_hours * 2) / 2 }
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
            columnHead: "Computed OT",
            path: "regular_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Night Diff Hours",
            path: "night_diff_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Night Diff OT",
            path: "night_diff_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday Hours",
            path: "legal_holiday_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday OT",
            path: "legal_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday Hours",
            path: "special_holiday_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday OT",
            path: "special_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Cancelled Off",
            path: "cancelled_off_hours",
            columnType: COLUMNTYPES.timekeeping
        },
                {
            columnHead: "Cancelled Off OT",
            path: "cancelled_off_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Approved Overtime",
            path: "approved_overtime",
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

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                setSelectedTimekeeping(data);
                editModal.onOpen();
            }
        },
    ];

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
                    a.download = `${branchName.toUpperCase()}-TIMEKEEPING-${formHandler.values.selected_cutoff+"-"+formHandler.values.year}.xls`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            }
        }
    });

    useAsyncEffect(() => {
        api.setLoading(false);
            
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
    }, [paginator.reload, api.reload]);

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
                        {(exportPermission === "" || permissions.includes(exportPermission)) &&
                            <>
                                { hasExport &&
                                    <div>
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
                                            isIcon
                                            iconType="export"
                                        />    
                                    </div>
                                }
                            </>
                        }
                        <div>
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
                                isIcon
                                iconType="reset"
                            />    
                        </div>
                    </div>
                </form>
            </Accordion>
            <Card>
                <p className=" font-semibold text-red-800 dark:text-red-500">Timekeeping</p>
                <Table
                    smallText
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <EditUndertimeModal
                modal={editModal}
                data={selectedTimekeeping}
                onSubmitCallback={() => {
                    api.triggerReload();
                }}
            />
        </>
    );
};

export default TimeKeepingTableCard;
