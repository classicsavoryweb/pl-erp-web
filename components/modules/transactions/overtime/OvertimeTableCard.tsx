"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useContext, useState } from "react";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import Badge from "@/components/common/Badge";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import * as Yup from "yup";
import ImportModal from "./ImportModal";
import { AuthContext } from "@/context/AuthProvider";
import Grid from "@/components/common/Grid";
import BranchDropDown from "../../generic/BranchDropDown";
import ActionDropDown from "@/components/common/ActionDropDown";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import CutOffDropDown from "../../generic/CutOffDropDown";
import { approveBulkOvertime, exportAllOvertime, getAllOvertime, approveOvertime, unapproveOvertime } from "@/api/transactions/overtime";

interface FilterInterface {
    hasExport?: boolean;
    exportPermission?: string;
    unique_api?: (values: any) => any;
    statusOption?: {label: string, value: string}[];
};

const OvertimeTableCard = ({
    unique_api = exportAllOvertime,
    hasExport = true,
    exportPermission = "export_all_transactions_overtime",
    statusOption = [
        {
            label: "Approved",
            value: "Approved"
        },
        {
            label: "Unapproved",
            value: "Unapproved"
        }
    ],
}: FilterInterface) => {
    const api = useApiCall();
    const importModal = useModal();
    const { permissions } = useContext(AuthContext);
    const [branch, setBranch] = useState<any>({});
    const paginator = usePagination(20);
    const filter = useFilter();

    const columnSettings = [
        {
            columnHead: "Date Filed",
            path: "date_filed",
            columnType: COLUMNTYPES.date,
        },
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Biometric Number",
            path: "employee.biometric_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "employee.current_branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Position",
            path: "employee.current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Overtime Date",
            path: "overtime_date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Total Hours",
            path: "total_hours",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Purpose",
            path: "purpose",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                let status: "default" | "success" | "danger" = "default";

                switch (data.status) {
                    case "Approved":
                        status = "success";
                        break;
                    case "Unapproved":
                        status = "danger";
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
        {
            columnHead: "Action",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let actions = tableActions;
                if (data.status === "Unapproved") {
                    actions = [
                        tableActions[0],
                    ];
                } else if (data.status === "Approved") {
                    actions = [
                        tableActions[1],
                    ];
                } else {
                    actions = [tableActions[0]]; 
                }
                
                return (
                    <ActionDropDown
                        data={data}
                        actions={actions}
                    />
                );
            }
        }
    ];

    const tableActions = [
        {
            label: "Approve",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Approve Overtime",
                    message: "Are you sure you want to approve this overtime?",
                });

                isConfirmed &&
                approveOvertime(data.id).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            },
            permission: "approve_all_transactions_overtime"
        },
        {
            label: "Unapprove",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Unapprove Overtime",
                    message: "Are you sure you want to unapprove this overtime?",
                });

                isConfirmed &&
                unapproveOvertime(data.id).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            },
            permission: "unapprove_all_transactions_overtime"
        },
    ];

    const approveBulk = useFormik({
        initialValues: {
            overtime_id: []
        },
        validateOnChange: false,
        onSubmit:async (values, {resetForm}) => {
            if (values.overtime_id.length === 0) {
                toast.error("Must select atleast 1 record");
            } else {
                approveBulkOvertime(values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        resetForm();
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
            
        }
    });

    const globalActionSettings = [
        {
            label: "Import Overtime",
            onClick: () => {
                importModal.onOpen();
            }
        },
        {
            label: "Approve Selected",
            onClick: async () => {
                const isConfirm = await confirm({
                    title: "Approve Bulk Overtime",
                    message: "Are you sure you want to approve this overtime?"
                });
                if (isConfirm) {
                    await approveBulk.submitForm();
                }
            }
        }
    ];

    const formHandler = useFormik({
        initialValues: {
            key_word: "",
            column_type: "employee.full_name",
            branch_id: "",
            status: "",
            cutoff: null,
            selected_cutoff: "",
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
        getAllOvertime({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching overtime");
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

    const exportHandler = useFormik({
        initialValues: {
            key_word: '',
            column_type: '',
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
                    const branchName = branch ? branch.name : 'default-branch';
    
                    a.href = downloadUrl;
                    a.download = `${branchName.toUpperCase()}-OVERTIME-${moment().format('YYYY-MM-DD')}.xls`;
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
                                formHandler.setFieldValue("cutoff", e.target.obj || null);
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
                        <Dropdown
                            placeholder="select status"
                            label="Status"
                            name="status"
                            value={formHandler.values.status}
                            onChange={formHandler.handleChange}
                            options={statusOption}
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
                        actions={globalActionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withCheckBox
                    onCheck={(e: any) => {
                        if (e.target.checked) {
                            approveBulk.setFieldValue("overtime_id",
                                [...approveBulk.values.overtime_id,
                                    e.target.value
                            ]);
                        } else {
                            const overtime_ids = approveBulk.values.overtime_id;
                            overtime_ids.filter((overtime) => overtime !== e.target.value);
                            approveBulk.setFieldValue("overtime_id", overtime_ids);
                        }
                    }}
                />
            </Card>
            <ImportModal
                modal={importModal}
            />
        </>
    );
};

export default OvertimeTableCard;