"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import { exportAnnualTaxTable, getAnnualTaxTable } from "@/api/maintenance/tax";
    
const AnnualTaxTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAnnualTaxTable({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching tax contributions");
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
            columnHead: "Minimum Amount",
            path: "minimum_amount",
            columnType: COLUMNTYPES.amount,
        },
        {
            columnHead: "Maximum Amount",
            path: "max_amount",
            columnType: COLUMNTYPES.amount,
        },
        {
            columnHead: "Lower Limit",
            path: "tax_lower_limit",
            columnType: COLUMNTYPES.amount,
        },
        {
            columnHead: "Percentage",
            path: "percentage",
            columnType: COLUMNTYPES.amount,
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={columnSettings}
                filterHandler={filter}
                hasExport
                api={exportAnnualTaxTable}
                exportFileName={`ANNUAL-TAX-${moment().format("YYYY-MM-DD")}.xls`}
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
                />
            </Card>
        </>
    );
};

export default AnnualTaxTableCard;