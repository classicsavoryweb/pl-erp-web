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
import CreateSSSForm from "./CreateSSSForm";
import EditSSSForm from "./EditSSSForm";
import { exportAllSSS, getAllSSS } from "@/api/maintenance/sss";
    
const SSSTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllSSS({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching SSS");
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
            columnHead: "Salary Credit",
            path: "salary_credit",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employer SS",
            path: "employer_ss",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employer CC",
            path: "employer_cc",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employee SS",
            path: "employee_ss",
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
                    salary_range_min: data.salary_range_min,
                    salary_range_max: data.salary_range_max,
                    salary_credit: data.salary_credit,
                    employer_ss: data.employer_ss,
                    employer_cc: data.employer_cc,
                    employee_ss: data.employee_ss
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
                api={exportAllSSS}
                exportFileName={`SSS-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="salary_credit"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new sss"
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

            <CreateSSSForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditSSSForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

        </>
    );
};

export default SSSTableCard;