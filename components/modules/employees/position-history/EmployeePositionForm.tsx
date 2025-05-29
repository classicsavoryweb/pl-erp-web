"use client";

import Modal from "@/components/common/Modal"
import PositionDropDown from "../../generic/PositionDropDown"
import Textfield from "@/components/common/Textfield"
import Dropdown from "@/components/common/Dropdown"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeePosition, updateEmployeePosition } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const EmployeePositionForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = action === "add" ? addEmployeePosition : updateEmployeePosition; 

    const formHandler = useFormik({
        initialValues: {
            id: "",
            position_id: "",
            date_started: "",
            oic_assignment: "No",
            date_appointed: "",
            remarks: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            position_id: Yup.string().required("Position is required."),
            date_started: Yup.string().required("Date started is required."),
            oic_assignment: Yup.string(),
            date_appointed: Yup.string().when('oic_assignment', (oic_assignment, schema) =>
                String(oic_assignment) === "Yes"
                    ? schema.required('Date appointed is required')
                    : schema.notRequired())
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
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
            })
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
            title={ action === "add" ? "Add Position" : "Edit Position"}
            size="md"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <PositionDropDown
                label="Position"
                name="position_id"
                placeholder="select position"
                value={Number(formHandler.values.position_id) || ""}
                error={formHandler.errors.position_id}
                onChange={formHandler.handleChange}
                required
            />
            <Textfield
                type="date"
                label="Date Started"
                required
                name="date_started"
                value={formHandler.values.date_started || ""}
                error={formHandler.errors.date_started}
                onChange={formHandler.handleChange} 
            />
            <Dropdown
                label="OIC Assignment"
                required
                name="oic_assignment"
                placeholder="select oic assignment"
                options={[
                    {
                        label: "Yes",
                        value: "Yes"
                    },
                    {
                        label: "No",
                        value: "No"
                    },
                ]}
                value={formHandler.values.oic_assignment || ""}
                error={formHandler.errors.oic_assignment}
                onChange={formHandler.handleChange}
            />
            <Textfield
                type="date"
                label="Date Appointed"
                name="date_appointed"
                disabled={formHandler.values.oic_assignment === "No"}
                value={formHandler.values.date_appointed || ""}
                error={formHandler.errors.date_appointed}
                onChange={formHandler.handleChange}
            />
            <TextArea
                label="Remarks"
                name="remarks"
                placeholder="enter remarks"
                value={formHandler.values.remarks || ""}
                error={formHandler.errors.remarks}
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

export default EmployeePositionForm;