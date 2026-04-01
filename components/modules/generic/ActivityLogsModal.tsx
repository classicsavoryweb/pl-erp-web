"use client";

import { getSpecificActivityLogs } from "@/api/activity-logs";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
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

    return (
        <Modal
            isShowing={modal.isShowing}
            title={title}
            size="lg"
            onClose={() => {
                modal.onClose();
            }}
        >
            <Table
                columnSettings={columnSettings}
                dataSet={api.dataSet}
                paginator={paginator}
                loading={api.loading}
                smallText
            />
        </Modal>
    );
};

export default ActivityLogsModal;