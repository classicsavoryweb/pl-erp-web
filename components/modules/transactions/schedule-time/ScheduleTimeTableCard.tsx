"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import moment from "moment";
import ImportModal from "./ImportModal";
import DropDownButtons from "@/components/common/DropDownButtons";
import { exportAllTransactionsScheduleTime, getAllTransactionsScheduleTime } from "@/api/transactions/schedule-time";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import Grid from "@/components/common/Grid";
import BranchDropDown from "../../generic/BranchDropDown";
import confirm from "@/components/common/Confirm";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthProvider";
import Dropdown from "@/components/common/Dropdown";
import { useFilter } from "@/hooks/use-filter";
import { getCurrentCutoff } from "@/helper/cutoff";
import CutOffDropDown from "../../generic/CutOffDropDown";
import FetchScheduleModal from "./FetchScheduleModal";
// import ActionDropDown from "@/components/common/ActionDropDown";
// import TransferTimeKeepingBranchModal from "./TransferTimeKeepingBranchModal";
import TransferTimeKeepingBranchAllModal from "./TransferTimeKeepingBranchAllModal";
import Accordion from "@/components/common/Accordion";
import EditScheduleTimeModal from "./EditScheduleTimeModal";
import ActivityLogsModal from "../../generic/ActivityLogsModal";
import { canEditRestrictedRecords } from "@/helper/restriction";

interface FilterInterface {
    hasExport?: boolean;
    exportPermission?: string;
    columnSort?: boolean;
    unique_api?: (values: any) => any;
};

const ScheduleTimeTableCard = ({
    unique_api = exportAllTransactionsScheduleTime,
    hasExport = true,
    exportPermission = "export_all_transactions_schedule_time",

}: FilterInterface) => {
    const api = useApiCall();
    const importModal = useModal();
    const fetchModal = useModal();
    // const transferModal = useModal();
    const transferAllModal = useModal();
    const editModal = useModal();
    const activityLogsModal = useModal();
    const paginator = usePagination(10);
    const { permissions } = useContext(AuthContext);
    const [branch, setBranch] = useState<any>({});
    const filter = useFilter();
    const [data, setData] = useState<any>({});

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
            columnHead: "Timekeeping Branch",
            path: "branch.short_name",
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
            columnType: COLUMNTYPES.date,
        },
        {
            columnHead: "Timetable",
            path: "timetable",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Check In",
            path: "check_in",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Check Out",
            path: "check_out",
            columnType: COLUMNTYPES.string,
        },
        // {
        //     columnHead: "Action",
        //     path: "check_out",
        //     columnType: COLUMNTYPES.function,
        //     function: (data:any) => {
        //         const {start_time, end_time} = getCurrentCutoff();
        //         const date = moment(data.date);
        //
        //         return (
        //             <ActionDropDown
        //                 data={data}
        //                 actions={[
        //                     {
        //                         label: "Transfer Branch",
        //                         onClick: (data) => {
        //                             transferModal.onOpen();
        //                             api.setData(data);
        //                         }
        //                     }
        //                 ]}
        //             />
        //         );
        //
        //     }
        // }
    ];

    const globalActionSettings = [
        {
            label: "Import Actual Schedule",
            onClick: () => {
                importModal.onOpen();
            }
        },
        {
            label: "Fetch Actual Schedule",
            onClick: () => {
                fetchModal.onOpen();
            }
        },
        {
            label: "Transfer Branch All",
            onClick: () => {
                transferAllModal.onOpen();
            }
        },
    ];

    const actions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                if (
                    !canEditRestrictedRecords(permissions, "TIME_KEEPING", "EMPLOYEE", data.employee.employee_number, 0) ||
                    !canEditRestrictedRecords(permissions, "TIME_KEEPING", "BRANCH", "", data.branch_id)
                ) {
                    return;
                }

                setData(data);
                editModal.onOpen();
            }
        },
        {
            label: "Logs",
            onClick: (data: any) => {
                setData(data);
                activityLogsModal.onOpen();
            }
        }
    ]

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
            paginator.setPage(1);
            api.triggerReload();
            filter.onReload();
            filter.setFilters(values);
            setSubmitting(true);
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllTransactionsScheduleTime({
            page: paginator.page,
            per_page: paginator.per_page,
            ...formHandler.values 
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching schedules");
            } else {
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => toast.error("Error encountered"))
        .finally(() => api.setLoading(false));
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
                    const branchName = branch?.name ?? 'all-branches';
    
                    a.href = downloadUrl;
                    a.download = `${branchName.toUpperCase()}-SCHEDULE-TIME-${moment().format('YYYY-MM-DD')}.xls`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            }
        }
    });

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
                    </Grid>
                    <div className="flex justify-end gap-x-1">
                        <div>
                            <Button
                                type="submit"
                                label="Search"
                                onClick={() => {}}
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
                                    formHandler.resetForm();
                                    exportHandler.resetForm();
                                    formHandler.submitForm();
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
                    actions={actions}
                />
            </Card>

            <ImportModal
                modal={importModal}
                api={api}
            />

            <FetchScheduleModal
                modal={fetchModal}
            />

            <TransferTimeKeepingBranchAllModal
                modal={transferAllModal}
                filterValues={formHandler.values}
                currentBranch={branch}
                onSubmitCallback={() => {
                    api.triggerReload();
                }}
            />
            <EditScheduleTimeModal
                modal={editModal}
                data={data}
                onSubmitCallBack={api.triggerReload}
            />
            <ActivityLogsModal
                modal={activityLogsModal}
                title="Schedule Time"
                data={data}
                logName="Schedule Time"
            />
        </>
    );
};

export default ScheduleTimeTableCard;
