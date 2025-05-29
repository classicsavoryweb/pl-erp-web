import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import TextArea from "@/components/common/TextArea";
import CategoryDropDown from "../../generic/CategoryDropDown";
import SubCategoryDropDown from "../../generic/SubCategoryDropDown";
import { createOffense } from "@/api/offenses";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateOffenseForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createOffenseFormHandler = useFormik({
        initialValues: {
            description: "",
            category: "",
            subcategory: "",
            status: "active",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            category: Yup.string().required("Category is required."),
            subcategory: Yup.string().required("Sub category is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Offenses",
                message: "Are you sure you want to create?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createOffense(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Offense created successfully");
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

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create new offense"
            onClose={() => {
                modal.onClose();
                createOffenseFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createOffenseFormHandler.handleSubmit}>
                <TextArea
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    value={createOffenseFormHandler.values.description}
                    required
                    onChange={createOffenseFormHandler.handleChange}
                    error={createOffenseFormHandler.errors.description}
                />
                <CategoryDropDown
                    label="Category"
                    placeholder="select category"
                    name="category"
                    value={createOffenseFormHandler.values.category}
                    required
                    onChange={createOffenseFormHandler.handleChange}
                    error={createOffenseFormHandler.errors.category}
                />
                <SubCategoryDropDown
                    label="Sub category"
                    placeholder="select sub category"
                    name="subcategory"
                    value={createOffenseFormHandler.values.subcategory}
                    required
                    onChange={createOffenseFormHandler.handleChange}
                    error={createOffenseFormHandler.errors.subcategory}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createOffenseFormHandler.values.status}
                    required
                    onChange={createOffenseFormHandler.handleChange}
                    error={createOffenseFormHandler.errors.status}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createOffenseFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={createOffenseFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateOffenseForm;