import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import TextArea from "@/components/common/TextArea";
import CategoryDropDown from "../../generic/CategoryDropDown";
import SubCategoryDropDown from "../../generic/SubCategoryDropDown";
import { editOffense } from "@/api/offenses";
import { useEffect } from "react";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any,
};

const EditOffenseForm = ({
    modal,
    onSubmitCallback,
    formValue,
}: FormModalInterface) => {

    const editOffenseFormHandler = useFormik({
        initialValues: {
            description: "",
            category: "",
            subcategory: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            category: Yup.string().required("Category is required."),
            subcategory: Yup.string().required("Sub category is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            editOffense(values, formValue.id)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("Offense updated successfully");
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
            editOffenseFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit offense"
            onClose={() => {
                modal.onClose();
                editOffenseFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editOffenseFormHandler.handleSubmit}>
                <TextArea
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    value={editOffenseFormHandler.values.description}
                    required
                    onChange={editOffenseFormHandler.handleChange}
                    error={editOffenseFormHandler.errors.description}
                />
                <CategoryDropDown
                    label="Category"
                    placeholder="select category"
                    name="category"
                    value={editOffenseFormHandler.values.category}
                    required
                    onChange={editOffenseFormHandler.handleChange}
                    error={editOffenseFormHandler.errors.category}
                />
                <SubCategoryDropDown
                    label="Sub category"
                    placeholder="select sub category"
                    name="subcategory"
                    value={editOffenseFormHandler.values.subcategory}
                    required
                    onChange={editOffenseFormHandler.handleChange}
                    error={editOffenseFormHandler.errors.subcategory}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editOffenseFormHandler.values.status}
                    required
                    onChange={editOffenseFormHandler.handleChange}
                    error={editOffenseFormHandler.errors.status}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editOffenseFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={editOffenseFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditOffenseForm;