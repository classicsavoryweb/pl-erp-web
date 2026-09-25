"use client";

import {closeReplenishment} from "@/api/uniform/stock-replenishment";
import confirm from "@/components/common/Confirm";
import TextArea from "@/components/common/TextArea";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Textfield from "@/components/common/Textfield";

interface ReplenishmentRequestCloseFormProps{
    modal: any;
    onSubmitCallback: () => void;
    formValue:any;
}

const ReplenishmentRequestCloseForm = ({
    modal,
    onSubmitCallback,
    formValue
}:ReplenishmentRequestCloseFormProps) => {
    const cancelRequestFormHandler = useFormik({
        initialValues: {      
            cancel_reason:"",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            cancel_reason: Yup.string().required("Cancel reason is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Cancel Request",
                message: "Are you sure you want to cancel this request"
            });
            if (isConfirmed) {
                try {
                    setSubmitting(true);
                    const resp = await closeReplenishment(formValue.id,{reason:values.cancel_reason});

                    if(!resp.error) {
                        toast.success("Cancel request successfully!");
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
                };
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Cancel Request"
            onClose={() => {
                modal.onClose();
                cancelRequestFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={cancelRequestFormHandler.handleSubmit}>
                <Textfield 
                    label="Request Number"
                    name="request_no"
                    value={formValue?.request_no ?? ""}
                    disabled                
                />
                <TextArea
                    label="Cancel Reason"
                    placeholder="Enter cancel reason"
                    name="cancel_reason"
                    value={cancelRequestFormHandler.values.cancel_reason ?? ""}
                    onChange={cancelRequestFormHandler.handleChange}
                    error={cancelRequestFormHandler.errors.cancel_reason}
                /> 
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                cancelRequestFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={cancelRequestFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    )
}

export default ReplenishmentRequestCloseForm;