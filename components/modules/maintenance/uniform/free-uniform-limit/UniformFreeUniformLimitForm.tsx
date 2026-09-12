import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import ActiveInactiveDropDown from "../../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";
import {
    createUniformFreeUniformLimit,
    editUniformFreeUniformLimit,
} from "@/api/maintenance/uniform-free-uniform-limit";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import moment from "moment";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue?: any;
}

const UniformFreeUniformLimitForm = ({
    modal,
    onSubmitCallback,
    formValue,
}: FormModalInterface) => {
    const isEdit = Boolean(formValue?.id);
    const today = new Date().toISOString().split("T")[0];

    const formHandler = useFormik({
        initialValues: {
            description: "",
            allowed_count: 1,
            status: "active",
            date_from: moment().format("YYYY-MM-DD"),
            // date_to: moment().format("YYYY-MM-DD"),
            created_by: "",
            updated_by:"",
            created_at:"",
            updated_at:"",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            allowed_count: Yup.number()
                .typeError("Allowed count must be a number.")
                .required("Allowed count is required.")
                .min(1, "Allowed count must be at least 1."),
            status: Yup.string().required("Status is required."),
            date_from:Yup.date().required("Date Effectivity is required."),
            // date_to:Yup.date().required("Date To is required.")
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {

            // if( formHandler.values.date_from > formHandler.values.date_to){
            //     toast.error("Date from can`t be later than Date to");
            //     return;
            // }

           if (moment(formHandler.values.date_from).isBefore(moment(), "day")) {
                toast.error("Date Effectivity must be today or a future date.");
                return;
            }
            
            const isConfirmed = await confirm({
                title: isEdit ? "Edit Free Uniform Limit" : "Create Free Uniform Limit",
                message: isEdit
                    ? "Are you sure you want to update this free uniform limit?"
                    : "Are you sure you want to create this free uniform limit?",
            });

            if (!isConfirmed) {
                return;
            }

            try {
                setSubmitting(true);
                const resp = isEdit
                    ? await editUniformFreeUniformLimit(values, formValue.id)
                    : await createUniformFreeUniformLimit(values);

                if (!resp.error) {
                    toast.success(
                        isEdit
                            ? "Free uniform limit updated successfully"
                            : "Free uniform limit created successfully"
                    );
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
            }
        },
    });

    useEffect(() => {
        if (modal.isShowing && isEdit) {
            formHandler.setValues({
                description: formValue.description ?? "",
                allowed_count: formValue.allowed_count ?? 1,
                status: formValue.status ?? "active",
                date_from: formValue.date_from ?? "",
                // date_to: formValue.date_to ?? "",
                created_by: formValue.created_by ?? "",
                updated_by: formValue.updated_by ?? "",
                created_at: formValue.created_at ? moment(formValue.created_at).format("MM/DD/YYYY") : "",
                updated_at: formValue.updated_at ? moment(formValue.updated_at).format("MM/DD/YYYY") : "",
            });
        }
    }, [modal.isShowing, formValue]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title={isEdit ? "Edit Free Uniform Limit" : "Create Free Uniform Limit"}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <div>
                    <TextArea
                        label="Description"
                        placeholder="enter description"
                        name="description"
                        value={formHandler.values.description}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.description}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Textfield 
                            type="date"
                            label= "Date Effectivity"
                            name="date_from"
                            value={formHandler.values.date_from}
                            required
                            onChange={formHandler.handleChange}
                            error= {formHandler.errors.date_from}
                        />
                      
                        <Textfield
                        type="number"
                        label="Allowed Count"
                        placeholder="enter allowed count"
                        name="allowed_count"
                        value={formHandler.values.allowed_count}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.allowed_count}
                        />
                    </div>
                    
                    <ActiveInactiveDropDown
                        label="Status"
                        placeholder="select status"
                        name="status"
                        value={formHandler.values.status}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.status}
                    />
                </div>
                { isEdit && (
                <div>
                    <hr className="mt-6 pb-2 text-slate-300"/>
                    <span>Report Logs:</span>
                    <div className="grid grid-cols-2 gap-4">
                        <Textfield 
                            type="text"
                            label= "Created By"
                            name="created_by"
                            value={formHandler.values.created_by }
                            onChange={formHandler.handleChange}
                            error= {formHandler.errors.created_by}
                            disabled
                        />
                        <Textfield 
                            type="text"
                            label="Created At"
                            name="created_at"
                            value={formHandler.values.created_at}
                            onChange={formHandler.handleChange}
                            error={formHandler.errors.created_at}
                            disabled
                        />
                        <Textfield 
                            type="text"
                            label= "Updated By"
                            name="updated_by"
                            value={formHandler.values.updated_by }
                            onChange={formHandler.handleChange}
                            error= {formHandler.errors.updated_by}
                            disabled
                        />
                        <Textfield 
                            type="text"
                            label="Updated At"
                            name="updated_at"
                            value={formHandler.values.updated_at}
                            onChange={formHandler.handleChange}
                            error={formHandler.errors.updated_at}
                            disabled
                        />
                    </div>
                </div>
                )}
                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default UniformFreeUniformLimitForm;
