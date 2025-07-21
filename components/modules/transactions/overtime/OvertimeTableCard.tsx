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
import { payBulkOvertime, exportAllOvertime, getAllOvertime, payOvertime, unpayOvertime } from "@/api/transactions/overtime";

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
            columnHead: "Date Filed",
            path: "date_filed",
            columnType: COLUMNTYPES.date,
        },
        {
            columnHead: "Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "employee.current_branch.name",
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
                    case "Paid":
                        status = "success";
                        break;
                    case "Unpaid":
                        status = "danger";
                        break;
                    default:
                        status = "default";
                        break;
                }
;
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
                if (data.status === "Unpaid") {
                    actions = [
                        tableActions[0],
                    ];
                } else if (data.status === "Paid") {
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
        // {
        //     label: "Edit",
        //     onClick: (data: any) => {
        //         editModal.onOpen();
        //         setData({
        //             id: data.id,
        //             employee: data.employee?.full_name,
        //             branch: data.employee?.current_branch?.name,
        //             date : data.date,
        //             regular_overtime : data.regular_overtime,
        //             legal_holiday_overtime : data.legal_holiday_overtime,
        //             special_holiday_overtime : data.special_holiday_overtime,
        //             night_diff_overtime : data.night_diff_overtime,
        //             status : data.status,
        //         });
        //     }
        // },
        {
            label: "Pay",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Pay Overtime",
                    message: "Are you sure you want to pay this overtime?",
                });

                isConfirmed &&
                payOvertime(data.id).then((resp) => {
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
            permission: "pay_all_transactions_overtime"
        },
        {
            label: "Unpay",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Unpay Overtime",
                    message: "Are you sure you want to unpay this overtime?",
                });

                isConfirmed &&
                unpayOvertime(data.id).then((resp) => {
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
            permission: "unpay_all_transactions_overtime"
        },
    ];

    const payBulk = useFormik({
        initialValues: {
            overtime_id: []
        },
        validateOnChange: false,
        onSubmit:async (values, {resetForm}) => {
            if (values.overtime_id.length === 0) {
                toast.error("Must select atleast 1 record");
            } else {
                payBulkOvertime(values)
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
            label: "Pay Selected",
            onClick: async () => {
                const isConfirm = await confirm({
                    title: "Pay Bulk Overtime",
                    message: "Are you sure you want to pay this overtime?"
                });
                if (isConfirm) {
                    await payBulk.submitForm();
                }
            }
        }
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Name",
                        path: "employee.full_name",
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
                ]}
                withStatus
                statusOption={[
                    {
                        label: "Paid",
                        value: "Paid"
                    },
                    {
                        label: "Unpaid",
                        value: "Unpaid"
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
                            payBulk.setFieldValue("overtime_id",
                                [...payBulk.values.overtime_id,
                                    e.target.value
                            ]);
                        } else {
                            const overtime_ids = payBulk.values.overtime_id;
                            overtime_ids.filter((overtime) => overtime !== e.target.value);
                            payBulk.setFieldValue("overtime_id", overtime_ids);
                        }
                    }}
                />
            </Card>

            {/* <CreateOvertimeForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            /> */}

            {/* <EditOvertimeForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            /> */}

            <ImportModal
                modal={importModal}
            />
        </>
    );
};

export default OvertimeTableCard;