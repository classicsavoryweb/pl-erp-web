import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../../generic/ActiveInactiveDropDown";
import { editSubCategory } from "@/api/offenses";
import Textfield from "@/components/common/Textfield";
import { useEffect } from "react";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditSubCategoryForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editSubCategoryFormHandler = useFormik({
        initialValues: {
            name: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Name is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            editSubCategory(values, formValue.id)
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
    });

    useEffect(() => {
        if (modal.isShowing) {
            editSubCategoryFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit sub category"
            onClose={() => {
                modal.onClose();
                editSubCategoryFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editSubCategoryFormHandler.handleSubmit}>
                <Textfield
                    label="Name"
                    placeholder="enter name"
                    name="name"
                    value={editSubCategoryFormHandler.values.name}
                    required
                    onChange={editSubCategoryFormHandler.handleChange}
                    error={editSubCategoryFormHandler.errors.name}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editSubCategoryFormHandler.values.status}
                    required
                    onChange={editSubCategoryFormHandler.handleChange}
                    error={editSubCategoryFormHandler.errors.status}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editSubCategoryFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={editSubCategoryFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditSubCategoryForm;