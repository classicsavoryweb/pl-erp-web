"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import confirm from "@/components/common/Confirm";
import Grid from "@/components/common/Grid";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import ActingCapacityOffenseTable from "./ActingCapacityOffenseTable";
import PositionDropDown from "../../generic/PositionDropDown";
import { addActingCapacity } from "@/api/acting-capacity";
import BranchDropDown from "../../generic/BranchDropDown";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import moment from "moment";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateActingCapacityForm = ({
    modal,
    onSubmitCallback,
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>({});
    const [current_station, setStation] = useState<string>("");

    const formHandler = useFormik({
        initialValues: {
            employee_number: "",
            recommended_position_id: "",
            start_date: "",
            end_date: "",
            recommendation_letter: "",
            remarks: "",
            oic_employee_number: "",
            branch_assignment_id: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_number: Yup.string().required("Employee is required"),
            recommended_position_id: Yup.string().required("Recommended position is required"),
            start_date: Yup.string()
                .required('Contract start date is required'),
            end_date: Yup.string()
                .required('Contract end date is required')
                .test(
                'future-date',
                'Contract end date must be later than start date',
                function (value) {
                    const { start_date } = this.parent;
                    if (!value || !start_date) return true;

                    return moment(value).isAfter(moment(start_date));
                })
                .test(
                'same-day',
                'Contract end date must be the same day as the start date',
                function (value) {
                    const { start_date } = this.parent;
                    if (!value || !start_date) return true;
                    const isSame = moment(value).format("DD") === moment(start_date).format("DD"); 

                    return isSame;
                }),
            recommendation_letter: Yup.string().when('date_from', (dateFrom, schema) => {
                const station = current_station;
                return station.toLowerCase() == "head office"
                    ? schema.notRequired()
                    : schema.required('Recommendation letter is required')
            }
            ),
            oic_employee_number: Yup.string().required("OIC is required"),
            branch_assignment_id: Yup.string().required("Branch assignment is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Acting Capacity",
                message: "Are you sure you want to save?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                addActingCapacity(values).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        resetForm();
                        onSubmitCallback();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    setSubmitting(false);
                });
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                setEmployee({});
                formHandler.resetForm();
            }}
            title="Create Acting Capacity"
            size="xl"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={2}>
                        <SearchEmployeeDropDown
                            label="Employee"
                            placeholder="select employee"
                            name="employee"
                            onChange={(e) => {
                                setEmployee(e.target.value);
                                formHandler.setFieldValue("branch_assignment_id", e.target.value.branch_id);
                                formHandler.setFieldValue("employee_number", e.target.value.employee_number);
                                const station = String(e.target.value.current_position.station.name).toLowerCase();
                                const oicEmpNumber = (station == "back of the house")
                                    ? e.target.value.current_branch.lab_head_employee_number
                                    : e.target.value.current_branch.branch_head_employee_number;
                                
                                formHandler.setFieldValue("oic_employee_number", oicEmpNumber);
                            }}
                            value={employee}
                            error={formHandler.errors.employee_number}
                            required
                            status="active"
                        />

                        <PositionDropDown
                            label="Recommended Position"
                            placeholder="select position"
                            name="recommended_position_id"
                            onChange={(e) => {
                                formHandler.handleChange(e);
                                const station = String(e.target.obj.station.name).toLowerCase();
                                setStation(station);
                            }}
                            value={formHandler.values.recommended_position_id ?? ""}
                            error={formHandler.errors.recommended_position_id}
                            required
                        />

                        <Textfield
                            type="date"
                            label="Start Date"
                            name="start_date"
                            onChange={formHandler.handleChange}
                            value={formHandler.values.start_date ?? ""}
                            error={formHandler.errors.start_date}
                            required
                        />

                        <Textfield
                            type="date"
                            label="End Date"
                            name="end_date"
                            onChange={formHandler.handleChange}
                            value={formHandler.values.end_date ?? ""}
                            error={formHandler.errors.end_date}
                            required
                        />

                        <BranchDropDown
                            label="Branch Assignment"
                            name="branch_assignment_id"
                            placeholder="select branch"
                            onChange={formHandler.handleChange}
                            value={Number(formHandler.values.branch_assignment_id) ?? ""}
                            error={formHandler.errors.branch_assignment_id}
                            required
                        />

                        <EmployeeDropDown
                            label="Branch/Kitchen OIC"
                            name="oic_employee_number"
                            placeholder="select oic"
                            onChange={formHandler.handleChange}
                            value={formHandler.values.oic_employee_number ?? ""}
                            error={formHandler.errors.oic_employee_number}
                            required
                        />

                        <Textfield
                            type="file"
                            label="Recommendation Letter"
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                    formHandler.setFieldValue("recommendation_letter", file);
                                }
                            }}
                            error={formHandler.errors.recommendation_letter}
                        />

                        <div className="col-span-2">
                            <TextArea
                                label="Remarks"
                                name="remarks"
                                onChange={formHandler.handleChange}
                                value={formHandler.values.remarks ?? ""}
                                error={formHandler.errors.remarks}
                                required
                            />
                        </div>
                </Grid>

                { Object.entries(employee).length > 0 &&
                    <div className="pt-3">
                        <p className=" font-semibold text-gray-500">
                            Employee Details
                        </p>
                        <Grid cols={2}>
                            <Textfield
                                label="Full Name"
                                value={employee.full_name ?? ""}
                                disabled
                            />
                            <Textfield
                                label="Status"
                                value={employee.employee_status.description ?? ""}
                                disabled
                            />
                            <Textfield
                                label="Employee Number"
                                value={employee.employee_number ?? ""}
                                disabled
                            />
                            <Textfield
                                label="Current Position"
                                value={employee.current_position.description ?? ""}
                                disabled
                            />
                            <Textfield
                                label="Branch"
                                value={employee.current_branch.name ?? ""}
                                disabled
                            />
                        </Grid>
                    </div>
                }
                
                { Object.entries(employee).length > 0 &&
                    <>
                        <p className=" pt-3 font-semibold text-gray-500">
                            Employee Offenses
                        </p>
                        <ActingCapacityOffenseTable
                            employeeNumber={employee.employee_number}
                        />
                    </>
                }

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                                setEmployee({});
                            }}
                        />
                    </div>     
                    <div>
                        <Button
                            type="submit"
                            label="Submit"
                            onClick={() => {}}
                        />         
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default CreateActingCapacityForm;