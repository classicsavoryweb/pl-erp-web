"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import Link from "next/link";
import { getEmployeeBirthMonth } from "@/api/dashboard";
import moment from "moment";

const EmployeeBirthmonthTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeBirthMonth({
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
            columnHead: "Age",
            path: "age",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Birthday",
            path: "birthday",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                return moment(data.birthday).format("MMMM DD");
            }
        },
    ];

    return (
        <>
            <Card>
                <p className="text-sm">Birthday Celebrants</p>
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

export default EmployeeBirthmonthTableCard;