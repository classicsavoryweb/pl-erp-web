import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import { createVaccine } from "@/api/vaccines";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import CoeReasonDropDown from "../../generic/CoeReasonDropDown";
import Dropdown from "@/components/common/Dropdown";
import { addReportsCoeRequest } from "@/api/reports/reports-coe-request";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateReportCoeRequestForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            coe_reason: "",
            employee_number: "",
            coe_format: "Normal Format",
            include_salary: "No",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            coe_reason: Yup.string().required("COE Reason is required."),
            coe_format: Yup.string().required("COE Format is required."),
            employee_number: Yup.string().required("Employee is required."),
            include_salary: Yup.string().required("Include Salary is required."),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            addReportsCoeRequest(values)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("COE Request created successfully");
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
            title="Create COE Request"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <EmployeeDropDown
                    label="Employee"
                    placeholder="select employee"
                    name="employee_number"
                    value={createFormHandler.values.employee_number}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.employee_number}
                />
                <Dropdown
                    label="COE Format"
                    placeholder="select format"
                    name="coe_format"
                    value={createFormHandler.values.coe_format}
                    required
                    disabled
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.coe_format}
                    options={[
                        {
                            label: "Normal Format",
                            value: "Normal Format",
                        },
                        {
                            label: "Special Format",
                            value: "Special Format",
                        },
                    ]}
                />
                <Dropdown
                    label="Include Salary"
                    placeholder="select option"
                    name="include_salary"
                    value={createFormHandler.values.include_salary}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.include_salary}
                    options={[
                        {
                            label: "Yes",
                            value: "Yes",
                        },
                        {
                            label: "No",
                            value: "No",
                        },
                    ]}
                />
                <CoeReasonDropDown
                    label="COE Reason"
                    placeholder="select reason"
                    name="coe_reason"
                    value={createFormHandler.values.coe_reason}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.coe_reason}
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

export default CreateReportCoeRequestForm;