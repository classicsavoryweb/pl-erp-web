"use client";
import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { getAllBranchAdditionalIncome } from "@/api/compensation/branch-additional-income";
import { useFilter } from "@/hooks/use-filter";
import FilterCard from "../../cards/FilterCard";
import CreateBranchAdditionalIncomeForm from "./CreateBranchAdditionalIncomeForm";

const BranchAdditionalIncomeTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const filter = useFilter();
    const createModal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllBranchAdditionalIncome({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching additional income");
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
            columnHead: "Branch",
            path: "branch.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Payment Date",
            path: "pay_date",
            columnType: COLUMNTYPES.date
        },
    ];

    const actionsSettings = [
        {
            label: "Create Additional Income",
            onClick: () => {
                createModal.onOpen();
            }
        }
    ];

    return (
        <>
            <FilterCard
                filterHandler={filter}
                columnSettings={columnSettings}
                withBranch
                defaultColumnSelected="branch.name"
                hasDateRange
                dateLabel="Payment Date"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end">
                    <div>
                        <DropDownButtons
                            actions={actionsSettings}
                        />
                    </div>
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
            <CreateBranchAdditionalIncomeForm
                modal={createModal}
                onSubmitCallback={() => {
                    api.triggerReload();
                    createModal.onClose();
                }}
            />
        </>
    );
};

export default BranchAdditionalIncomeTableCard;