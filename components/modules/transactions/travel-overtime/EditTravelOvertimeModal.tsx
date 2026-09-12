import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import TextArea from "@/components/common/TextArea";
import Button from "@/components/common/Button";
import { editTravelOvertime } from "@/api/transactions/travel-overtime";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface ModalInterface {
    modal: any;
    callBack: () => void;
    data: any;
};

const EditTravelOvertimeModal = ({
    modal,
    callBack,
    data
}: ModalInterface) => {
        const formHandler = useFormik({
            initialValues: {
                date: "",
                travel_time: "",
                remarks: ""
            },
            validateOnChange: false,
            validationSchema: Yup.object().shape({
                date: Yup.string().required("Date is required"),
                travel_time: Yup.number().min(1, "Cannot accept 0 and below").required("Travel time is required")
            }),
            onSubmit: async (values, {setSubmitting, resetForm}) => {
                const isConfirmed = await confirm({
                    message: "Are you sure you want to save changes?",
                    title: "Travel Overtime"
                });
    
                if (isConfirmed) {
                    setSubmitting(true);
    
                    try {
                        const resp = await editTravelOvertime(values, data.id);
    
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

        useEffect(() => {
            if (modal.isShowing) {
                formHandler.setValues({
                    date: data.date,
                    remarks: data.remarks ?? "",
                    travel_time: data.travel_time
                });
            }
        }, [modal.isShowing])
    
        return (
            <Modal
                size="md"
                title="Edit Travel Overtime"
                isShowing={modal.isShowing}
                onClose={modal.onClose}
            >
                <form onSubmit={formHandler.handleSubmit}>
                    <Textfield
                        label="Employee"
                        value={data.employee?.full_name}
                        disabled
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

export default EditTravelOvertimeModal;