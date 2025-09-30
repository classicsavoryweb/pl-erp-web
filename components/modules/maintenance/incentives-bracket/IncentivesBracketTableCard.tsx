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
import CreateIncentivesBracketForm from "./CreateIncentivesBracketForm";
import EditIncentivesBracketForm from "./EditIncentivesBracketForm";
import { exportAllIncentivesBracket, getAllIncentivesBracket } from "@/api/maintenance/incentives-bracket";
import DropDownButtons from "@/components/common/DropDownButtons";
    
const IncentivesBracketTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllIncentivesBracket({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching rank and file bracket");
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
            columnHead: "Bracket Name",
            path: "bracket_name",
            columnType: COLUMNTYPES.string
        }
    ];

    const actionSettings = [
        {
            label: "Create new incentives bracket",
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

                const positionIds = data.positions.map((pos: any) => pos.id);

                setData({
                    incentives_bracket_id: data.incentives_bracket_id,
                    bracket_name: data.bracket_name,
                    increments: data.increments, 
                    position_id: positionIds,
                });
            }
        }
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                hasExport
                api={exportAllIncentivesBracket}
                exportFileName={`RANK-AND-FILE-BRACKET-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="bracket_name"
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

            <CreateIncentivesBracketForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditIncentivesBracketForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

        </>
    );
};

export default IncentivesBracketTableCard;