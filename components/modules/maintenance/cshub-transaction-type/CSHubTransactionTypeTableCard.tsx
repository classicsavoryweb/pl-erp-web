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
import CreateCSHubTransactionTypeForm from "./CreateCSHubTransactionTypeForm";
import EditCSHubTransactionTypeForm from "./EditCSHubTransactionTypeForm";
import { exportAllCSHubTransactionType, getAllCSHubTransactionType } from "@/api/maintenance/cshub-transaction-type";

const CSHubTransactionTypeTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllCSHubTransactionType({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching transaction types");
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
            columnHead: "Description",
            path: "description",
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
                    description: data.description,
                    source_id: data.source_id,
                    transaction_type: data.transaction_type,
                    exam_type: data.exam_type,
                    deduction_id: data.deduction_id,
                    deduction_status_positive: data.deduction_status_positive,
                    deduction_status_negative: data.deduction_status_negative,
                    credit_status_positive: data.credit_status_positive,
                    credit_status_negative: data.credit_status_negative,
                    email_status: data.email_status,
                    ho_debit: data.ho_debit,
                    ho_credit: data.ho_credit,
                    branch_debit: data.branch_debit,
                    branch_credit: data.branch_credit,
                    advances_debit: data.advances_debit,
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
                api={exportAllCSHubTransactionType}
                exportFileName={`CSHUB-TRANSACTION-TYPES-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="description"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end items-center">
                    <div>
                        <Button
                            label="Create new type"
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

            <CreateCSHubTransactionTypeForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditCSHubTransactionTypeForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default CSHubTransactionTypeTableCard;