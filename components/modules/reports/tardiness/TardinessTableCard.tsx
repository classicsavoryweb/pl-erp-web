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
import { approveBulkTardiness, approveTardiness, getAllReportsTardiness, getNTEDetaills, sendTardinessNTE } from "@/api/reports/reports-tardiness";
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
import TardinessMemoModal from "./TardinessMemoModal";
import SendNODModal from "./SendNODModal";

const TardinessTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const importModal = useModal();
    const [id, setId] = useState<number>(0);
    const editModal = useModal();
    const voidModal = useModal();
    const filter = useFilter();
    const viewMemo = useModal();
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
            columnHead: "Employee",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Number",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                return (
                    <Link
                        href={`/employees/${data.employee.employee_number}`}
                        className="text-blue-700 underline"
                    >
                        {data.employee.employee_number}
                    </Link>
                )
            }
        },
        {
            columnHead: "Count",
            path: "tardiness_sanction.count",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Month",
            path: "month",
            columnType: COLUMNTYPES.string
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
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "DA Status",
            path: "da_status",
            columnType: COLUMNTYPES.string
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
                        actionSettings[4],
                    ];

                    if (data.nte_status === "Sent") {
                        actions = [
                            ...actions,
                            actionSettings[5]
                        ]
                    }
                }

                if (data.status !== "Voided" ) {
                    return (
                        <ActionDropDown
                            data={data}
                            actions={actions}
                        />
                    );
                } else {
                    return "—";
                }

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
                    message: "Are you sure you want to approve this tardiness?",
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
            }
        },
        {
            label: "Void",
            onClick: async (data: any) => {
                setId(data.id);
                voidModal.onOpen();
            }
        },
        {
            label: "View Memo",
            onClick: async (data: any) => {
                setId(data.id);
                viewMemo.onOpen();
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
                columnSettings={columnSettings}
                filterHandler={filter}
                hasDateRange
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
                        if (e.target.checked) {
                            approveBulk.setFieldValue("tardiness_id",
                                [...approveBulk.values.tardiness_id,
                                    e.target.value
                            ]);
                        } else {
                            const tardiness_ids = approveBulk.values.tardiness_id;
                            tardiness_ids.filter((tardiness) => tardiness !== e.target.value);
                            approveBulk.setFieldValue("tardiness_id", tardiness_ids);
                        }
                    }}
                />
            </Card>

            <ImportModal
                modal={importModal}
            />

            <EditTardinessModal
                modal={editModal}
                id={id}
            />

            <VoidTardinessModal
                modal={voidModal}
                id={id}
                onSubmitCallBack={() => {
                    voidModal.onClose();
                    api.triggerReload();
                }}
            />

            <TardinessMemoModal
                modal={viewMemo}
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