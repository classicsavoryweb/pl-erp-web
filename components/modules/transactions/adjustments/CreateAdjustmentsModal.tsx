import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import Grid from "@/components/common/Grid";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import Textfield from "@/components/common/Textfield";
import { useState } from "react";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getTimeKeeping } from "@/api/transactions/time-keeping";
import LoadingState from "@/components/common/LoadingState";
import Dropdown from "@/components/common/Dropdown";
import ScheduleMasterlistDropDown from "../../generic/ScheduleMasterlistDropDown";
import { createAdjustments } from "@/api/transactions/adjustments";
import BranchDropDown from "../../generic/BranchDropDown";

type PunchFormValues = {
    punches: { punch_time: string }[];
    employee_number: string;
    date: string;
    type: string;
    schedule: string;
    branch_id: string;
};

interface FormModalInterface {
    modal: any;
};

const CreateAdjustmentsModal = ({
    modal
}: FormModalInterface) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>([]);

    const formHandler = useFormik<PunchFormValues>({
        initialValues: {
            employee_number: "",
            date: "",
            punches: [{ punch_time: ""}],
            type: "",
            schedule: "",
            branch_id: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_number: Yup.string().required("Employee is required."),
            date: Yup.string().required("Date is required."),
            type: Yup.string().required("Adjustment type is required."),
            schedule: Yup.string().required("Schedule is required."),
            branch_id: Yup.string().required("Branch is required.")
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Create Adjustment",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                createAdjustments(values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Adjustment saved successfully");
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        }
    });

    useAsyncEffect(() => {
        if (formHandler.values.employee_number, formHandler.values.date) {
            setLoading(true);
            getTimeKeeping({
                employee_number: formHandler.values.employee_number,
                date: formHandler.values.date
            }).then((resp) => {
                if (!resp.error) {
                    if (resp.data) {
                        setData(resp.data);
                        formHandler.setFieldValue("punches", resp.data.biotime_log.punches);
                        formHandler.setFieldValue("schedule", resp.data.schedule.timetable);
                        formHandler.setFieldValue("branch_id", resp.data.branch_id);
                    } else {
                        setData([]);
                        formHandler.setFieldValue("punches", []);
                        formHandler.setFieldValue("schedule", "");
                        formHandler.setFieldValue("branch_id", "");
                    }
                } else {
                    toast.error("Error fetching timekeeping details.");
                }
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [formHandler.values.employee_number, formHandler.values.date]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Adjustments"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
                setData([]);
            }}
            size="lg"
        >
            <form onSubmit={formHandler.handleSubmit}>
            <Grid cols={2}>
                <EmployeeDropDown
                    label="Employee"
                    name="employee_number"
                    placeholder="select employee"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.employee_number}
                    error={formHandler.errors.employee_number}
                    required
                />

                <Textfield
                    type="date"
                    label="Date"
                    name="date"
                    value={formHandler.values.date || ""}
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.date}
                    required
                />

                <BranchDropDown
                    label="Branch"
                    name="branch_id"
                    placeholder="select branch"
                    onChange={formHandler.handleChange}
                    value={Number(formHandler.values.branch_id)}
                    error={formHandler.errors.branch_id}
                    required
                />
            </Grid>
            { (formHandler.values.employee_number && formHandler.values.date) &&
                <>
                    <p className="mt-3">Biotime Log Details</p>
                    { loading &&
                        <div className="flex justify-center">
                            <LoadingState/>
                        </div>
                    }
                    { !loading &&
                        <div className="flex justify-end my-[-10px]">
                            <div>
                                <Button
                                    label="Add"
                                    onClick={() => {
                                        formHandler.setFieldValue("punches", [
                                            ...formHandler.values.punches,
                                            { punch_time: "" },
                                        ]);
                                    }}
                                />
                            </div>
                        </div>
                    }
                    <Grid cols={2}>
                        {!loading && formHandler.values.punches.map((punch: any, index: number) => (
                            <Textfield
                                key={index}
                                type="datetime-local"
                                label={`Punch Time #${index + 1}`}
                                value={punch.punch_time}
                                onChange={(e) => {
                                    const updatedPunches:any = [...formHandler.values.punches];
                                    updatedPunches[index] = {
                                        ...updatedPunches[index],
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
                        ))}
                    </Grid>
                </>
            }
            <p className="mt-3">Adjustments</p>
            <Grid cols={2}>
                <Dropdown
                    name="type"
                    placeholder="select type"
                    label="Adjust Type"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.type ?? ""}
                    error={formHandler.errors.type}
                    options={[
                        {
                            label: "Incomplete Logs",
                            value: "Incomplete Logs",
                        },
                        {
                            label: "Incorrect Logs",
                            value: "Incorrect Logs",
                        },
                        {
                            label: "No Logs with Schedule",
                            value: "No Logs with Schedule",
                        },
                        {
                            label: "Incorrect Schedule",
                            value: "Incorrect Schedule",
                        },
                        {
                            label: "Wrong Schedule No Logs",
                            value: "Wrong Schedule No Logs",
                        },
                    ]}
                    required
                />
                <ScheduleMasterlistDropDown
                    name="schedule"
                    placeholder="select schedule"
                    label="Schedule"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.schedule}
                    error={formHandler.errors.schedule}
                    required
                />
            </Grid>

            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end gap-x-2">
                <div> 
                    <Button
                        label="Submit"
                        type="submit"
                        onClick={() => {
                        }}
                    />            
                </div>
                <div> 
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                            formHandler.resetForm();
                            setData([]);
                        }}
                    />            
                </div>
            </div>
            </form>
        </Modal>
    );
};

export default CreateAdjustmentsModal;