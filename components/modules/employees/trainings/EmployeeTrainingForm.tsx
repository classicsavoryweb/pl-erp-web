"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import Dropdown from "@/components/common/Dropdown"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeTrainingTitle } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import TrainingTitleDropDown from "../../generic/TrainingTitleDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const EmployeeTrainingForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = addEmployeeTrainingTitle;
    const [option, setOption] = useState<"Internal" | "External" | "">("");

    const formHandler = useFormik({
        initialValues: {
            id: "",
            training_title_id: "",
            date: "",
            score: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            training_title_id: Yup.string().required("Training Title is required."),
            date: Yup.string().required("Date is required."),
        }),
        onSubmit:async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Trainings",
                message: "Are you sure you want to save?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                api(String(employeeNumber), values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        resetForm();
                        onSubmitCallback();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered")
                }).finally(() => {
                    setSubmitting(false);
                });
            }
        }
    });

    useEffect(() => {
        if (action === "edit" && modal.isShowing) {
            formHandler.setValues(data);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title={ action === "add" ? "Add Training Title" : "Edit Training Title"}
            size="md"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <Dropdown
                label="Option"
                required
                name="option"
                placeholder="select option"
                value={option}
                options={[
                    {
                        label: "Internal",
                        value: "Internal"
                    },
                    {
                        label: "External",
                        value: "External"
                    },
                ]}
                onChange={(e:any) => {
                    setOption(e.target.value);
                }}
            />
            <TrainingTitleDropDown
                label="Training Title"
                required
                name="training_title_id"
                placeholder="select training title"
                value={formHandler.values.training_title_id || ""}
                error={formHandler.errors.training_title_id}
                onChange={formHandler.handleChange}
                option={option}
            />
            <Textfield
                type="date"
                label="Date"
                name="date"
                value={formHandler.values.date || ""}
                error={formHandler.errors.date}
                onChange={formHandler.handleChange}
            />
            <Textfield
                label="Score"
                name="score"
                placeholder="enter score"
                value={formHandler.values.score || ""}
                onChange={formHandler.handleChange}
            />
            <Button
                loading={formHandler.isSubmitting}
                onClick={() => {}}
                label="Submit"
                type="submit"
            />
        </form>
        </Modal>
    );
};

export default EmployeeTrainingForm;