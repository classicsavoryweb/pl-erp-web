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
import EditLastPaySetupForm from "./EditLastPaySetupForm";
import { exportAllLastPaySetup, getAllLastPaySetup } from "@/api/maintenance/last-pay-setup";
    
const LastPaySetupTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllLastPaySetup({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching Last Pay Setup");
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
            columnHead: "Debit Account",
            path: "debit.acc_name", 
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Credit Account",
            path: "credit.acc_name", 
            columnType: COLUMNTYPES.string
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    debit_id: data.debit_id,
                    credit_id: data.credit_id,
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
                api={exportAllLastPaySetup}
                exportFileName={`LAST-PAY-SETUP-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="debit.acc_name"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <EditLastPaySetupForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

        </>
    );
};

export default LastPaySetupTableCard;