"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeBranch, updateEmployeeBranch } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import BranchDropDown from "../../generic/BranchDropDown";
import confirm from "@/components/common/Confirm";
import moment from "moment";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const EmployeeBranchForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = action === "add" ? addEmployeeBranch : updateEmployeeBranch; 

    const formHandler = useFormik({
        initialValues: {
            id: "",
            branch_id: "",
            date_assigned: "",
            remarks: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            branch_id: Yup.string().required("Branch is required."),
            date_assigned: Yup.date()
            .required("Date assigned is required.")
            .when([], {
                is: () => String(action) === 'add',
                then: schema => schema.min(moment().startOf('day').toDate(), 'Date must be today or later.'),
                otherwise: schema => schema,
            }),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Branch",
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
            title={ action === "add" ? "Add Branch" : "Edit Branch"}
            size="md"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <BranchDropDown
                label="Branch"
                name="branch_id"
                placeholder="select branch"
                value={Number(formHandler.values.branch_id) || ""}
                error={formHandler.errors.branch_id}
                onChange={formHandler.handleChange}
                required
            />
            <Textfield
                type="date"
                label="Date Assigned"
                required
                name="date_assigned"
                value={formHandler.values.date_assigned || ""}
                error={formHandler.errors.date_assigned}
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

export default EmployeeBranchForm;