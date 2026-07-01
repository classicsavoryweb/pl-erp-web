import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import ActiveInactiveDropDown from "../../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";
import {
    createUniformFreeUniformLimit,
    editUniformFreeUniformLimit,
} from "@/api/maintenance/uniform-free-uniform-limit";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue?: any;
}

const UniformFreeUniformLimitForm = ({
    modal,
    onSubmitCallback,
    formValue,
}: FormModalInterface) => {
    const isEdit = Boolean(formValue?.id);

    const formHandler = useFormik({
        initialValues: {
            description: "",
            allowed_count: 1,
            status: "active",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            allowed_count: Yup.number()
                .typeError("Allowed count must be a number.")
                .required("Allowed count is required.")
                .min(1, "Allowed count must be at least 1."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: isEdit ? "Edit Free Uniform Limit" : "Create Free Uniform Limit",
                message: isEdit
                    ? "Are you sure you want to update this free uniform limit?"
                    : "Are you sure you want to create this free uniform limit?",
            });

            if (!isConfirmed) {
                return;
            }

            try {
                setSubmitting(true);
                const resp = isEdit
                    ? await editUniformFreeUniformLimit(values, formValue.id)
                    : await createUniformFreeUniformLimit(values);

                if (!resp.error) {
                    toast.success(
                        isEdit
                            ? "Free uniform limit updated successfully"
                            : "Free uniform limit created successfully"
                    );
                    onSubmitCallback();
                    modal.onClose();
                    resetForm();
                } else {
                    toast.error(resp.data.message);
                }
            } catch (err) {
                toast.error("Error encountered");
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (modal.isShowing && isEdit) {
            formHandler.setValues({
                description: formValue.description ?? "",
                allowed_count: formValue.allowed_count ?? 1,
                status: formValue.status ?? "active",
            });
        }
    }, [modal.isShowing, formValue]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title={isEdit ? "Edit Free Uniform Limit" : "Create Free Uniform Limit"}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <TextArea
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    value={formHandler.values.description}
                    required
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.description}
                />
                <Textfield
                    type="number"
                    label="Allowed Count"
                    placeholder="enter allowed count"
                    name="allowed_count"
                    value={formHandler.values.allowed_count}
                    required
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.allowed_count}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={formHandler.values.status}
                    required
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.status}
                />
                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default UniformFreeUniformLimitForm;
