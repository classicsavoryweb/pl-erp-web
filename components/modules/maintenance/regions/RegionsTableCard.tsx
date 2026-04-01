"use client";

import DropDownButtons from "@/components/common/DropDownButtons";
import { exportAllRegions, getAllRegions } from "@/api/regions";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import { useFilter } from "@/hooks/use-filter";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useState } from "react";
import { toast } from "react-toastify";
import Card from "@/components/common/Card";
import FilterCard from "../../cards/FilterCard";
import Table from "@/components/common/Table";
import CreateRegionForm from "./CreateRegionForm";
import EditRegionForm from "./EditRegionForm";

const RegionsTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllRegions({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters,
        })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching regions");
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
            columnHead: "Name",
            path: "name",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        },
    ];

    const actionSettings = [
        {
            label: "Create new region",
            onClick: () => {
                createModal.onOpen();
            },
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (row: any) => {
                setData({
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    status: row.status,
                });
                editModal.onOpen();
            },
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Name",
                        path: "name",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Description",
                        path: "description",
                        columnType: COLUMNTYPES.string,
                    },
                ]}
                filterHandler={filter}
                withStatus
                hasExport
                api={exportAllRegions}
                exportFileName={`REGIONS-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="name"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons actions={actionSettings} />
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

            <CreateRegionForm
                modal={createModal}
                onSubmitCallback={() => {
                    api.triggerReload();
                }}
            />

            <EditRegionForm
                modal={editModal}
                onSubmitCallback={() => {
                    api.triggerReload();
                }}
                formValue={data}
            />
        </>
    );
};

export default RegionsTableCard;
