"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import CreateScheduleForm from "./CreateScheduleForm";
import EditScheduleForm from "./EditScheduleForm";
import { exportAllScheduleMasterlist, getAllScheduleMasterlist } from "@/api/schedule-masterlist";

const ScheduleMasterlistTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllScheduleMasterlist({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
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
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            api.setLoading(false);
        });
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Start Time",
            path: "start_time",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "End Time",
            path: "end_time",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Selection",
            path: "selection",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Classification",
            path: "classification",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Break Hours",
            path: "time_break",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Total Hours",
            path: "total_hours",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Days",
            path: "days",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        }
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    start_time: data.start_time,
                    end_time: data.end_time,
                    selection: data.selection,
                    classification: data.classification,
                    time_break: data.time_break,
                    total_hours: data.total_hours,
                    days: data.days,
                    required: data.required,
                    status: data.status
                });
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Start Time",
                        path: "start_time",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "End Time",
                        path: "end_time",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Selection",
                        path: "selection",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Classification",
                        path: "classification",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Break Hours",
                        path: "time_break",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Total Hours",
                        path: "total_hours",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Days",
                        path: "days",
                        columnType: COLUMNTYPES.string,
                    },
                ]}
                filterHandler={filter}
                hasExport
                withStatus
                api={exportAllScheduleMasterlist}
                exportFileName={`SCHEDULE-MASTERLIST-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="selection"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new schedule"
                            onClick={createModal.onOpen}
                        />
                    </div>
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <CreateScheduleForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditScheduleForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

        </>
    );
};

export default ScheduleMasterlistTableCard;