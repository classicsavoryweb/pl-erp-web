import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../../generic/ActiveInactiveDropDown";
import { createCategory } from "@/api/offenses";
import Textfield from "@/components/common/Textfield";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateCategoryForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createCategoryFormHandler = useFormik({
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
            createCategory(values)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("Category created successfully");
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

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create new category"
            onClose={() => {
                modal.onClose();
                createCategoryFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createCategoryFormHandler.handleSubmit}>
                <Textfield
                    label="Name"
                    placeholder="enter name"
                    name="name"
                    value={createCategoryFormHandler.values.name}
                    required
                    onChange={createCategoryFormHandler.handleChange}
                    error={createCategoryFormHandler.errors.name}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createCategoryFormHandler.values.status}
                    required
                    onChange={createCategoryFormHandler.handleChange}
                    error={createCategoryFormHandler.errors.status}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createCategoryFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={createCategoryFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateCategoryForm;