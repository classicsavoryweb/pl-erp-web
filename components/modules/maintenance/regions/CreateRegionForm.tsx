"use client";

import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { createRegion } from "@/api/regions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const CreateRegionForm = ({
    modal,
    onSubmitCallback,
}: FormModalInterface) => {
    const formHandler = useFormik({
        initialValues: {
            name: "",
            description: "",
            status: "active",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Name is required."),
            description: Yup.string().required("Description is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Create Region",
                message: "Are you sure you want to create?",
            });

            if (isConfirmed) {
                setSubmitting(true);
                createRegion(values)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Region created successfully");
                            onSubmitCallback();
                            modal.onClose();
                            resetForm();
                        } else {
                            toast.error(resp.data.message);
                        }
                    })
                    .catch(() => {
                        toast.error("Error encountered");
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
            }
        },
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create new region"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Textfield
                    label="Name"
                    placeholder="enter region"
                    name="name"
                    type="text"
                    value={formHandler.values.name}
                    required
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.name}
                />
                <Textfield
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    type="text"
                    value={formHandler.values.description}
                    required
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.description}
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
                    <div className="flex w-1/2 items-center justify-end gap-x-2">
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

export default CreateRegionForm;
