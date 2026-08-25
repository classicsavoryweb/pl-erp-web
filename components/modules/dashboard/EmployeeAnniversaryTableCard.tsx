"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { getEmployeeAnniversary } from "@/api/dashboard";
import moment from "moment";

const EmployeeAnniversary = () => {
    const api = useApiCall();
    const paginator = usePagination();

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeAnniversary({
            page: paginator.page,
            per_page: paginator.per_page,
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching employees");
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
    }, [paginator.reload, api.reload]);

    const columnSettings = [
        {
            columnHead: "Full Name",
            path: "full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "current_branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Position",
            path: "current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Anniversary Date",
            path: "date_hired",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                return moment(data.date_hired).format("MMM DD");
            }
        },
        {
            columnHead: "Years of Service",
            path:"",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                const date_hired = moment(data.date_hired);
                const today = moment();
                const year = today.diff(date_hired, 'years');

                return <span>{year}{" "}{year === 1 || year === 0 ? "Year" : "Years"}</span>
            }
        }
    ];

    return (
        <>
            <Card>
                <p>Employee Anniversary</p>
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

export default EmployeeAnniversary;