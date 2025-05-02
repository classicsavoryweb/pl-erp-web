import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import TextArea from "@/components/common/TextArea";
import { createTrainingTitle } from "@/api/training-title";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateTrainingTitleForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
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
            createTrainingTitle(values)
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

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create new training title"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Dropdown
                    label="Option"
                    placeholder="select option"
                    name="option"
                    onChange={createFormHandler.handleChange}
                    value={createFormHandler.values.option}
                    error={createFormHandler.errors.option}
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
                    value={createFormHandler.values.title}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.title}
                />
                <Textfield
                    label="Speaker"
                    placeholder="enter speaker"
                    name="speaker"
                    value={createFormHandler.values.speaker}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.speaker}
                />
                <Textfield
                    label="Venue"
                    placeholder="enter venue"
                    name="venue"
                    value={createFormHandler.values.venue}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.venue}
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

export default CreateTrainingTitleForm;