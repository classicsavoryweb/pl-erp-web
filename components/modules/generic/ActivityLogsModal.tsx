"use client";

import { getSpecificActivityLogs } from "@/api/activity-logs";
import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { useState } from "react";
import { toast } from "react-toastify";

interface ActivityLogsModalInterface {
    modal : any;
    title : string;
    logName : string;
    data : any;
};
const ActivityLogsModal = ({
    modal,
    title = "",
    logName,
    data
}: ActivityLogsModalInterface) => {
    const api = useApiCall();
    const paginator = usePagination(5);
    const [logData, setLogData] = useState<any>({});

    useAsyncEffect(async () => {
        if (modal.isShowing) {
            api.setLoading(true);
            try {
                const resp = await getSpecificActivityLogs({
                    page: paginator.page,
                    per_page: paginator.per_page,
                    subject_id: data.id,
                    log_name: logName
                });
    
                if (!resp.error) {
                    api.setDataSet(resp.data.data);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                } else {
                    toast.error("Error encountered");
                }
            } catch {
                toast.error("Error encountered");
            } finally {
                api.setLoading(false)
            }
        }
    }, [paginator.reload, api.reload, modal.isShowing]);

    const columnSettings = [
        {
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "User",
            path: "causer.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Created At",
            path: "created_at",
            columnType: COLUMNTYPES.timestamp
        },
    ];

    const actionSettings = [
        {
            label: "View Details",
            onClick: (data:any) => {
                setLogData(data);
            }
        }
    ];

    return (
        <Modal
            isShowing={modal.isShowing}
            title={title}
            size="lg"
            onClose={() => {
                modal.onClose();
                setLogData({});
            }}
        >
            <Table
                columnSettings={columnSettings}
                dataSet={api.dataSet}
                paginator={paginator}
                loading={api.loading}
                withActions
                actions={actionSettings}
                smallText
            />

            { (logData && logData.properties)&&
                <div className="mt-2">
                    <Card>
                        <p className="font-semibold">Log Details</p>
                        <Grid cols={2}>
                            { logData.properties.old &&
                                <div className="mt-2">
                                    <p className="font-semibold text-xs">Old:</p>
                                    {Object.entries(logData.properties.old).map(([key, value]) => (
                                    <div className="text-[11px]" key={key}>
                                        <p>{key} : {String(value)}</p>
                                    </div>))}
                                </div>
                            }
                            { logData.properties.attributes &&
                                <div className="mt-2">
                                    <p className="font-semibold text-xs">Changes:</p>
                                    {Object.entries(logData.properties.attributes).map(([key, value]) => (
                                    <div className="text-[11px]" key={key}>
                                        <p>{key} : {String(value)}</p>
                                    </div>))}
                                </div>
                            }
                        </Grid>
                    </Card>
                </div>
            }
        </Modal>
    );
};

export default ActivityLogsModal;