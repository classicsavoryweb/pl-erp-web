import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import TextArea from "@/components/common/TextArea";
import { createRate } from "@/api/rates";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateRateForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            code: "",
            area: "",
            minimum: "",
            status: "active",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            code: Yup.string().required("Rate code is required."),
            area: Yup.string().required("Area is required."),
            minimum: Yup.number().required("Minimum is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Rate",
                message: "Are you sure you want to create?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createRate(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Rate created successfully");
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
            title="Create new rate"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Textfield
                    label="Rate code"
                    placeholder="enter rate code"
                    name="code"
                    value={createFormHandler.values.code}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.code}
                />
                <Textfield
                    label="Minimum"
                    placeholder="enter minimum"
                    name="minimum"
                    value={createFormHandler.values.minimum}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.minimum}
                />
                <TextArea
                    label="Area"
                    placeholder="enter area"
                    name="area"
                    value={createFormHandler.values.area}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.area}
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

export default CreateRateForm;