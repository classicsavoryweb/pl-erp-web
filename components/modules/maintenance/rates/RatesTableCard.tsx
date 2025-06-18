
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
import { exportAllRates, getAlllRates } from "@/api/rates";
import CreateRateForm from "./CreateRateForm";
import EditRateForm from "./EditRateForm";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";

const RatesTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAlllRates({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching rates");
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
            columnHead: "Rate Code",
            path: "code",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Minimum",
            path: "minimum",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Area",
            path: "area",
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
                    minimum: data.minimum,
                    code: data.code,
                    area: data.area,
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
                api={exportAllRates}
                exportFileName={`RATE-PER-GROUP-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="code"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new rate"
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
            <CreateRateForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditRateForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default RatesTableCard;