"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { getAllScheduledTimeKeepingGeneration } from "@/api/administrators/schedule-timekeeping";
import moment from "moment";
import Badge from "@/components/common/Badge";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useModal } from "@/hooks/modal";
import CreateScheduledTimeKeepingModal from "./CreateScheduledTimeKeepingModal";

const ScheduleTimeKeepingTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const createScheduleModal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllScheduledTimeKeepingGeneration({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching scheduled timekeeping");
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
            columnHead: "Cutoff",
            path: "cut_off.cut_off",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const cutOff = `${moment(data.cut_off.start_date ?? "-").format("MMMM DD")} to ${moment(data.cut_off.end_date ?? "-").format("MMMM DD, YYYY")}`
                return cutOff;
            }
        },
        {
            columnHead: "Created By",
            path: "user.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Schedule",
            path: "schedule",
            columnType: COLUMNTYPES.timestamp
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                var status: "success" | "danger" | "default" | "warning" = "default";

                switch (data.status) {
                    case "Waiting":
                        status = "warning";
                        break;
                    case "Dispatched":
                        status = "success";
                        break;
                    default:
                        status = "default";
                        break;
                }

                return <Badge
                    label={data.status}
                    status={status}
                />
            }
        },
    ];

    const actionSettings = [
        {
            label: "Create Schedule",
            onClick: () => {
                createScheduleModal.onOpen();
            }
        },
    ];

    return (
        <>
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
                />
            </Card>
            <CreateScheduledTimeKeepingModal
                modal={createScheduleModal}
                onSubmitCallback={api.triggerReload}
            />
        </>
    );
};

export default ScheduleTimeKeepingTableCard;