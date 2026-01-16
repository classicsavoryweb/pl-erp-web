import Modal from "@/components/common/Modal";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useFilter } from "@/hooks/use-filter";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getBranchesMonthlyAllocation, getEmployeesMonthlyAllocation } from "@/api/reports/reports-13th-month";
import usePagination from "@/hooks/pagination";
import { useApiCall } from "@/hooks/api-call";
import BranchDropDown from "../../generic/BranchDropDown";
import Card from "@/components/common/Card";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import { useState } from "react";
import Button from "@/components/common/Button";

interface ModalInterface {
    modal: any;
    id: any;
}

const ViewThirteenthMonthMonthlyAllocationModal = ({
    modal,
    id,
}: ModalInterface
) => {

    const api = useApiCall();
    const filter = useFilter();
    const [employee, setEmployee] = useState<any>({});
    const [branch, setBranch] = useState<any>({});

    const branchesApi = useApiCall();
    const employeesApi = useApiCall();

    const branchesPaginator = usePagination(10);
    const employeesPaginator = usePagination(10);

    const formHandler = useFormik({
        initialValues: {
            employee_id: "",
            branch_id : "",
        },
        validateOnChange: false,
        onSubmit: async (values, { setSubmitting }) => {
            filter.setFilters(values);
            branchesApi.triggerReload();
            employeesApi.triggerReload();
            setSubmitting(true);
        }
    });

    useAsyncEffect(() => {
        if (modal.isShowing){
            branchesApi.setLoading(true);

            getBranchesMonthlyAllocation(id, {
                page: branchesPaginator.page,
                per_page: branchesPaginator.per_page,
                ...formHandler.values
            })
                .then((resp) => {
                if (!resp.error) {
                    branchesApi.setDataSet(resp.data.data);
                    branchesPaginator.setPage(resp.data.current_page);
                    branchesPaginator.setPaginationData(resp.data);
                } else {
                    toast.error("Error fetching Branch Monthly Allocation");
                }
            }).finally(() => 
                {branchesApi.setLoading(false)
            });

            employeesApi.setLoading(true);

            getEmployeesMonthlyAllocation(id, {
                page: employeesPaginator.page,
                per_page: employeesPaginator.per_page,
                ...formHandler.values
            })
                .then((resp) => {
                if (!resp.error) {
                    employeesApi.setDataSet(resp.data.data);
                    employeesPaginator.setPage(resp.data.current_page);
                    employeesPaginator.setPaginationData(resp.data);
                } else {
                    toast.error("Error fetching Employee Monthly Allocation");
                }
            }).finally(() => {
                employeesApi.setLoading(false)
            });
        }

    }, [modal.isShowing, branchesPaginator.reload, employeesPaginator.reload, branchesApi.reload, employeesApi.reload, id]);

    const employeesThirteenthMonthColumnSettings = [
        {
            columnHead: "Employee Number",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch Short Name",
            path: "branch_short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Basic Pay (1st Cutoff)",
            path: "basic_pay_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Basic Pay (2nd Cutoff)",
            path: "basic_pay_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Total",
            path: "total",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Net Claim (13th Month)",
            path: "net_claim_13th_month",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Net Claim (Payleave)",
            path: "net_claim_pay_leave",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Net Claim (Additional 6%)",
            path: "net_claim_additional",
            columnType: COLUMNTYPES.amount
        },
    ];

    const branchesThirteenthMonthColumnSettings = [
        {
            columnHead: "Branch",
            path: "branches.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Branch Net Claim (13th Month)",
            path: "branch_net_claim_13th_month",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Branch Net Claim (Payleave)",
            path: "branch_net_claim_pay_leave",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Branch Net Claim (Additional 6%)",
            path: "branch_net_claim_additional",
            columnType: COLUMNTYPES.amount
        },
    ];

    return (
        <Modal
            isShowing={modal.isShowing}
            title="13th Month Monthly Allocation"
            onClose={() => {
                modal.onClose();
            }}
            size="entireScreen"
        >
            <Card>
                <p className=" font-semibold text-red-800">Filters</p>
                <form onSubmit={formHandler.handleSubmit}>
                    <Grid cols={4}>
                        <SearchEmployeeDropDown
                            label="Employee"
                            placeholder="select employee"
                            name="employee_id"
                            onChange={(e) => {
                                const selectedEmployee = e.target.value;
                                setEmployee(selectedEmployee);
                                formHandler.setFieldValue("employee_id", selectedEmployee.id);
                            }}
                            value={employee}
                            error={formHandler.errors.employee_id}
                        />
                        <BranchDropDown
                            placeholder="select branch"
                            label="Branch"
                            name="branch_id"
                            value={formHandler.values.branch_id}
                            onChange={(e) => {
                                formHandler.handleChange(e);
                                const branch = e.target.obj;
                                setBranch(branch);
                            }}
                            error={formHandler.errors.branch_id}
                        />
                    </Grid>
                    <div className="flex justify-end gap-x-2">
                        <div className="w-[100px]">
                            <Button
                                label="Search"
                                onClick={() => {
                                    formHandler.setFieldValue("action", "search");
                                    formHandler.submitForm();
                                    api.triggerReload();
                                }}
                            />    
                        </div>
                        <div className="w-[100px]">
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    api.setDataSet([]);
                                    formHandler.resetForm();
                                    formHandler.submitForm();
                                    setEmployee({});
                                    setBranch({});
                                }}

                                variant="secondary"
                            />
                        </div>
                    </div>
                </form>
            </Card>
            <Table
                dataSet={employeesApi.dataSet}
                paginator={employeesPaginator}
                loading={employeesApi.loading}
                columnSettings={employeesThirteenthMonthColumnSettings}
                smallText
            />

            <Table
                dataSet={branchesApi.dataSet}
                paginator={branchesPaginator}
                loading={branchesApi.loading}
                columnSettings={branchesThirteenthMonthColumnSettings}
                smallText
            />
        </Modal>
    );
};

export default ViewThirteenthMonthMonthlyAllocationModal;
