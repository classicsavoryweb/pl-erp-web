"use client";

import Modal from "@/components/common/Modal"
import { toast } from "react-toastify";
import { getACF, rejectPromotion } from "@/api/acting-capacity";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import EnglishACFPDF from "../../pdf/acting-capacity/EnglishACFPDF";
import TagalogACFPDF from "../../pdf/acting-capacity/TagalogACFPDF";
import { useState } from "react";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import TextArea from "@/components/common/TextArea";

interface FormModalInterface {
    modal: any;
    id: string;
    onSubmitCallBack: () => void;
};

const RejectPromotionModal = ({
    modal,
    id,
    onSubmitCallBack
}: FormModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            rejected_reason: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            rejected_reason: Yup.string().required("Reason is required")
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Reject Promotion",
                message: "Are you sure?"
            });

            if (isConfirmed) {
                rejectPromotion(id, values).then((resp) =>  {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        resetForm();
                        onSubmitCallBack();
                    } else {
                        toast.error(resp.data.messaage);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    setSubmitting(false);
                });
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
            }}
            title="Reject Promotion"
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                
                <TextArea
                    name="rejected_reason"
                    value={formHandler.values.rejected_reason}
                    error={formHandler.errors.rejected_reason}
                    onChange={formHandler.handleChange}
                    label="Reason"
                    required
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />
                    </div>     
                    <div>
                        <Button
                            type="submit"
                            label="Submit"
                            onClick={() => {}}
                        />         
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default RejectPromotionModal;