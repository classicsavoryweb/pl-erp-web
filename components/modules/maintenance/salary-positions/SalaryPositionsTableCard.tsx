"use client";

import Button from "@/components/common/Button";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import { exportAllSalaryPositions, getAllSalaryPositions } from "@/api/salary-positions";
import Card from "@/components/common/Card";
import CreateSalaryPositionForm from "./CreateSalaryPositionForm";
import EditSalaryPositionForm from "./EditSalaryPositionForm";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";

const SalaryPositionsTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllSalaryPositions({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching positions");
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
            columnHead: "Basic Salary",
            path: "basic_salary",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Rate Category",
            path: "rate_category",
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
                    position_id: data.position_id,
                    basic_salary: data.basic_salary,
                    rate_category: data.rate_category,
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
                api={exportAllSalaryPositions}
                exportFileName={`SALARY-POSITIONS-${moment().format("YYYY-MM-DD")}.xls`}
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new salary position"
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
                <CreateSalaryPositionForm
                    modal={createModal}
                    onSubmitCallback={api.triggerReload}
                />
                <EditSalaryPositionForm
                    modal={editModal}
                    onSubmitCallback={api.triggerReload}
                    formValue={data}
                />
            </Card>
        </>
    );
};

export default SalaryPositionsTableCard;