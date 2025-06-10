"use client";
import { getEmployeeOffensesHistory, } from "@/api/employee";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";;
import { toast } from "react-toastify";

const ActingCapacityOffenseTable = ({
    employeeNumber
}: { employeeNumber: string}) => {
    const api = useApiCall();
    const paginator = usePagination(3);

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeOffensesHistory(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching offenses");
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
    }, [paginator.reload, api.reload, employeeNumber]);

    const columnSettings = [
        {
            columnHead: "Date Committed",
            path: "date_committed",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Category",
            path: "offense.category",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Offense",
            path: "offense.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Transgression",
            path: "transgression",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Summary",
            path: "summary",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Repetition",
            path: "repetition",
            columnType: COLUMNTYPES.string
        },
    ];
    
    return (
        <>
            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                paginator={paginator}
            />
        </>
    );
};

export default ActingCapacityOffenseTable;