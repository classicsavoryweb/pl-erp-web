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
import FilterCard from "@/components/modules/cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import DropDownButtons from "@/components/common/DropDownButtons";
import CreateApproverForm from "./CreateApproverForm";
import EditApproverForm from "./EditApproverForm";
import { getAllPettyCashApprovers, exportAllPettyCashApprovers } from "@/api/maintenance/petty-cash-approver";

const ApproverTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllPettyCashApprovers({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching approvers");
                } else {
                    const mappedData = resp.data.data.map((item: any) => {
                        const rangeDisplay = item.use_same_range
                            ? `₱${Number(item.min_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ₱${Number(item.max_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : "Varies per Employee";
                        const branchesDisplay = item.branches.map((b: any) => b.name).join(", ");
                        const employeesDisplay = item.employees.map((e: any) => e.full_name).join(", ");

                        return {
                            ...item,
                            range_display: rangeDisplay,
                            branches_display: branchesDisplay,
                            employees_display: employeesDisplay
                        };
                    });
                    api.setDataSet(mappedData);
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
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employees",
            path: "employees_display",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branches",
            path: "branches_display",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Limits Range",
            path: "range_display",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status
        }
    ];

    const actionSettings = [
        {
            label: "Create new record",
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
                setData(data);
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Description",
                        path: "description",
                        columnType: COLUMNTYPES.string
                    }
                ]}
                filterHandler={filter}
                withStatus
                hasExport
                api={exportAllPettyCashApprovers}
                exportFileName={`PETTY-CASH-APPROVERS-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="description"
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

            <CreateApproverForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditApproverForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default ApproverTableCard;
