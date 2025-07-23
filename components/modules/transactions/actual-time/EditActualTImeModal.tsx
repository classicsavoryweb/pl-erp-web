"use client";

import { editBiotimePunches } from "@/api/transactions/actual-time";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface FormModalInterface {
    modal: any;
    data: any[];
    selectedLog: string;
    onSubmitCallBack: () => void;
};

type PunchFormValues = {
    punches: { punch_time: string }[];
};

const EditActualTimeModal = ({
    modal,
    data = [],
    selectedLog,
    onSubmitCallBack
}: FormModalInterface) => {

    const formHandler = useFormik<PunchFormValues>({
        initialValues: {
            punches: [{punch_time: ""}],
        },
        validationSchema: Yup.object().shape({
            punches: Yup.array()
            .of(Yup.object().shape({
                punch_time: Yup.string().required("Punch time is required"),
            }))
            .min(1, "At least one punch is required"),
        }),
        onSubmit: async (values) => {
            const isConfirmed = await confirm({
                title: "Edit Biotime Punches",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                editBiotimePunches(values, selectedLog)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        modal.onClose();
                        onSubmitCallBack();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                })
            }
        }
    });

    useEffect(() => {
        formHandler.setFieldValue("punches", data);
    }, [data, selectedLog]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Biotime Logs"
            onClose={() => {
                modal.onClose();
            }}
            loading={modal.loading}
            size="md"
        >
            <div className="flex justify-end">
                <div>
                    <Button
                        label="Add"
                        onClick={() => {
                            formHandler.setFieldValue("punches", [
                                ...formHandler.values.punches,
                                { punch_time: "" },
                            ]);
                        }}
                    />
                </div>
            </div>

            <form onSubmit={formHandler.handleSubmit}>
                {formHandler.values.punches.map((punch: any, index) => (
                    <Textfield
                        key={index}
                        type="datetime-local"
                        label={`Punch Time #${index + 1}`}
                        value={punch.punch_time}
                        onChange={(e) => {
                            const updatedPunches:any = [...formHandler.values.punches];
                            updatedPunches[index] = {
                                punch_time: e.target.value.replace("T", " ") + ":00"
                            };
                            formHandler.setFieldValue('punches', updatedPunches);
                        }}
                        error={
                            formHandler.touched.punches?.[index]?.punch_time &&
                            typeof (formHandler.errors.punches as { punch_time?: string }[] | undefined)?.[index]?.punch_time === "string"
                                ? (formHandler.errors.punches as { punch_time?: string }[])[index].punch_time
                                : ""
                        }
                    />
                ))}

            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end gap-x-2">
                <div> 
                    <Button
                        label="Submit"
                        type="submit"
                        onClick={() => {
                        }}
                    />            
                </div>
                <div> 
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                        }}
                    />            
                </div>
            </div>
            </form>
        </Modal>
    );
};

export default EditActualTimeModal;