"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { exportEmployeeList, getAllEmployees } from "@/api/employee";
import { useRouter } from "next/navigation";
import FilterCard from "../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import { useEffect, useState } from "react";

const EmployeeTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(15);
    const filter = useFilter();
    const [sort, setSort] = useState<any>({});

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllEmployees({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
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
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Employee Number",
            path: "employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Biometric Number",
            path: "biometric_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Name",
            path: "full_name",
            columnType: COLUMNTYPES.string,
            sort: true
        },
        {
            columnHead: "Agency",
            path: "agency.name",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Position",
            path: "current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch",
            path: "current_branch.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date Hired",
            path: "date_hired",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        }
    ];

    const tableActions = [
        {
            label: "View",
            onClick: (data: any) => {
                window.open(`/employees/${data.employee_number}`, '_blank');
            }
        },
    ];

    const exportOptions = [
        {
            label: "Employee Name",
            value: "full_name",
            checked: true,
        },
        {
            label: "Employee Number",
            value: "employee_number",
            checked: true,
        },
        {
            label: "Employee Number 2",
            value: "employee_number_2",
            checked: true,
        },
        {
            label: "Biometric ID",
            value: "biometric_number",
        },
        {
            label: "Position",
            value: "current_position.description",
        },
        {
            label: "Branch",
            value: "current_branch.name",
        },
        {
            label: "Home Branch",
            value: "home_branch.name",
        },
        {
            label: "Date Hired",
            value: "date_hired",
        },
        {
            label: "Status",
            value: "status",
            checked: true,
        },
        {
            label: "Employment Status",
            value: "employee_status.description",
            checked: true,
        },
        {
            label: "Employee Type",
            value: "type",
        },
        {
            label: "Regularization Date",
            value: "regularization_date",
        },
        {
            label: "Civil Status",
            value: "civil_status",
        },
        {
            label: "Gender",
            value: "gender",
        },
        {
            label: "Height",
            value: "height",
        },
        {
            label: "Birthplace",
            value: "birthplace",
        },
        {
            label: "Birthday",
            value: "birthday",
        },
        {
            label: "Address",
            value: "address",
        },
        {
            label: "Region",
            value: "region",
        },
        {
            label: "Contact Number",
            value: "contact_number",
        },
        {
            label: "Email Address",
            value: "email",
        },
        {
            label: "Separation Date",
            value: "separation_date",
        },
        {
            label: "Separation Reason",
            value: "separation_reason",
        },
        {
            label: "TIN",
            value: "tin",
        },
        {
            label: "SSS",
            value: "sss",
        },
        {
            label: "Philhealth",
            value: "philhealth",
        },
        {
            label: "Pagibig",
            value: "pagibig",
        },
        {
            label: "Tax Type",
            value: "tax_type",
        },
        {
            label: "Proper Format Full Name",
            value: "proper_full_name",
        },
        {
            label: "Schedule Type",
            value: "schedule.schedule_type.name",
        },
        {
            label: "Incentive Leave",
            value: "schedule.incentive_leave",
        },
        {
            label: "Flexible Schedule",
            value: "schedule.flexible_schedule",
        },
        {
            label: "Age",
            value: "age",
        }
    ];

    return (
        <>
            <FilterCard
                hasDateRange
                withStatus
                filterHandler={filter}
                withFilterBranch
                withEmployeeType
                withEmploymentStatus
                withPosition
                isExpanded
                hasExport
                api={exportEmployeeList}
                exportFileName={`EMPLOYEES-${moment().format('MM-DD-YYYY')}.xls`}
                defaultColumnSelected="full_name"
                dateLabel="Date Hired"
                columnSettings={[
                    {
                        columnHead: "Employee Number",
                        path: "employee_number",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Biometric Number",
                        path: "biometric_number",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Employee Name",
                        path: "full_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Last Name",
                        path: "last_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Middle Name",
                        path: "middle_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "First Name",
                        path: "first_name",
                        columnType: COLUMNTYPES.string
                    },

                ]}
                exportPermission="export_employee_tracking"
                callBack={() => {
                    paginator.setPage(1);
                }}
                withExportOptions
                exportOptions={exportOptions}
                columnSort
                filterValues={sort}
            />
            <Card>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                    canSortColumns
                    onSort={(e) => {
                        setSort(e);
                    }}
                />
            </Card>
        </>
    );
};

export default EmployeeTableCard;