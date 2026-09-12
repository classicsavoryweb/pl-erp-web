import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import Link from "next/link";
import { getEmployeeBirthMonth, getEmployeeExpiringContracts, getEmployeesForLastPay } from "@/api/dashboard";
import moment from "moment";

const EmployeeForLastPayTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination();

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeesForLastPay({
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
            columnHead: "Employee Number",
            path: "employee_number",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                return (
                    <Link
                        href={`/employees/${data.employee_number}`}
                        target="_blank"
                        className="text-blue-700 underline"
                    >
                        {data.employee_number}
                    </Link>
                )
            }
        },
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
            columnHead: "Reason",
            path: "separation.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date Separated",
            path: "separation_date",
            columnType: COLUMNTYPES.date
        },
    ];
    
    return (
        <Card>
            <p>For Last Pay Computation</p>
            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                paginator={paginator}
            />
        </Card>
    );
};

export default EmployeeForLastPayTableCard;