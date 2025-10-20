"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { createTardinessSanction } from "@/api/maintenance/tardiness-sanction";
import TextArea from "@/components/common/TextArea";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateTardinessSanction = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            count: "",
            rank: "",
            incentives_deduction: "",
            punishment: "",
            status: "active",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            count: Yup.string().required("Count is required."),
            rank: Yup.string().required("Rank is required."),
            incentives_deduction: Yup.string().required("Incentives deduction is required."),
            punishment: Yup.string().required("Punishment SS is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Tardiness Sanctions",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createTardinessSanction(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Tardiness sanction created successfully");
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
            title="Create Tardiness Sanction"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Textfield
                    label="Count"
                    placeholder="enter count"
                    name="count"
                    value={createFormHandler.values.count}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.count}
                />
                <Textfield
                    label="Rank"
                    placeholder="enter rank"
                    name="rank"
                    type="number"
                    value={createFormHandler.values.rank}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.rank}
                />
                <Textfield
                    label="Incentives Deduction"
                    placeholder="enter incentives deduction"
                    name="incentives_deduction"
                    type="number"
                    value={createFormHandler.values.incentives_deduction}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.incentives_deduction}
                />
                <TextArea
                    label="Punishment"
                    placeholder="enter punishment"
                    name="punishment"
                    value={createFormHandler.values.punishment}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.punishment}
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

export default CreateTardinessSanction;