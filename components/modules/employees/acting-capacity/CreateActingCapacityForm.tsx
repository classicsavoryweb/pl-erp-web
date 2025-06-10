"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import BranchDropDown from "../../generic/BranchDropDown";
import confirm from "@/components/common/Confirm";
import moment from "moment";
import Grid from "@/components/common/Grid";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import EmployeeOffenseHistory from "../offense-history/EmployeeOffenseHistory";
import ActingCapacityOffenseTable from "./ActingCapacityOffenseTable";
import PositionDropDown from "../../generic/PositionDropDown";
import EmployeeBasicInfo from "../EmployeeBasicInfo";
import Badge from "@/components/common/Badge";
import { addActingCapacity } from "@/api/acting-capacity";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateActingCapacityForm = ({
    modal,
    onSubmitCallback,
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>({});

    const formHandler = useFormik({
        initialValues: {
            employee_number: "",
            recommended_position_id: "",
            start_date: "",
            end_date: "",
            recommendation_letter: "",
            remarks: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_number: Yup.string().required("Employee is required"),
            recommended_position_id: Yup.string().required("Recommended position is required"),
            start_date: Yup.string().required("Start date is required"),
            end_date: Yup.string().required("End date is required"),
            recommendation_letter: Yup.string().required("Recommendation letter is required"),
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
                                formHandler.setFieldValue("employee_number", e.target.value.employee_number);
                            }}
                            value={employee}
                            error={formHandler.errors.employee_number}
                            required
                        />

                        <PositionDropDown
                            label="Recommended Position"
                            placeholder="select position"
                            name="recommended_position_id"
                            onChange={formHandler.handleChange}
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

                        <Textfield
                            type="file"
                            label="Recommendation Letter"
                            name="recommenndation_letter"
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                    formHandler.setFieldValue("recommendation_letter", file);
                                }
                            }}
                            error={formHandler.errors.recommendation_letter}
                            required
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
                    <div className="pt-5">
                        <p className="text-sm  font-semibold text-gray-500 pb-3">
                            Employee Details:
                        </p>

                        <div className="flex gap-x-5 items-center">
                            <EmployeeBasicInfo
                                label="Full Name"
                                detail={employee.full_name}
                            />
                            <div className="flex gap-x-1 items-center">
                                <Badge
                                    status={employee.status === "active" ? "success" : "danger"}
                                    label={employee.status}
                                />
                                <p>- {employee.employee_status?.description}</p>
                            </div>
                        </div>

                        <EmployeeBasicInfo
                            label="Employee Number"
                            detail={employee.employee_number}
                        />

                        <EmployeeBasicInfo
                            label="Current Position"
                            detail={employee.current_position.description}
                        />

                        <EmployeeBasicInfo
                            label="Current Branch"
                            detail={employee.current_branch.name}
                        />
                    </div>
                }
                
                { Object.entries(employee).length > 0 &&
                    <>
                        <p className="pt-5">Offenses:</p>
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