import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import TextArea from "@/components/common/TextArea";
import Button from "@/components/common/Button";
import { createTravelOvertime } from "@/api/transactions/travel-overtime";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    callBack: () => void;
};

const CreateTravelOvertimeModal = ({
    modal,
    callBack
}: ModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            employee_id: "",
            date: "",
            travel_time: "",
            remarks: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_id: Yup.string().required("Employee is required"),
            date: Yup.string().required("Date is required"),
            travel_time: Yup.number().min(1, "Cannot accept 0 and below").required("Travel time is required")
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                message: "Are you sure you want to submit?",
                title: "Travel Overtime"
            });

            if (isConfirmed) {
                setSubmitting(true);

                try {
                    const resp = await createTravelOvertime(values);

                    if (!resp.error) {
                        toast.success("Travel overtime successfully created");
                        resetForm();
                        modal.onClose();
                        callBack();
                    } else {
                        toast.error(resp.data.message);
                    }
                } catch {
                    toast.error("Error encountered");
                } finally {
                    setSubmitting(false);
                }
            }
        }
    });

    return (
        <Modal
            size="md"
            title="Create Travel Overtime"
            isShowing={modal.isShowing}
            onClose={modal.onClose}
        >
            <form onSubmit={formHandler.handleSubmit}>
                <EmployeeDropDown
                    label="Employee"
                    name="employee_id"
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.employee_id}
                    value={formHandler.values.employee_id}
                    placeholder="select employee"
                    required
                />
                <Textfield
                    type="date"
                    label="Date"
                    required
                    name="date"
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.date}
                    value={formHandler.values.date}
                />
                <Textfield
                    type="number"
                    label="Travel Time"
                    required
                    name="travel_time"
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.travel_time}
                    value={formHandler.values.travel_time}
                    placeholder="enter travel time"
                />
                <TextArea
                    label="Remarks"
                    name="remarks"
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.remarks}
                    value={formHandler.values.remarks}
                />
                <Button
                    type="submit"
                    label="Submit"
                    onClick={() => {}}
                    loading={formHandler.isSubmitting}
                />
            </form>
        </Modal>
    );
};

export default CreateTravelOvertimeModal;