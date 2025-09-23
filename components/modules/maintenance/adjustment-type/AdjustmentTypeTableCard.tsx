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
import { exportAllAdjustmentTypes, getAllAdjustmentTypes } from "@/api/maintenance/adjustment-type";
import CreateAdjustmentTypeModal from "./CreateAdjustmentTypeModal";
import EditAdjustmentTypeModal from "./EditAdjustmentTypeModal";
import DropDownButtons from "@/components/common/DropDownButtons";
    
const AdjustmentTypesTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllAdjustmentTypes({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching adjustment types");
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
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status
        },
    ];

    const actionSettings = [
        {
            label: "Create new adjustment type",
            onClick: () => {
                createModal.onOpen();
            }
        },
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
                });
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                hasExport
                api={exportAllAdjustmentTypes}
                exportFileName={`ADJUSTMENT-TYPES-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="description"
                callBack={() => {
                    paginator.setPage(1);
                }}
                withStatus
            />
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
                    withActions
                    actions={tableActions}
                />
            </Card>

            <CreateAdjustmentTypeModal
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditAdjustmentTypeModal
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default AdjustmentTypesTableCard;