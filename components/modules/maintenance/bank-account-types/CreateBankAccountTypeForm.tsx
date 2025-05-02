import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import { createBankAccountType } from "@/api/bank-account-types";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateBankAccountTypeForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            description: "",
            number_length: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            number_length: Yup.string().required("Number length is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            createBankAccountType(values)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("Bank account type created successfully");
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
            title="Create new bank account type"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Textfield
                    label="Description"
                    placeholder="enter rate description"
                    name="description"
                    value={createFormHandler.values.description}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.description}
                />
                <Textfield
                    label="Number Length"
                    placeholder="enter number_length"
                    name="number_length"
                    value={createFormHandler.values.number_length}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.number_length}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createFormHandler.values.status}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.status}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateBankAccountTypeForm;