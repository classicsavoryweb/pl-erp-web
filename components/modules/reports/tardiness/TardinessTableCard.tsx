"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import { approveBulkTardiness, approveTardiness, exportReportTardiness, getAllReportsTardiness, getNTEDetaills, sendTardinessNTE } from "@/api/reports/reports-tardiness";
import Link from "next/link";
import Badge from "@/components/common/Badge";
import ActionDropDown from "@/components/common/ActionDropDown";
import confirm from "@/components/common/Confirm";
import ImportModal from "./ImportModal";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import EditTardinessModal from "./EditTardinessModal";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useFormik } from "formik";
import VoidTardinessModal from "./VoidTardinessModal";
import { pdf } from '@react-pdf/renderer';
import TardinessNotice from "../../pdf/TardinessNotice";
import SendNODModal from "./SendNODModal";
import moment from "moment";
import TardinessNTEModal from "./TardinessNTEModal";
import TardinessNODModal from "./TardinesNODModal";
import TardinessDetailsModal from "./TardinessDetailsModal";

const TardinessTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const importModal = useModal();
    const [id, setId] = useState<number>(0);
    const editModal = useModal();
    const voidModal = useModal();
    const filter = useFilter();
    const viewNTE = useModal();
    const viewNOD = useModal();
    const viewTardiness = useModal();
    const sendNodMemo = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllReportsTardiness({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching tardiness");
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
            columnHead: "Employee Number",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                return (
                    <Link
                        href={`/employees/${data.employee.employee_number}`}
                        target="_blank"
                        className="text-blue-700 underline"
                    >
                        {data.employee.employee_number}
                    </Link>
                )
            }
        },
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "employee.current_branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Count",
            path: "tardiness_sanction.count",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Month",
            path: "month",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return moment().month(data.month - 1).format('MMM')
            }
        },
        {
            columnHead: "Year",
            path: "year",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Total Minutes",
            path: "total_minutes",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "NTE Status",
            path: "nte_status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                if (data.nte_status) {
                    return (
                        <>
                            <p>{data.nte_status}</p>

                            { data.nte_date_sent &&
                                <>
                                <p className="text-xs">{ moment(data.nte_date_sent).format("MMMM DD, YYYY")}</p>
                                <p className="text-xs">{ moment(data.nte_date_sent).format("HH:mm:ss A")}</p>
                                </>
                            }
                        </>
                    )
                } else {
                    return "—";
                }
            }
        },
        {
            columnHead: "NOD Status",
            path: "da_status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.da_status) {
                    return (
                        <>
                            <p>{data.da_status}</p>

                            { data.da_date_sent &&
                                <>
                                <p className="text-xs">{ moment(data.da_date_sent).format("MMMM DD, YYYY")}</p>
                                <p className="text-xs">{ moment(data.da_date_sent).format("HH:mm:ss A")}</p>
                                </>
                            }
                        </>
                    )
                } else {
                    return "—";
                }
            }
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                switch(data.status) {
                    case "Approved": 
                        status = "success";
                        break;
                    case "Pending":
                        status = "warning";
                        break;
                    case "Voided":
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
                let actions = actionSettings;
                if (data.status === "Pending") {
                    actions = [
                        actionSettings[0],
                        actionSettings[1],
                        actionSettings[2],
                    ];
                } else if (data.status === "Approved") {
                    actions = [
                        actionSettings[0],
                        actionSettings[2],
                        actionSettings[3],
                        actionSettings[5],
                    ];

                    if (data.nte_status === "Sent") {
                        actions = [
                            ...actions,
                            actionSettings[4],
                            actionSettings[6]
                        ]
                    }
                } else {
                    actions = [
                        actionSettings[7],
                    ];
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

    const actionSettings = [
        {
            label: "Edit",
            onClick: async (data: any) => {
                setId(data.id);
                editModal.onOpen();
            }
        },
                {
            label: "Approve",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Approve Tardiness",
                    message: `Are you sure you want to approve the tardiness of ${data?.employee?.full_name}?`,
                });

                isConfirmed &&
                approveTardiness(data.id).then((resp) => {
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
            permission: "approve_all_records_tardiness"
        },
        {
            label: "Void",
            onClick: async (data: any) => {
                setId(data.id);
                voidModal.onOpen();
                api.setData(data);
            },
            permission: "void_all_records_tardiness"
        },
        {
            label: "View NTE",
            onClick: async (data: any) => {
                setId(data.id);
                viewNTE.onOpen();
            }
        },
        {
            label: "View NOD",
            onClick: async (data: any) => {
                setId(data.id);
                viewNOD.onOpen();
            }
        },
        {
            label: "Send NTE",
            onClick: async (data: any) => {
                const resp = await getNTEDetaills(data.id);
                const blob = await pdf(<TardinessNotice data={resp.data} />).toBlob();
                const isConfirmed = await confirm({
                    title: "Send Tardiness NTE",
                    message: "Are you sure you want to send an NTE?",
                });

                isConfirmed &&
                sendTardinessNTE(data.id, {
                    "nte_memo": new File([blob], "nte_memo.pdf", { type: "application/pdf" })
                }).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        },
        {
            label: "Send NOD",
            onClick: async (data: any) => {
                setId(data.id);
                sendNodMemo.onOpen();
            }
        },
        {
            label: "View",
            onClick: async (data: any) => {
                setId(data.id);
                viewTardiness.onOpen();
            }
        },
    ];

    const approveBulk = useFormik({
        initialValues: {
            tardiness_id: []
        },
        validateOnChange: false,
        onSubmit:async (values, {resetForm}) => {
            if (values.tardiness_id.length === 0) {
                toast.error("Must select atleast 1 record");
            } else {
                approveBulkTardiness(values)
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
            label: "Import Tardiness",
            onClick: () => {
                importModal.onOpen();
            }
        },
        {
            label: "Approve Selected",
            onClick: async () => {
                const isConfirm = await confirm({
                    title: "Approve Bulk Tardiness",
                    message: "Are you sure you want to approve this tardiness?"
                });
                if (isConfirm) {
                    await approveBulk.submitForm();
                }
            }
        },
    ];

    return (
        <>
            <FilterCard
            columnSettings={[
                    {
                        columnHead: "Employee Number",
                        path: "employee.employee_number",
                        columnType: COLUMNTYPES.function,
                        function: (data:any) => {
                            return (
                                <Link
                                    href={`/employees/${data.employee.employee_number}`}
                                    target="_blank"
                                    className="text-blue-700 underline"
                                >
                                    {data.employee.employee_number}
                                </Link>
                            )
                        }
                    },
                    {
                        columnHead: "Employee Name",
                        path: "employee.full_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Count",
                        path: "tardiness_sanction.count",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Total Minutes",
                        path: "total_minutes",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "NTE Status",
                        path: "nte_status",
                        columnType: COLUMNTYPES.function,
                        function: (data:any) => {
                            if (data.nte_status) {
                                return (
                                    <>
                                        <p>{data.nte_status}</p>

                                        { data.nte_date_sent &&
                                            <>
                                            <p className="text-xs">{ moment(data.nte_date_sent).format("MMMM DD, YYYY")}</p>
                                            <p className="text-xs">{ moment(data.nte_date_sent).format("HH:mm:ss A")}</p>
                                            </>
                                        }
                                    </>
                                )
                            } else {
                                return "—";
                            }
                        }
                    },
                    {
                        columnHead: "NOD Status",
                        path: "da_status",
                        columnType: COLUMNTYPES.function,
                        function: (data: any) => {
                            if (data.da_status) {
                                return (
                                    <>
                                        <p>{data.da_status}</p>

                                        { data.da_date_sent &&
                                            <>
                                            <p className="text-xs">{ moment(data.da_date_sent).format("MMMM DD, YYYY")}</p>
                                            <p className="text-xs">{ moment(data.da_date_sent).format("HH:mm:ss A")}</p>
                                            </>
                                        }
                                    </>
                                )
                            } else {
                                return "—";
                            }
                        }
                    },
                ]}
                filterHandler={filter}
                defaultColumnSelected="employee.full_name"
                withStatus
                isExpanded
                statusOption={[
                    {
                        label: "Pending",
                        value: "Pending"
                    },
                    {
                        label: "Approved",
                        value: "Approved"
                    },
                    {
                        label: "Voided",
                        value: "Voided"
                    },
                ]}
                callBack={() => {
                    paginator.setPage(1);
                }}
                withBranch
                withMonth
                withYear
                hasExport
                api={exportReportTardiness}
                exportFileName={`TARDINESS-${moment().format("YYYY-MM-DD")}.xls`}
            />
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
                        approveBulk.setFieldValue("tardiness_id", e);
                    }}
                />
            </Card>

            <ImportModal
                modal={importModal}
            />

            <EditTardinessModal
                modal={editModal}
                id={id}
                onSubmitCallBack={() => {
                    editModal.onClose();
                    api.triggerReload();
                }}
            />

            <VoidTardinessModal
                modal={voidModal}
                id={id}
                onSubmitCallBack={() => {
                    voidModal.onClose();
                    api.triggerReload();
                }}
                data={api.data}
            />

            <TardinessNTEModal
                modal={viewNTE}
                id={id}
            />

            <TardinessNODModal
                modal={viewNOD}
                id={id}
            />

            <TardinessDetailsModal
                modal={viewTardiness}
                id={id}
            />

            <SendNODModal
                modal={sendNodMemo}
                id={id}
                onSubmitCallBack={() => {
                    sendNodMemo.onClose();
                    api.triggerReload();
                }}
            />
        </>
    );
};

export default TardinessTableCard;
