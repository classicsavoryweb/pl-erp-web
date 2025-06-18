
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
import Badge from "@/components/common/Badge";
import { exportAllTrainingTitles, getAllTrainingTitles } from "@/api/training-title";
import CreateTrainingTitleForm from "./CreateTrainingTitleForm";
import EditTrainingTitleForm from "./EditTrainingTitleForm";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";

const TrainingTitlesTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllTrainingTitles({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching training titles");
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
            columnHead: "Title",
            path: "title",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Speaker",
            path: "speaker",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Venue",
            path: "venue",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Option",
            path: "option",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        }
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    option: data.option,
                    title: data.title,
                    venue: data.venue,
                    speaker: data.speaker,
                    status: data.status
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
                api={exportAllTrainingTitles}
                exportFileName={`TRAINING-TITLES-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="title"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div
                        className="w-[170px]"
                    >
                        <Button
                            label="Create new title"
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
            <CreateTrainingTitleForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditTrainingTitleForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default TrainingTitlesTableCard;