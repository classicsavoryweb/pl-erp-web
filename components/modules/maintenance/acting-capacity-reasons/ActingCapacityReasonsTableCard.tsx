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
import CreateActingCapacityReasonForm from "./CreateActingCapacityReasonForm";
import EditActingCapacityReasonForm from "./EditActingCapacityReasonForm";
import { exportAllActingCapacityReasons, getAllActingCapacityReasons } from "@/api/acting-capacity-reason";

const ActingCapacityReasonsTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllActingCapacityReasons({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching agencies");
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
            columnHead: "Reason",
            path: "reason",
            columnType: COLUMNTYPES.string
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
                    status: data.status,
                    reason: data.reason,
                });
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                withStatus
                hasExport
                api={exportAllActingCapacityReasons}
                exportFileName={`ACTING-CAPACITY-REASON-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="reason"
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new reason"
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

            <CreateActingCapacityReasonForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditActingCapacityReasonForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

        </>
    );
};

export default ActingCapacityReasonsTableCard;