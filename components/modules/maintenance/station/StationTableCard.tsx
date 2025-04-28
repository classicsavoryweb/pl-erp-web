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
import { getAllStations } from "@/api/station";

const StationTableCard = () => {
    const stations = useApiCall();
    const createModal = useModal();
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
                console.log("role >>>> ",data.name);
            }
        },
        {
            label: "Delete",
            onClick: (data: any) => {
                console.log("delete >>> ", data);
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
        </>
    );
};

export default StationTableCard;