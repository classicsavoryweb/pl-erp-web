import Modal from "@/components/common/Modal";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useFilter } from "@/hooks/use-filter";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getThirteenthMonthPay } from "@/api/reports/reports-13th-month";
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

const ViewLastPayModal = ({
    modal,
    id,
}: ModalInterface
) => {

    const paginator = usePagination(10);
    const api = useApiCall();
    const filter = useFilter();
    const [employee, setEmployee] = useState<any>({});
    const [branch, setBranch] = useState<any>({});

    const formHandler = useFormik({
        initialValues: {
            employee_id: "",
            branch_id : "",
        },
        validateOnChange: false,
        onSubmit: async (values, { setSubmitting }) => {
            api.triggerReload();
            filter.onReload();
            filter.setFilters(values);
            setSubmitting(true);
        }
    });

    useAsyncEffect(() => {
        api.setLoading(false);

        if (modal.isShowing) {
            api.setLoading(true);
            getThirteenthMonthPay(
            id,{
                page: paginator.page,
                per_page: paginator.per_page,
                ...formHandler.values
            })
                .then((resp) => {
                if (!resp.error) {
                    api.setDataSet(resp.data.data);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                } else {
                    toast.error("Error fetching Thirteenth Month Pay");
                }
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }
    , [paginator.reload, api.reload, id]);

    const thirteenthMonthColumnSettings = [
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
            columnHead: "12/11 to 25",
            path: "december_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "12/26 to 10",
            path: "january_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "1/11 to 25",
            path: "january_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "1/26 to 10",
            path: "february_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "2/11 to 25",
            path: "february_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "2/26 to 10",
            path: "march_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "3/11 to 25",
            path: "march_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "3/26 to 10",
            path: "april_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "4/11 to 25",
            path: "april_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "4/26 to 10",
            path: "may_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "5/11 to 25",
            path: "may_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "5/26 to 10",
            path: "june_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "6/11 to 25",
            path: "june_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "6/26 to 10",
            path: "july_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "7/11 to 25",
            path: "july_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "7/26 to 10",
            path: "august_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "8/11 to 25",
            path: "august_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "8/26 to 10",
            path: "september_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "9/11 to 25",
            path: "september_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "9/26 to 10",
            path: "october_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "10/11 to 25",
            path: "october_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "10/26 to 10",
            path: "november_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "11/11 to 25",
            path: "november_2nd_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "11/26 to 10",
            path: "december_1st_cutoff",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Total",
            path: "total",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Net Claim",
            path: "net_claim",
            columnType: COLUMNTYPES.amount
        },
    ];

    return (
        <Modal
            isShowing={modal.isShowing}
            title="13th Month Pay Record"
            onClose={() => {
                modal.onClose();
            }}
            size="entireScreen"
        >
            <Card>
                <p className=" font-semibold text-blue-950">Filters</p>
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
                dataSet={api.dataSet}
                paginator={paginator}
                loading={api.loading}
                columnSettings={thirteenthMonthColumnSettings}
                smallText
            />
        </Modal>
    );
};

export default ViewLastPayModal;
