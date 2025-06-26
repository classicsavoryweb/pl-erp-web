"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeBranch, deleteEmployeeBranches, updateEmployeeBranch } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import BranchDropDown from "../../generic/BranchDropDown";
import confirm from "@/components/common/Confirm";
import moment from "moment";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    id: any;
};

const DeleteBranchForm = ({
    modal,
    onSubmitCallback,
    id
}: FormModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            reason : "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            reason: Yup.string().required("Reason is required")
        }),
        onSubmit:async (values, {setSubmitting, resetForm}) => {
            const isConfirm = await confirm({
                title: "Delete Branch",
                message: "Are you sure you want to delete?"
            });

            setSubmitting(true);
            if (isConfirm) {
                deleteEmployeeBranches(id, values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Branch successfully deleted");
                        resetForm();
                        onSubmitCallback();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch((() => {
                    toast.error("Error encountered");
                })).finally(() => {
                    setSubmitting(false);
                })
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title="Delete Branch"
            size="md"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <TextArea
                label="Reason for Deletion"
                name="reason"
                placeholder="enter reason"
                value={formHandler.values.reason || ""}
                error={formHandler.errors.reason}
                onChange={formHandler.handleChange}
                required
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

export default DeleteBranchForm;