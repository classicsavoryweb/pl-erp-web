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
import { getAllBankAccountTypes } from "@/api/bank-account-types";
import { useFilter } from "@/hooks/use-filter";
import FilterCard from "../../cards/FilterCard";
import { exportAllCoeReasons, getAllCoeReasons } from "@/api/coe-reason";
import CreateCoeReasonForm from "./CreateCoeReasonForm";
import EditCoeReasonForm from "./EditCoeReasonForm";
import moment from "moment";
import DropDownButtons from "@/components/common/DropDownButtons";

const CoeReasonsTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllCoeReasons({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching coe reasons");
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
            columnHead: "Reason",
            path: "reason",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        }
    ];

    const actionSettings = [
        {
            label: "Create new reason",
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
                    reason: data.reason,
                    status: data.status,
                });
            }
        },
        
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Reason",
                        path: "reason",
                        columnType: COLUMNTYPES.string
                    },
                ]}
                filterHandler={filter}
                withStatus
                hasExport
                api={exportAllCoeReasons}
                exportFileName={`COE-REASONS-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="reason"
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
            <CreateCoeReasonForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditCoeReasonForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default CoeReasonsTableCard;