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
                    station_order: data.station_order
                });
            }
        },
        {
            label: "Delete",
            onClick: (data: any) => {
                if (!confirm("Are you sure?")) {
                    return;
                }
                deleteStation(data.id).then((resp) => {
                    if (resp.error) {
                        toast.error(resp.data.message);
                    } else {
                        toast.success("Station deleted successfully.");
                        stations.triggerReload();
                    }
                }).catch(() => {
                    toast.error("Error encountered");
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