"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import BranchDropDown from "../../generic/BranchDropDown";
import confirm from "@/components/common/Confirm";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { createBiotimeLog } from "@/api/transactions/actual-time";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

type PunchFormValues = {
    punches: { punch_time: string }[];
    employee_number: string;
    branch_id: string;
    date: string;
};

const CreateLogModal = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const formHandler = useFormik<PunchFormValues>({
        initialValues: {
            punches: [{punch_time: ""}],
            employee_number: "",
            branch_id: "",
            date: ""
        },
        validationSchema: Yup.object().shape({
            punches: Yup.array()
                .of(Yup.object().shape({
                    punch_time: Yup.string().required("Punch time is required"),
                }))
                .min(1, "At least one punch is required"),
            employee_number: Yup.string().required("Employee is required"),
            branch_id: Yup.string().required("Branch is required"),
            date: Yup.string().required("Date is required"),          
        }),
        onSubmit: async (values) => {
            const isConfirmed = await confirm({
                title: "Edit Biotime Punches",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                createBiotimeLog(values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        modal.onClose();
                        onSubmitCallback();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Biotime Logs"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <p>Employee Details</p>
                <EmployeeDropDown
                    label="Employee"
                    placeholder="select employee"
                    onChange={(e) => {
                        formHandler.handleChange(e);
                        formHandler.setFieldValue("branch_id", e.target.obj.branch_id);
                    }}
                    name="employee_number"
                    value={formHandler.values.employee_number}
                    error={formHandler.errors.employee_number}
                    required
                />
                <BranchDropDown
                    label="Branch"
                    placeholder="select branch"
                    onChange={formHandler.handleChange}
                    name="branch_id"
                    value={Number(formHandler.values.branch_id)}
                    error={formHandler.errors.branch_id}
                    required
                />

                <p className="mt-2">Log Details</p>
                <Textfield
                    type="date"
                    label="Date"
                    onChange={formHandler.handleChange}
                    name="date"
                    value={formHandler.values.date}
                    error={formHandler.errors.date}
                    required
                />
                <div className="flex justify-end">
                    <div>
                        <Button
                            label="Add"
                            type="button"
                            onClick={() => {
                                formHandler.setFieldValue("punches", [
                                    ...formHandler.values.punches,
                                    { punch_time: "" },
                                ], false);
                            }}
                        />            
                    </div>
                </div>

                {formHandler.values.punches.map((punch: any, index) => (
                    <div key={index}>
                        {index >= 0 && (
                            <div className="flex justify-end text-red-500">
                                <p
                                    className="z-1 pt-3 mb-[-22px] hover:text-red-800 text-sm hover:cursor-pointer"
                                    onClick={() => {
                                        const updatedPunches = [...formHandler.values.punches];
                                        updatedPunches.splice(index, 1);
                                        formHandler.setFieldValue("punches", updatedPunches, false);
                                    }}
                                >
                                    Remove
                                </p>
                            </div>
                        )}
                        <Textfield
                            key={index}
                            type="datetime-local"
                            label={`Punch Time #${index + 1}`}
                            value={punch.punch_time}
                            onChange={(e) => {
                                const updatedPunches:any = [...formHandler.values.punches];
                                updatedPunches[index] = {
                                    punch_time: e.target.value.replace("T", " ") + ":00"
                                };
                                formHandler.setFieldValue('punches', updatedPunches);
                            }}
                            error={
                                formHandler.touched.punches?.[index]?.punch_time &&
                                typeof (formHandler.errors.punches as { punch_time?: string }[] | undefined)?.[index]?.punch_time === "string"
                                    ? (formHandler.errors.punches as { punch_time?: string }[])[index].punch_time
                                    : ""
                            }
                        />
                    </div>
                ))}
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Submit"
                            type="submit"
                            onClick={() => {}}
                        />            
                    </div>
                    <div>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />            
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default CreateLogModal;