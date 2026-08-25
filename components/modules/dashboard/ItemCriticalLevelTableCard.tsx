"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { getItemCriticalLevel } from "@/api/dashboard";
import moment from "moment";

const ItemCriticalLevel = () => {
    const api = useApiCall();
    const paginator = usePagination();

    useAsyncEffect(() => {
        api.setLoading(true);
        getItemCriticalLevel({
            page: paginator.page,
            per_page: paginator.per_page,
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching employees");
            } else {
                api.setDataSet(resp.data.data);
                console.log(resp.data.data);
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
    }, [paginator.reload, api.reload]);

    const columnSettings = [
        {
            columnHead: "Item No",
            path: "item_no",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Stock on Hand",
            path: "stock_on_hand",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Critical Level",
            path: "crit_level",
            columnType: COLUMNTYPES.string
        },
       
    ];

    return (
        <>
            <Card>
                <p>Items need to replenish</p>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
        </>
    );
};

export default ItemCriticalLevel;