"use client";

import Modal from "@/components/common/Modal"
import { toast } from "react-toastify";
import { addRequirementAttachment } from "@/api/employee";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { useParams } from "next/navigation";

interface FormModalInterface {
    modal: any;
    onSubmitCallBack: () => void;
};

const AddRequirementAttachmentModal = ({
    modal,
    onSubmitCallBack
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const formHandler = useFormik({
        initialValues: {
            attachments: [
                {
                    "file": "",
                    "file_name": ""
                }
            ],
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            attachments: Yup.array().of(
                Yup.object().shape({
                    file_name: Yup.string().required("File name is required"),
                    file: Yup.mixed().required("File is required")
                })
            )
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Upload Attachments",
                message: "Are you sure?"
            });

            if (isConfirmed) {
                addRequirementAttachment(String(employeeNumber), values).then((resp) =>  {
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
            title="Upload Requirements Files"
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                
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
                                            file_name: "" 
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
                                label="File Name"
                                name={`attachments[${id}].file_name`}
                                placeholder="enter file name"
                                value={formHandler.values.attachments[id]?.file_name || ""}
                                error={
                                    touchedItem?.file_name && typeof errorItem?.file_name === "string"
                                    ? errorItem.file_name
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

export default AddRequirementAttachmentModal;