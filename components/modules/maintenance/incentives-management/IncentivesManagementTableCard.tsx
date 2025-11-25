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
import CreateIncentivesManagementForm from "./CreateIncentivesManagementForm";
import EditIncentivesManagementForm from "./EditIncentivesManagementForm";
import { exportAllIncentivesManagement, getAllIncentivesManagement } from "@/api/maintenance/incentives-management";
import DropDownButtons from "@/components/common/DropDownButtons";
    
const IncentivesManagementTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState<any>(null);
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllIncentivesManagement({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching incentives");
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
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Max Amount",
            path: "max_amount",
            columnType: COLUMNTYPES.string
        },
    ];

    const actionSettings = [
        {
            label: "Create new incentives",
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
                    employee_id: data.employee_id,
                    employee_number: data.employee.employee_number,
                    amount: data.amount,
                    max_amount: data.max_amount,
                    employee: data.employee
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
                api={exportAllIncentivesManagement}
                exportFileName={`INCENTIVES-MANAGEMENT-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="employee.full_name"
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

            <CreateIncentivesManagementForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            {data?.employee && (
                <EditIncentivesManagementForm
                    modal={editModal}
                    onSubmitCallback={api.triggerReload}
                    formValue={data}
                />
            )}
        </>
    );
};

export default IncentivesManagementTableCard;