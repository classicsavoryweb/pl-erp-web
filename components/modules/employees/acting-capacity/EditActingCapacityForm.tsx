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
import PositionDropDown from "../../generic/PositionDropDown";
import { editActingCapacity, getACF } from "@/api/acting-capacity";
import BranchDropDown from "../../generic/BranchDropDown";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import Dropdown from "@/components/common/Dropdown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    id: string;
};

const EditActingCapacityForm = ({
    modal,
    id,
    onSubmitCallback,
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>({});
    const api = useApiCall();

    const formHandler = useFormik({
        initialValues: {
            id: id,
            employee_number: "",
            recommended_position_id: "",
            start_date: "",
            end_date: "",
            recommendation_letter: "",
            remarks: "",
            oic_employee_number: "",
            branch_assignment_id: "",
            extensions: [{ end_date: "", reason: "", remarks: "" }],
        },
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Acting Capacity",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editActingCapacity(values).then((resp) => {
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
                console.log(values);
            }
        }
    });

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getACF(id).then((resp) => {
                if (!resp.error) {
                    const acting = resp.data.acting_capacity;
                    setEmployee(resp.data.acting_capacity.employee);
                    formHandler.setValues({
                        id: acting.id,
                        employee_number: acting.employee.employee_number,
                        recommended_position_id: acting.recommended_position_id,
                        start_date: acting.start_date,
                        end_date: acting.end_date,
                        recommendation_letter: acting.recommendation_letter,
                        remarks: acting.remarks,
                        oic_employee_number: acting.oic_employee_number,
                        branch_assignment_id: acting.branch_assignment_id,
                        extensions: acting.extensions
                    });

                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                setEmployee({});
                formHandler.resetForm();
            }}
            title="Edit Acting Capacity"
            size="xl"
            loading={api.loading}
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={2}>
                    <SearchEmployeeDropDown
                        label="Employee"
                        placeholder="select employee"
                        name="employee"
                        onChange={(e) => {
                            console.log(e.target.value);
                            setEmployee(e.target.value);
                            formHandler.setFieldValue("branch_assignment_id", e.target.value.branch_id);
                            formHandler.setFieldValue("employee_number", e.target.value.employee_number);
                            const station = String(e.target.value.current_position.station.name).toLowerCase();
                            const oicEmpNumber = (station === "back of the house")
                                ? e.target.value.current_branch.kitchen_oic_employee_number
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
                        onChange={formHandler.handleChange}
                        value={Number(formHandler.values.recommended_position_id)}
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
                        value={Number(formHandler.values.branch_assignment_id)}
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
                    <div className="pt-3">
                        <p className="text-sm font-semibold text-gray-500">
                            Employee Details
                        </p>
                        <Grid cols={2}>
                            <Textfield
                                label="Full Name"
                                value={employee.full_name}
                                disabled
                            />
                            <Textfield
                                label="Status"
                                value={employee.employee_status.description}
                                disabled
                            />
                            <Textfield
                                label="Employee Number"
                                value={employee.employee_number}
                                disabled
                            />
                            <Textfield
                                label="Current Position"
                                value={employee.current_position.description}
                                disabled
                            />
                            <Textfield
                                label="Branch"
                                value={employee.current_branch.name}
                                disabled
                            />
                        </Grid>
                    </div>
                }

                { formHandler.values.extensions.length === 0 &&
                    <div className="pt-3">
                        <p className="text-sm font-semibold text-gray-500">
                            Extensions
                        </p>

                        <Grid cols={3}>
                            <Textfield
                                type="date"
                                label="End Date"
                                name={`extensions[0].end_date`}
                                value={formHandler.values.extensions[0]?.end_date || ""}
                                onChange={formHandler.handleChange}
                            />
                            <Dropdown
                                label="Reason"
                                name={`extensions[0].reason`}
                                value={formHandler.values.extensions[0]?.reason || ""}
                                placeholder="select reason"
                                onChange={formHandler.handleChange}
                                options={[
                                    {
                                        label: "Extended",
                                        value: "Extended"
                                    },
                                    {
                                        label: "Fast Tracked",
                                        value: "Fast Tracked"
                                    }
                                ]}
                            />
                            <Textfield
                                label="Remarks"
                                name={`extensions[0].remarks`}
                                placeholder="enter remarks"
                                value={formHandler.values.extensions[0]?.remarks || ""}
                                onChange={formHandler.handleChange}
                            />
                        </Grid>
                    </div>
                }

                { formHandler.values.extensions.length > 0 &&
                    <div className="pt-3">

                        <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-gray-500">
                                Extensions
                            </p>
                            <div>

                                <Button
                                    label="Add"
                                    onClick={() =>
                                        formHandler.setFieldValue("extensions", [
                                                ...formHandler.values.extensions,
                                                { end_date: "", reason: "", remarks: "" },
                                            ]
                                        )
                                    }
                                />
                            </div>
                        </div>

                        { formHandler.values.extensions.map((ex, id) => {
                            return (
                                <Grid cols={3} key={id}>
                                    <Textfield
                                        type="date"
                                        label="End Date"
                                        name={`extensions[${id}].end_date`}
                                        value={formHandler.values.extensions[id]?.end_date || ""}
                                        onChange={formHandler.handleChange}
                                    />
                                    <Dropdown
                                        label="Reason"
                                        name={`extensions[${id}].reason`}
                                        value={formHandler.values.extensions[id]?.reason || ""}
                                        placeholder="select reason"
                                        onChange={formHandler.handleChange}
                                        options={[
                                            {
                                                label: "Extended",
                                                value: "Extended"
                                            },
                                            {
                                                label: "Fast Tracked",
                                                value: "Fast Tracked"
                                            }
                                        ]}
                                    />
                                    <Textfield
                                        label="Remarks"
                                        name={`extensions[${id}].remarks`}
                                        placeholder="enter remarks"
                                        value={formHandler.values.extensions[id]?.remarks || ""}
                                        onChange={formHandler.handleChange}
                                    />
                                </Grid>
                            );
                        })}
                    </div>
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

export default EditActingCapacityForm;