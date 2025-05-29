"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import Dropdown from "@/components/common/Dropdown"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeTrainingTitle, addEmployeeVaccination, editEmployeeVaccination } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import TrainingTitleDropDown from "../../generic/TrainingTitleDropDown";
import DoseDropDown from "../../generic/DoseDropDown";
import VaccineBrandDropDown from "../../generic/VaccineBrandDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const EmployeeVaccinationForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = action === "add" ? addEmployeeVaccination : editEmployeeVaccination;

    const formHandler = useFormik({
        initialValues: {
            id: "",
            vaccine_id: "",
            date: "",
            status: "",
            dose: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            date: Yup.string().required("Date is required."),
            status: Yup.string().required("Status is required."),
            dose: Yup.string().required("Dose is required."),
            vaccine_id: Yup.string().required("Vaccine is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Vaccination",
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
            title={ action === "add" ? "Add Vaccination" : "Edit Vaccination"}
            size="md"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <VaccineBrandDropDown
                label="Vaccine"
                required
                name="vaccine_id"
                placeholder="select vaccine"
                value={Number(formHandler.values.vaccine_id)}
                error={formHandler.errors.vaccine_id}
                onChange={formHandler.handleChange}
            />
            <DoseDropDown
                label="Dose"
                required
                name="dose"
                placeholder="select dose"
                value={String(formHandler.values.dose)}
                error={formHandler.errors.dose}
                onChange={formHandler.handleChange}
            />
            <Textfield
                type="date"
                label="Date"
                name="date"
                value={formHandler.values.date || ""}
                error={formHandler.errors.date}
                onChange={formHandler.handleChange}
            />
            <Dropdown
                label="Status"
                required
                name="status"
                placeholder="select status"
                value={formHandler.values.status}
                error={formHandler.errors.status}
                options={[
                    {
                        label: "Pending",
                        value: "Pending"
                    },
                    {
                        label: "Done",
                        value: "Done"
                    },
                ]}
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

export default EmployeeVaccinationForm;