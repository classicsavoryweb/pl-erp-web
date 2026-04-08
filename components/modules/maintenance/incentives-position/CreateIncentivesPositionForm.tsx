"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { createIncentivesPosition } from "@/api/maintenance/incentives-position";
import PositionDropDown from "../../generic/PositionDropDown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateIncentivesPositionForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            position_id: "",
            amount: 0,
            oic_additional_amount: 0,
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            oic_additional_amount: Yup.string().required("OIC Additional Amount is required."),
            amount: Yup.string().required("Amount is required."),
            position_id: Yup.string().required("Position is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Incentive",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                try {
                    const resp = await createIncentivesPosition(values);
                    if(!resp.error) {
                        toast.success("Incentive created successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                } catch {
                    toast.error("Error encountered");
                } finally {
                    setSubmitting(false);
                }
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Incentive"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <PositionDropDown
                    label="Position"
                    placeholder="select position"
                    name="position_id"
                    onChange={createFormHandler.handleChange}
                    value={createFormHandler.values.position_id}
                    error={createFormHandler.errors.position_id}
                    required
                />
                <Textfield
                    label="Amount"
                    placeholder="enter amount"
                    name="amount"
                    type="number"
                    value={createFormHandler.values.amount}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.amount}
                />
                <Textfield
                    label="OIC Addition Amount"
                    placeholder="enter oic additional amount"
                    name="oic_additional_amount"
                    type="number"
                    value={createFormHandler.values.oic_additional_amount}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.oic_additional_amount}
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

export default CreateIncentivesPositionForm;