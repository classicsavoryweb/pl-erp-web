import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import TextArea from "@/components/common/TextArea";
import { createTrainingTitle, editTrainingTitle } from "@/api/training-title";
import { useEffect } from "react";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditTrainingTitleForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            option: "",
            title: "",
            venue: "",
            speaker: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            option: Yup.string().required("Option is required."),
            title: Yup.string().required("Title is required."),
            venue: Yup.string().required("Venue is required."),
            speaker: Yup.string().required("Speaker is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            editTrainingTitle(values, formValue.id)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("Training title created successfully");
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
    });

    useEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit training title"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Dropdown
                    label="Option"
                    placeholder="select option"
                    name="option"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.option}
                    error={editFormHandler.errors.option}
                    required
                    options={[
                        {
                            label: "Internal",
                            value: "Internal"
                        },
                        {
                            label: "External",
                            value: "External"
                        },
                    ]}
                />
                <TextArea
                    label="Title"
                    placeholder="enter title"
                    name="title"
                    value={editFormHandler.values.title}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.title}
                />
                <Textfield
                    label="Speaker"
                    placeholder="enter speaker"
                    name="speaker"
                    value={editFormHandler.values.speaker}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.speaker}
                />
                <Textfield
                    label="Venue"
                    placeholder="enter venue"
                    name="venue"
                    value={editFormHandler.values.venue}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.venue}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editFormHandler.values.status}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.status}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={editFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditTrainingTitleForm;