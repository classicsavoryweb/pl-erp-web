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
import CreatePhilhealthForm from "./CreatePhilhealthForm";
import EditPhilhealthForm from "./EditPhilhealthForm";
import { exportAllPhilhealth, getAllPhilhealth } from "@/api/maintenance/philhealth";
import DropDownButtons from "@/components/common/DropDownButtons";
    
const PhilhealthTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllPhilhealth({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching philhealth contributions");
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
            columnHead: "Salary Range Minimum",
            path: "salary_range_min",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Salary Range Maximum",
            path: "salary_range_max",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Salary Base",
            path: "salary_base",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employee Share",
            path: "employee_share",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employer Share",
            path: "employer_share",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Total Monthly Contribution",
            path: "total_monthly_contribution",
            columnType: COLUMNTYPES.string,
        },
    ];

    const actionSettings = [
        {
            label: "Create new contribution",
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
                    salary_range_min: data.salary_range_min,
                    salary_range_max: data.salary_range_max,
                    salary_base: data.salary_base,
                    employee_share: data.employee_share,
                    employer_share: data.employer_share,
                    total_monthly_contribution: data.total_monthly_contribution
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
                api={exportAllPhilhealth}
                exportFileName={`PHILHEALTH-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="salary_base"
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

            <CreatePhilhealthForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditPhilhealthForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

        </>
    );
};

export default PhilhealthTableCard;