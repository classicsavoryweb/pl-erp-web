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
import { deleteStation, getAllStations } from "@/api/station";
import { useState } from "react";
import { getAllPositions } from "@/api/positions";
import Badge from "@/components/common/Badge";
import CreatePositionForm from "./CreatePositionForm";
import EditPositionForm from "./EditPositionForm";

const PositionsTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllPositions({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching positions");
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
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Rank",
            path: "rank",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Station",
            path: "station.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "rank",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.status === "inactive") {
                    return <Badge status="danger" label={data.status}/>
                } else {
                    return <Badge status="success" label={data.status}/>
                }
            }
        }
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    description: data.description,
                    status: data.status,
                    rank: data.rank,
                    station_id: data.station_id
                });
            }
        },
    ];

    return (
        <>
            <Card>
                <div className="flex justify-end items-center">
                    <div
                        className="w-[180px]"
                    >
                        <Button
                            label="Create new position"
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

            <CreatePositionForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditPositionForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default PositionsTableCard;