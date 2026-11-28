"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeOffense, updateEmployeeOffense } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Dropdown from "@/components/common/Dropdown";
import Grid from "@/components/common/Grid";
import OffenseDropDown from "../../generic/OffenseDropDown";
import OffenseActionDropDown from "../../generic/OffenseActionDropDown";
import SanctionDropDown from "../../generic/SanctionDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const EmployeeOffenseForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
    
    const api = action === "add" ? addEmployeeOffense : updateEmployeeOffense; 

    const formHandler = useFormik({
        initialValues: {
            id: "",
            tardiness_id: "",
            offense_id : "",
            sanction_id : "",
            transgression : "",
            repetition : "",
            summary : "",
            date_committed : "",
            offense_action : "",
            date_served_ao : "",
            suspension_dates : "",
            date_served_da : "",
            remarks : "",
            attachments : [],
            removed_attachment_ids: [],
            voided: "No",
            void_reason: "",
            remarks_one: "",
            sanction_id_two: "",
            sanction_id_three: "",
            date_memo_three: "",
            remarks_two: "",
            remarks_three: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            offense_id : Yup.string().required("Offense is required."),
            sanction_id : Yup.string().required("Sanction is required."),
            transgression : Yup.string().required("Transgression is required."),
            repetition : Yup.string().required("Repetition is required."),
            summary : Yup.string().required("Summary is required."),
            date_committed : Yup.string().required("Date committed is required."),
            offense_action : Yup.string().required("Offense action is required."),
            date_served_ao : Yup.string().required("Date served of AO is required."),
            suspension_dates : Yup.string().required("Suspension dates is required."),
            date_served_da : Yup.string().required("Date served of DA is required."),
            voided: Yup.string(),
            void_reason: Yup.string().when('voided', (voided, schema) =>
                String(voided) === "Yes"
                    ? schema.required('Void reason is required')
                    : schema.notRequired()
            )
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Offense",
                message: "Are you sure you want to save?"
            });

            if (isConfirmed) {
                setSubmitting(true);

                const formData = new FormData();

                Object.entries(values).forEach(([key, value]) => {
                    if (key === "attachments") {
                        (value as any[]).forEach((file) => {
                            if (file instanceof File) {
                                formData.append("attachments[]", file);
                            }
                        });
                    } 
                    else if (key === "removed_attachment_ids") {
                        (value as number[]).forEach((id) => {
                            formData.append("removed_attachment_ids[]", String(id));
                        });
                    } 
                    else {
                        formData.append(key, value == null ? "" : String(value));
                    }
                });

                api(String(employeeNumber), formData)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success(resp.data.message);
                            resetForm();
                            onSubmitCallback();
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
        }
    });

    useEffect(() => {
        if (action === "edit" && modal.isShowing) {
            formHandler.setValues({
                
                ...formHandler.initialValues,
                ...data,
                attachments: data?.attachments || [],
                removed_attachment_ids: [],
            });
        }
    }, [modal.isShowing, action, data]);

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title={ action === "add" ? "Add Offense" : "Edit Offense"}
            size="xl"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <Grid cols={2}>
                <OffenseDropDown
                    label="Offense"
                    required
                    name="offense_id"
                    value={Number(formHandler.values.offense_id) || ""}
                    error={formHandler.errors.offense_id}
                    onChange={formHandler.handleChange}
                    placeholder="select offense"
                />
                <Dropdown
                    label="Transgression"
                    required
                    name="transgression"
                    value={formHandler.values.transgression || ""}
                    error={formHandler.errors.transgression}
                    onChange={formHandler.handleChange}
                    placeholder="select transgression"
                    options={[
                        {label: "Magaan na Paglabag", value: "Magaan na Paglabag"},
                        {label: "Hindi Gaanong Seryosong Paglabag", value: "Hindi Gaanong Seryosong Paglabag"},
                        {label: "Seryosong Paglabag", value: "Seryosong Paglabag"},
                        {label: "Grabeng Paglabag", value: "Grabeng Paglabag"},
                    ]}
                />
                <Dropdown
                    label="Repetition"
                    required
                    name="repetition"
                    placeholder="select repetition"
                    value={formHandler.values.repetition || ""}
                    error={formHandler.errors.repetition}
                    onChange={formHandler.handleChange}
                    options={[
                        {label: "1st", value: "1st"},
                        {label: "2nd", value: "2nd"},
                        {label: "3rd", value: "3rd"},
                        {label: "4th", value: "4th"},
                        {label: "5th", value: "5th"},
                        {label: "6th", value: "6th"},
                        {label: "7th", value: "7th"},
                        {label: "8th", value: "8th"},
                    ]}
                />
            </Grid>
            <TextArea
                label="Summary"
                name="summary"
                placeholder="enter summary"
                value={formHandler.values.summary || ""}
                error={formHandler.errors.summary}
                onChange={formHandler.handleChange}
                required
            />
            <Grid
                cols={2}
            >
                <OffenseActionDropDown
                    label="Offense Action"
                    required
                    name="offense_action"
                    value={formHandler.values.offense_action || ""}
                    error={formHandler.errors.offense_action}
                    onChange={formHandler.handleChange}
                    placeholder="select offense action"
                />
                <Textfield
                    type="date"
                    label="Date Committed"
                    required
                    name="date_committed"
                    value={formHandler.values.date_committed || ""}
                    error={formHandler.errors.date_committed}
                    onChange={formHandler.handleChange}
                />
            </Grid>
            <Grid cols={3}>
                <Textfield
                    type="date"
                    label="Date of serve Memo 1"
                    required
                    name="date_served_ao"
                    value={formHandler.values.date_served_ao || ""}
                    error={formHandler.errors.date_served_ao}
                    onChange={formHandler.handleChange}
                />
                <SanctionDropDown
                    label="Sanction"
                    required
                    name="sanction_id"
                    value={ Number(formHandler.values.sanction_id) || ""}
                    error={formHandler.errors.sanction_id}
                    onChange={formHandler.handleChange}
                    placeholder="select sanction"
                />
                <Textfield
                    label="Remarks"
                    required
                    name="remarks_one"
                    value={formHandler.values.remarks_one || ""}
                    error={formHandler.errors.remarks_one}
                    onChange={formHandler.handleChange}
                />
                <Textfield
                    type="date"
                    label="Date of serve Memo 2"
                    required
                    name="date_served_da"
                    value={formHandler.values.date_served_da || ""}
                    error={formHandler.errors.date_served_da}
                    onChange={formHandler.handleChange}
                />
                <SanctionDropDown
                    label="Sanction"
                    required
                    name="sanction_id_two"
                    value={ Number(formHandler.values.sanction_id_two) || ""}
                    error={formHandler.errors.sanction_id_two}
                    onChange={formHandler.handleChange}
                    placeholder="select sanction"
                />
                <Textfield
                    label="Remarks"
                    required
                    name="remarks_two"
                    value={formHandler.values.remarks_two || ""}
                    error={formHandler.errors.remarks_two}
                    onChange={formHandler.handleChange}
                />
                <Textfield
                    type="date"
                    label="Date of serve Memo 3"
                    required
                    name="date_memo_three"
                    value={formHandler.values.date_memo_three || ""}
                    error={formHandler.errors.date_memo_three}
                    onChange={formHandler.handleChange}
                />
                <SanctionDropDown
                    label="Sanction"
                    required
                    name="sanction_id_three"
                    value={ Number(formHandler.values.sanction_id_three) || ""}
                    error={formHandler.errors.sanction_id_three}
                    onChange={formHandler.handleChange}
                    placeholder="select sanction"
                />
                <Textfield
                    label="Remarks"
                    required
                    name="remarks_three"
                    value={formHandler.values.remarks_three || ""}
                    error={formHandler.errors.remarks_three}
                    onChange={formHandler.handleChange}
                />
            </Grid>
            <TextArea
                label="Suspension Dates"
                name="suspension_dates"
                placeholder="enter suspension dates"
                value={formHandler.values.suspension_dates || ""}
                error={formHandler.errors.suspension_dates}
                onChange={formHandler.handleChange}
                required
            />  
            <TextArea
                label="Remarks"
                name="remarks"
                placeholder="enter remarks"
                value={formHandler.values.remarks || ""}
                error={formHandler.errors.remarks}
                onChange={formHandler.handleChange}
                required
            />

            { action === "edit" && !formHandler.values.tardiness_id &&
                <>
                    <Dropdown
                        label="Void"
                        required
                        name="voided"
                        placeholder="select option"
                        value={formHandler.values.voided}
                        options={[
                            {
                                label: "Yes",
                                value: "Yes"
                            },
                            {
                                label: "No",
                                value: "No"
                            },
                        ]}
                        onChange={(e) => {
                            formHandler.handleChange(e);
                            if (e.target.value === "No") {
                                formHandler.setFieldValue("voided_reason", "");
                            }
                        }}
                    />

                    {  formHandler.values.voided === "Yes" &&
                        <TextArea
                            label="Void Reason"
                            required
                            name="void_reason"
                            placeholder="enter reason for voiding"
                            onChange={formHandler.handleChange}
                            value={formHandler.values.void_reason || ""}
                            error={formHandler.errors.void_reason}
                        />
                    }
                </>
            }

           <Textfield
                type="file"
                label="Attachments"
                name="attachments"
                onChange={(event) => {
                    const files = Array.from(event.target.files || []);

                    if (files.length > 0) {
                        formHandler.setFieldValue("attachments", [
                            ...(formHandler.values.attachments || []),
                            ...files
                        ]);
                    }

                    event.target.value = "";
                }}
            />

           {formHandler.values.attachments?.map((file: any, index: number) => (
                <div key={file.id || index} className="flex items-center gap-2 mb-2">

                    {file instanceof File ? (
                        <span className="text-blue-700">
                            {file.name}
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setSelectedAttachment(file)}
                            className="text-blue-700 underline"
                        >
                            {file.attachment_file_name}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            if (!(file instanceof File)) {
                                formHandler.setFieldValue("removed_attachment_ids", [
                                    ...formHandler.values.removed_attachment_ids,
                                    file.id
                                ]);
                            }

                            formHandler.setFieldValue(
                                "attachments",
                                formHandler.values.attachments.filter(
                                    (_: any, i: number) => i !== index
                                )
                            );
                        }}
                        className="text-red-600 hover:text-red-800"
                    >
                        Remove
                    </button>

                </div>
            ))}
            <Button
                loading={formHandler.isSubmitting}
                onClick={() => {}}
                label="Submit"
                type="submit"
            />
        </form>
        {selectedAttachment && (
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
                onClick={() => setSelectedAttachment(null)}
            >
                <div
                    className="flex w-full max-w-5xl flex-col rounded-lg dark:bg-neutral-700 p-5 shadow-xl"
                    style={{ height: "90vh" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4 flex shrink-0 items-center justify-between dark:bg-neutral-700">
                        <h2 className="font-semibold">
                            {selectedAttachment.attachment_file_name}
                        </h2>

                        <button
                            type="button"
                            onClick={() => setSelectedAttachment(null)}
                            className="text-2xl text-gray-500 hover:text-black"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="min-h-0 flex-1 overflow-auto">
                    {selectedAttachment.attached_file?.startsWith("data:application/pdf") ? (
                    <iframe
                        src={selectedAttachment.attached_file}
                        title="PDF Preview"
                        className="w-full border-0"
                        style={{ height: "75vh" }}
                    />
                ) : selectedAttachment.attached_file?.startsWith("data:image/") ? (
                    <img
                        src={selectedAttachment.attached_file}
                        alt={selectedAttachment.attachment_file_name}
                        className="mx-auto max-w-full object-contain"
                    />
                ) : (
                    <p>Preview unavailable.</p>
                )}
                    </div>
                </div>
            </div>
        )}
        </Modal>
    );
};

export default EmployeeOffenseForm;