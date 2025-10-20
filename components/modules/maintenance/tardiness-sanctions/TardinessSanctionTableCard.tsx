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
import { exportAllTardinessSanctions, getAllTardinessSanctions } from "@/api/maintenance/tardiness-sanction";
import CreateTardinessSanction from "./CreateTardinessSanction";
import EditTardinessSanction from "./EditTardinessSanction";

const TardinessSanctionTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllTardinessSanctions({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching sanctions");
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
            columnHead: "Count",
            path: "count",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Rank",
            path: "rank",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Incentives Deduction",
            path: "incentives_deduction",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        }
    ];

    const actionSettings = [
        {
            label: "Create new sanction",
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
                    count: data.count,
                    punishment: data.punishment,
                    rank: data.rank,
                    incentives_deduction: data.incentives_deduction,
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
                withStatus
                hasExport
                api={exportAllTardinessSanctions}
                exportFileName={`TARDINESS-SANCTION-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="count"
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
            <CreateTardinessSanction
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditTardinessSanction
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default TardinessSanctionTableCard;