import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../../generic/ActiveInactiveDropDown";
import { editCategory } from "@/api/offenses";
import Textfield from "@/components/common/Textfield";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditCategoryForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editCategoryFormHandler = useFormik({
        initialValues: {
            name: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Name is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Edit Category",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editCategory(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Sub category updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally((() => {
                    setSubmitting(false);
                }));
            }
        }
    });

    useEffect(() => {
        if (modal.isShowing) {
            editCategoryFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit category"
            onClose={() => {
                modal.onClose();
                editCategoryFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editCategoryFormHandler.handleSubmit}>
                <Textfield
                    label="Name"
                    placeholder="enter name"
                    name="name"
                    value={editCategoryFormHandler.values.name}
                    required
                    onChange={editCategoryFormHandler.handleChange}
                    error={editCategoryFormHandler.errors.name}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editCategoryFormHandler.values.status}
                    required
                    onChange={editCategoryFormHandler.handleChange}
                    error={editCategoryFormHandler.errors.status}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editCategoryFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={editCategoryFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditCategoryForm;