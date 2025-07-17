"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useState } from "react";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import Badge from "@/components/common/Badge";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import CreateOvertimeForm from "./CreateOvertimeForm";
import EditOvertimeForm from "./EditOvertimeForm";
import ImportModal from "./ImportModal";
import ActionDropDown from "@/components/common/ActionDropDown";
import { approveBulkOvertime, exportAllOvertime, getAllOvertime, approveOvertime, unapproveOvertime } from "@/api/transactions/overtime";

const OvertimeTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const importModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

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

    const columnSettings = [
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Biometric Number",
            path: "employee.biometric_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "employee.current_branch.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Overtime",
            path: "regular_overtime",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Night Diff Overtime",
            path: "night_diff_overtime",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Legal Holiday Overtime",
            path: "legal_holiday_overtime",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Special Holiday Overtime",
            path: "special_holiday_overtime",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Overtime Status",
            path: "overtime_status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                let status: "default" | "success" | "danger" = "default";

                switch(data.overtime_status) {
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
                    label={data.overtime_status}
                    status={status}
                />
            }
        },
        {
            columnHead: "Action",
            path: "overtime_status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let actions = tableActions;
                if (data.overtime_status === "Unapproved") {
                    actions = [
                        tableActions[0],
                        tableActions[1],
                    ];
                } else if (data.overtime_status === "Approved") {
                    actions = [
                        tableActions[0],
                        tableActions[2],
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
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    employee_id: data.employee?.id,
                    employee: data.employee?.full_name,
                    branch: data.employee?.current_branch?.name,
                    date : data.date,
                    regular_overtime : data.regular_overtime,
                    legal_holiday_overtime : data.legal_holiday_overtime,
                    special_holiday_overtime : data.special_holiday_overtime,
                    night_diff_overtime : data.night_diff_overtime,
                    overtime_status : data.overtime_status,
                });
            }
        },
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
            label: "Import Actual Schedule",
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

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Employee Name",
                        path: "employee.full_name",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Biometric Number",
                        path: "employee.biometric_number",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Overtime",
                        path: "regular_overtime",
                        columnType: COLUMNTYPES.amount
                    },
                    {
                        columnHead: "Night Diff Overtime",
                        path: "night_diff_overtime",
                        columnType: COLUMNTYPES.amount
                    },
                    {
                        columnHead: "Legal Holiday Overtime",
                        path: "legal_holiday_overtime",
                        columnType: COLUMNTYPES.amount
                    },
                    {
                        columnHead: "Special Holiday Overtime",
                        path: "special_holiday_overtime",
                        columnType: COLUMNTYPES.amount
                    },
                ]}
                withStatus
                statusOption={[
                    {
                        label: "Approved",
                        value: "Approved"
                    },
                    {
                        label: "Unapproved",
                        value: "Unapproved"
                    }
                ]}
                filterHandler={filter}
                hasDateRange
                withBranch
                hasExport
                api={exportAllOvertime}
                exportFileName={`OVERTIME-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="employee.full_name"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                {/* <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new overtime"
                            onClick={createModal.onOpen}
                        />
                    </div>
                </div> */}
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
                            overtime_ids.filter((tardiness) => tardiness !== e.target.value);
                            approveBulk.setFieldValue("overtime_id", overtime_ids);
                        }
                    }}
                />
            </Card>

            {/* <CreateOvertimeForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            /> */}

            <EditOvertimeForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

            <ImportModal
                modal={importModal}
            />
        </>
    );
};

export default OvertimeTableCard;