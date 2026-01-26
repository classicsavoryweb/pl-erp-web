"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useContext, useState } from "react";
import Badge from "@/components/common/Badge";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import { getAllTransactionsActualTime } from "@/api/transactions/actual-time";
import ActualTimeModal from "./ActualTimeModal";
import EditActualTimeModal from "./EditActualTImeModal";
import DropDownButtons from "@/components/common/DropDownButtons";
import CreateLogModal from "./CreateLogModal";
import moment from "moment";
import confirm from "@/components/common/Confirm";
import { triggerFetchBiotime } from "@/api/transactions/time-keeping";
import { exportAllTransactionsActualLogs } from "@/api/transactions/actual-time";
import ImportBiotimeLog from "./ImportBiotimeLog";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import Grid from "@/components/common/Grid";
import BranchDropDown from "../../generic/BranchDropDown";
import { AuthContext } from "@/context/AuthProvider";
import Dropdown from "@/components/common/Dropdown";
import { getCurrentCutoff } from "@/helper/cutoff";
import CutOffDropDown from "../../generic/CutOffDropDown";
import FetchBiotimeLogsModal from "./FetchBiotimeLogs";

interface FilterInterface {
    hasExport?: boolean;
    exportPermission?: string;
    columnSort?: boolean;
    unique_api?: (values: any) => any;
};

const ActualTimeTableCard = ({
    unique_api = exportAllTransactionsActualLogs,
    hasExport = true,
    exportPermission = "export_all_transactions_actual_logs",

}: FilterInterface) => {
    const api = useApiCall();
    const viewModal = useModal();
    const createLogModal = useModal();
    const fetchLogModal = useModal();
    const editModal = useModal();
    const importModal = useModal();
    const [data, setData] = useState<any[]>([]);
    const [selectedLog, setSelectedLog] = useState<string>("0");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedPunchCount, setSelectedPunchCount] = useState<number>(0);
    const [branch, setBranch] = useState<any>({});
    const { permissions } = useContext(AuthContext);
    const paginator = usePagination(20);
    const filter = useFilter();

    const columnSettings = [
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
            columnHead: "Home Branch",
            path: "employee.current_branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let status: "danger" | "default" | "warning" | "success" = "default";

                switch(data.status) {
                    case "COMPLETE":
                        status="success";
                    break;
                    case "INCOMPLETE":
                        status="warning";
                    break;
                }

                return (
                    <Badge
                        label={data.status}
                        status={status}                    
                    />
                )
            }
        },
    ];

    const actionSettings = [
        {
            label: "Create Log",
            onClick: () => {
                createLogModal.onOpen();
            }
        },
        {
            label: "Fetch Biotime",
            onClick: () => {
                fetchLogModal.onOpen();
            }
        },
        // {
        //     label: "Import Biotime Logs",
        //     onClick: async () => {
        //         importModal.onOpen();
        //     }
        // },
    ];

    const tableActions = [
        {
            label: "View",
            onClick: (data: any) => {
                setSelectedLog(data.id);
                setData(data.punches);
                viewModal.onOpen();
            }
        },
        {
            label: "Edit",
            onClick: (data: any) => {
                setSelectedLog(data.id);
                setData(data.punches);
                setSelectedStatus(data.status);
                setSelectedPunchCount(Array.isArray(data.punches) ? data.punches.length : 0);
                editModal.onOpen();
            }
        },
    ];

    const formHandler = useFormik({
        initialValues: {
            key_word: "",
            column_type: "employee.full_name",
            branch_id: "",
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
        getAllTransactionsActualTime({
            page: paginator.page,
            per_page: paginator.per_page,
            ...formHandler.values 
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching logs");
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
                    const branchName = branch && branch.name ? branch.name : 'default-branch';
                        
                    a.href = downloadUrl;
                    a.download = `${branchName.toUpperCase()}-ACTUAL-LOGS-${moment().format('YYYY-MM-DD')}.xls`;
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
                            label="Home Branch"
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
                        actions={actionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <ActualTimeModal
                modal={viewModal}
                data={data}
            />

            <EditActualTimeModal
                modal={editModal}
                data={data}
                selectedLog={selectedLog}
                allowRemoveExisting={
                    selectedStatus === "MULTIPLE LOGS" ||
                    (selectedStatus === "INCOMPLETE" && selectedPunchCount === 3)
                }
                onSubmitCallBack={() => {
                    api.triggerReload();
                }}
            />

            <CreateLogModal
                modal={createLogModal}
                onSubmitCallback={() => {
                    api.triggerReload();
                }}
            />

            <ImportBiotimeLog
                modal={importModal}
            />

            <FetchBiotimeLogsModal
                modal={fetchLogModal}
            />
        </>
    );
};

export default ActualTimeTableCard;
