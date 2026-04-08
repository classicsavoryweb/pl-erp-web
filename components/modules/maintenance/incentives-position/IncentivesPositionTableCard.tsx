"use client";

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
import DropDownButtons from "@/components/common/DropDownButtons";
import { exportAllIncentivesPosition, getAllIncentivesPosition } from "@/api/maintenance/incentives-position";
import CreateIncentivesPositionForm from "./CreateIncentivesPositionForm";
import EditIncentivesPositionForm from "./EditIncentivesPositionForm";
    
const IncentivesPositionTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState<any>(null);
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllIncentivesPosition({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error incentives position");
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
            columnHead: "Position",
            path: "position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "OIC Additional Amount",
            path: "oic_additional_amount",
            columnType: COLUMNTYPES.amount
        },
    ];

    const actionSettings = [
        {
            label: "Create new incentive",
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
                    description: data.position.description,
                    position_id: data.position_id,
                    amount: data.amount,
                    oic_additional_amount: data.oic_additional_amount
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
                api={exportAllIncentivesPosition}
                exportFileName={`INCENTIVES-POSITION-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="position.description"
                callBack={() => {
                    paginator.setPage(1);
                }}
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
            <CreateIncentivesPositionForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditIncentivesPositionForm
                modal={editModal}
                formValue={data}
                onSubmitCallback={api.triggerReload}
            />
        </>
    );
};

export default IncentivesPositionTableCard;