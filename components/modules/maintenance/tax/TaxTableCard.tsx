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
import CreateTaxForm from "./CreateTaxForm";
import EditTaxForm from "./EditTaxForm";
import { exportAllTax, getAllTax } from "@/api/maintenance/tax";
    
const TaxTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllTax({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching Tax");
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
            columnHead: "Type",
            path: "type",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Range Minumum",
            path: "range_min",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Range Maximum",
            path: "range_max",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Salary Base",
            path: "salary_base",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Percentage",
            path: "percentage",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Exemption",
            path: "exemption",
            columnType: COLUMNTYPES.string,
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    type: data.type,
                    status: data.status,
                    range_min: data.range_min,
                    range_max: data.range_max,
                    salary_base: data.salary_base,
                    percentage: data.percentage,
                    exemption: data.exemption,
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
                api={exportAllTax}
                exportFileName={`Tax-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="salary_base"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new Tax"
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

            <CreateTaxForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditTaxForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

        </>
    );
};

export default TaxTableCard;