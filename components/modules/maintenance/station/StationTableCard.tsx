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
import CreateStationForm from "./CreateStationForm";
import EditStationForm from "./EditStationForm";
import Badge from "@/components/common/Badge";

const StationTableCard = () => {
    const stations = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();

    useAsyncEffect(() => {
        stations.setLoading(true);
        getAllStations({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching stations");
            } else {
                stations.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            stations.setLoading(false);
        });
    }, [paginator.reload, stations.reload]);

    const columnSettings = [
        {
            columnHead: "Station Name",
            path: "name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Station Order",
            path: "station_order",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "",
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
                    name: data.name,
                    station_order: data.station_order,
                    status: data.status
                });
            }
        },
    ];

    return (
        <>
            <Card>
                <div className="flex justify-end items-center">
                    <div
                        className="w-[170px]"
                    >
                        <Button
                            label="Create new station"
                            onClick={createModal.onOpen}
                        />
                    </div>
                </div>
                <Table
                    dataSet={stations.dataSet}
                    columnSettings={columnSettings}
                    loading={stations.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <CreateStationForm
                modal={createModal}
                onSubmitCallback={stations.triggerReload}
            />

            <EditStationForm
                modal={editModal}
                onSubmitCallback={stations.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default StationTableCard;