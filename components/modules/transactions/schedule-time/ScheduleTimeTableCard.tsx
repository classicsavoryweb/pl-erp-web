"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import ImportModal from "./ImportModal";
import DropDownButtons from "@/components/common/DropDownButtons";
import { exportAllTransactionsScheduleTime, getAllTransactionsScheduleTime } from "@/api/transactions/schedule-time";

const ScheduleTimeTableCard = () => {
    const api = useApiCall();
    const importModal = useModal();
    const paginator = usePagination(15);
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllTransactionsScheduleTime({
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
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Biometric Number",
            path: "employee.biometric_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "employee.current_branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date,
        },
        {
            columnHead: "Timetable",
            path: "timetable",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Check In",
            path: "check_in",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Check Out",
            path: "check_out",
            columnType: COLUMNTYPES.string,
        }
    ];

    const globalActionSettings = [
        {
            label: "Import Actual Schedule",
            onClick: () => {
                importModal.onOpen();
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
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Biometric Number",
                        path: "employee.biometric_number",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Timetable",
                        path: "timetable",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Check In",
                        path: "check_in",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Check Out",
                        path: "check_out",
                        columnType: COLUMNTYPES.string,
                    }
                ]}
                filterHandler={filter}
                hasExport
                api={exportAllTransactionsScheduleTime}
                exportFileName={`SCHEDULE-TIME-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="employee.full_name"
                callBack={() => {
                    paginator.setPage(1);
                }}
                hasDateRange
                withBranch
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
                />
            </Card>

            <ImportModal
                modal={importModal}
                api={api}
            />
        </>
    );
};

export default ScheduleTimeTableCard;