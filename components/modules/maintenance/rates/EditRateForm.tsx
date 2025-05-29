import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import TextArea from "@/components/common/TextArea";
import { useEffect } from "react";
import { editRate } from "@/api/rates";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditRateForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            code: "",
            area: "",
            minimum: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            code: Yup.string().required("Rate code is required."),
            area: Yup.string().required("Area is required."),
            minimum: Yup.number().required("Minimum is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit:async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Edit Rate",
                message: "Are you sure you want to save changes?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                editRate(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Rate updated successfully");
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
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit rate"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Rate code"
                    placeholder="enter rate code"
                    name="code"
                    value={editFormHandler.values.code}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.code}
                />
                <Textfield
                    label="Minimum"
                    placeholder="enter minimum"
                    name="minimum"
                    value={editFormHandler.values.minimum}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.minimum}
                />
                <TextArea
                    label="Area"
                    placeholder="enter area"
                    name="area"
                    value={editFormHandler.values.area}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.area}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editFormHandler.values.status}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.status}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={editFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditRateForm;