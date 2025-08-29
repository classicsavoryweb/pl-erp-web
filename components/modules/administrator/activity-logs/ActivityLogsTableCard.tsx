"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { getAllActivityLogs } from "@/api/activity-logs";
import { useState } from "react";
import { useModal } from "@/hooks/modal";
import Modal from "@/components/common/Modal";

const ActivityLogsTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(15);
    const [data, setData] = useState<any>({});
    const modal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllActivityLogs({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching api and permissions");
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
            columnHead: "Log Name",
            path: "log_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Created By",
            path: "causer.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Created At",
            path: "created_at",
            columnType: COLUMNTYPES.timestamp
        },
    ];

    const actions = [
        {
            label: "View",
            onClick: (data: any) => {
                setData(data.properties);
                modal.onOpen();
            }
        }
    ];

    return (
        <>
            <Card>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={actions}
                />
            </Card>

            <Modal
                isShowing={modal.isShowing}
                onClose={modal.onClose}
                title="Properties"
                size="xl"
            >    
                { data.old &&
                    <div>
                        <p>Old Data:</p>
                        <pre className="text-[12px]">
                            {JSON.stringify(data.old, null, 2)}
                        </pre>
                    </div>
                }
                { data.attributes &&
                    <div>
                        <p>{data.old ? "New Data" : "Data:"}</p>
                        <pre className="text-[12px]">
                            {JSON.stringify(data.attributes, null, 2)}
                        </pre>
                    </div>

                }
            </Modal>
        </>
    );
};

export default ActivityLogsTableCard;