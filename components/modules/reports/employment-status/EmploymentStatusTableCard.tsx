"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useState } from "react";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getEmploymentStatusReport } from "@/api/reports/reports-employment-status";
import { toast } from "react-toastify";
import Grid from "@/components/common/Grid";
import BranchDropDown from "../../generic/BranchDropDown";
import Dropdown from "@/components/common/Dropdown";
import { useModal } from "@/hooks/modal";
import EmploymentStatusModal from "./EmploymentStatusModal";

const EmploymentStatusTableCard = () => {
    const [reportData, setReport] = useState<any[]>([]);
    const [dataSet, setDataSet] = useState<any[]>([]);

    const columnSettings = [
        {
            columnHead: "Employee Number",
            path: "employee_number",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employee",
            path: "full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Position",
            path: "current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Contract Start Date",
            path: "latest_contract.contract_start_date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Contract End Date",
            path: "latest_contract.contract_end_date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Remarks",
            path: "latest_contract.remarks",
            columnType: COLUMNTYPES.string
        },
    ];

    const formHandler = useFormik({
        initialValues: {
            branch_id : "",
            month: "",
            year: new Date().getFullYear(),
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            branch_id: Yup.string().required("Branch is required"),
            month: Yup.string().required("Month is required"),
            year: Yup.string().required("Year is required"),
        }),
        onSubmit: (values, {setSubmitting}) => {
            getEmploymentStatusReport(values)
            .then((resp) => {
                if (!resp.error) {
                    setDataSet(resp.data.employees);
                    setReport(resp.data.data);
                } else {
                    setDataSet([]);
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                setDataSet([]);
                toast.error("Error encountered");
            }).finally(() => {
                setSubmitting(false);
            });
        }
    });

    const printModal = useModal();

    return (
        <>
            <EmploymentStatusModal
                modal={printModal}
                reports={reportData}
            />
            <Card>
                <p className="text-sm font-semibold text-red-800">Filters</p>
                <form onSubmit={formHandler.handleSubmit}>
                    <Grid cols={4}>
                        <BranchDropDown
                            placeholder="select branch"
                            label="Branch"
                            name="branch_id"
                            value={formHandler.values.branch_id}
                            onChange={formHandler.handleChange}
                            error={formHandler.errors.branch_id}
                        />
                        <Dropdown
                            placeholder="select month"
                            label="Month"
                            name="month"
                            value={formHandler.values.month}
                            onChange={formHandler.handleChange}
                            options={[
                                    { label: "January", value: "01" },
                                    { label: "February", value: "02" },
                                    { label: "March", value: "03" },
                                    { label: "April", value: "04" },
                                    { label: "May", value: "05" },
                                    { label: "June", value: "06" },
                                    { label: "July", value: "07" },
                                    { label: "August", value: "08" },
                                    { label: "September", value: "09" },
                                    { label: "October", value: "10" },
                                    { label: "November", value: "11" },
                                    { label: "December", value: "12" },
                            ]}
                            error={formHandler.errors.month}
                        />
                        <Dropdown
                            placeholder="select year"
                            label="Year"
                            name="year"
                            value={String(formHandler.values.year)}
                            onChange={formHandler.handleChange}
                            options={Array.from({ length: 100 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return { label: year.toString(), value: year.toString() };
                            })}
                            error={formHandler.errors.year}
                        />
                    </Grid>
                    <div className="flex justify-end gap-x-2">
                        <div className="w-[100px]">
                            <Button
                                type="submit"
                                label="Search"
                                onClick={() => {}}
                            />    
                        </div>
                        <div className="w-[100px]">
                            <Button
                                label="Print"
                                type="button"
                                onClick={() => {
                                    formHandler.validateForm();
                                    if (formHandler.isValid && dataSet.length > 0) {
                                        printModal.onOpen();
                                    }
                                }}
                            />    
                        </div>
                        <div className="w-[100px]">
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    setDataSet([]);
                                    formHandler.resetForm();
                                }}
                                variant="secondary"
                            />    
                        </div>
                    </div>
                </form>
            </Card>
            <Card>
                <p className="text-sm font-semibold text-red-800">Employees</p>
                <Table
                    dataSet={dataSet}
                    columnSettings={columnSettings}
                    loading={formHandler.isSubmitting}
                />
            </Card>
        </>
    );
};

export default EmploymentStatusTableCard;