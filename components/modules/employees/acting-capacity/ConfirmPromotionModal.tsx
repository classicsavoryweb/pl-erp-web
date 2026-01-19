"use client";

import Modal from "@/components/common/Modal"
import { toast } from "react-toastify";
import { confirmPromotion, getACF, rejectPromotion } from "@/api/acting-capacity";
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
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import moment from "moment";

interface FormModalInterface {
    modal: any;
    id: string;
    onSubmitCallBack: () => void;
};

const ConfirmPromotionModal = ({
    modal,
    id,
    onSubmitCallBack
}: FormModalInterface) => {

    const api = useApiCall();

    const formHandler = useFormik({
        initialValues: {
            effectivity_date: "",
            attachments: [
                {
                    "file": "",
                    "file_type": ""
                }
            ],
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            effectivity_date: Yup.string()
                .required("Effectivity date is required")
                .test(
                    "min-start-date",
                    `Effectivity date must be same or after ${api.data?.acting_capacity?.start_date}`,
                    function (value) {
                        const startDate = api.data?.acting_capacity?.start_date;
                        if (!value || !startDate) return true;

                        return moment(value).isSameOrAfter(moment(startDate), "day");
                    }
                ),
            attachments: Yup.array().of(
                Yup.object().shape({
                    file_type: Yup.string().required("File type is required"),
                    file: Yup.mixed().required("File is required")
                })
            )
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Confirm Promotion",
                message: "Are you sure?"
            });

            if (isConfirmed) {
                confirmPromotion(id, values).then((resp) =>  {
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

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getACF(id).then((resp) => {
                if (!resp.error) {
                    api.setData(resp.data);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing, id]);

    return (
        <Modal
            loading={api.loading}
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
            }}
            title="Confirm Promotion"
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Textfield
                    type="date"
                    label="Effectivity Date"
                    name="effectivity_date"
                    value={formHandler.values.effectivity_date}
                    error={formHandler.errors.effectivity_date}
                    onChange={formHandler.handleChange}
                    required
                />

                <div className="flex justify-between items-start">
                    <p className=" font-semibold text-gray-500">
                        Attachments
                    </p>
                    <div>

                        <Button
                            label="Add"
                            onClick={() =>
                                formHandler.setFieldValue("attachments", [
                                        ...formHandler.values.attachments,
                                        {   file: "",
                                            file_type: "" 
                                        },
                                    ]
                                )
                            }
                        />
                    </div>
                </div>

                { formHandler.values.attachments.map((ex, id) => {
                    const errorItem =
                    typeof formHandler.errors.attachments?.[id] === "object"
                    ? formHandler.errors.attachments[id]
                    : undefined;

                    const touchedItem = formHandler.touched.attachments?.[id];

                    return (
                        <Grid cols={2} key={id}>
                            { id > 0 &&
                                <div className="flex pt-2 mb-[-5px] justify-end col-span-2">
                                    <p
                                        className="hover:text-gray-800  hover:cursor-pointer"
                                        onClick={() => {
                                            const updatedAttachments = [...formHandler.values.attachments];
                                            updatedAttachments.splice(id, 1);
                                            formHandler.setFieldValue("attachments", updatedAttachments);
                                        }}
                                    >
                                        Remove
                                    </p>
                                </div>
                            }
                            <Textfield
                                label="File Type"
                                name={`attachments[${id}].file_type`}
                                placeholder="enter file type"
                                value={formHandler.values.attachments[id]?.file_type || ""}
                                error={
                                    touchedItem?.file_type && typeof errorItem?.file_type === "string"
                                    ? errorItem.file_type
                                    : ""
                                }
                                onChange={formHandler.handleChange}
                                required
                            />
                            <Textfield
                                type="file"
                                label="Attachment"
                                name={`attachments[${id}].file`}
                                required
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        formHandler.setFieldValue(`attachments[${id}].file`, file);
                                    }
                                }}
                                error={
                                    touchedItem?.file && typeof errorItem?.file === "string"
                                    ? errorItem.file
                                    : ""
                                }
                            />
                        </Grid>
                    );
                })}

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

export default ConfirmPromotionModal;
