"use client";
import { getEmployeeAuditLogs } from "@/api/employee";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const EmployeeAuditLogs = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();
    const paginator = usePagination(5);
    const [data, setData] = useState<any>({});
    const modal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeAuditLogs(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching audit logs");
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
    }, [paginator.reload, api.reload]);

    const columnSettings = [
        {
            columnHead: "Log name",
            path: "log_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Created by",
            path: "causer.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Logged at",
            path: "created_at",
            columnType: COLUMNTYPES.timestamp
        },
    ];

    const tableActions = [
        {
            label: "View",
            onClick: (data: any) => {
                modal.onOpen();
                setData(data);
            }
        },
    ];
    
    return (
        <>
            <Modal
                isShowing={modal.isShowing}
                onClose={modal.onClose}
                title="Properties"
                size="xl"
            >    
                <Grid cols={2}>
                    { data.properties?.old &&
                        <div className="mt-2">
                            <p className="font-semibold text-xs">Old:</p>
                            {Object.entries(data.properties.old).map(([key, value]) => (
                            <div className="text-[11px]" key={key}>
                                <p>{key} : {String(value)}</p>
                            </div>))}
                        </div>
                    }
                    { data.properties?.attributes &&
                        <div className="mt-2">
                            <p className="font-semibold text-xs">Changes:</p>
                            {Object.entries(data.properties.attributes).map(([key, value]) => (
                            <div className="text-[11px]" key={key}>
                                <p>{key} : {String(value)}</p>
                            </div>))}
                        </div>
                    }
                </Grid>
            </Modal>

            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                paginator={paginator}
                withActions
                actions={tableActions}
            />
        </>
    );
};

export default EmployeeAuditLogs;