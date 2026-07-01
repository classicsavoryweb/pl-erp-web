"use client";

import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
import Table from "@/components/common/Table";
import FilterCard from "../../../cards/FilterCard";
import { COLUMNTYPES } from "@/constants/column";
import { getUniformFreeUniformLimits } from "@/api/maintenance/uniform-free-uniform-limit";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useState } from "react";
import { toast } from "react-toastify";
import UniformFreeUniformLimitForm from "./UniformFreeUniformLimitForm";

const UniformFreeUniformLimitTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const paginator = usePagination();
    const filter = useFilter();
    const [selectedLimit, setSelectedLimit] = useState<any>({});

    useAsyncEffect(() => {
        api.setLoading(true);
        getUniformFreeUniformLimits({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters,
        })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching free uniform limits");
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
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Allowed Count",
            path: "allowed_count",
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
            label: "Add Free Uniform Limit",
            onClick: () => {
                createModal.onOpen();
            },
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                setSelectedLimit(data);
                editModal.onOpen();
            },
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
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
                ]}
                filterHandler={filter}
                defaultColumnSelected="description"
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
            <UniformFreeUniformLimitForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <UniformFreeUniformLimitForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={selectedLimit}
            />
        </>
    );
};

export default UniformFreeUniformLimitTableCard;
