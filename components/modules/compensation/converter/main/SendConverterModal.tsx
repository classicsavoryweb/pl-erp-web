import { sendTransactionEmail } from "@/api/compensation/converter";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { useFormik } from "formik";
import moment from "moment";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface ModalInterface {
    modal: any;
    data: any;
    onSubmitCallBack: () => void;
}

const SendConverterModal = ({
    modal,
    data,
    onSubmitCallBack
}: ModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            crediting_date: ""
        },
        validationSchema: Yup.object().shape({
            crediting_date: Yup.string().required("Crediting Date is required")
        }),
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Send Email",
                message: "Are you sure you want to send email?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                try {
                    const resp = await sendTransactionEmail(data.id, values);
                    if (!resp.error) {
                        toast.success("Emails sent successfully");
                        modal.onClose();
                        onSubmitCallBack();
                        resetForm();
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
            size="sm"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title="Send Email"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Textfield
                    label="Crediting Date"
                    type="date"
                    required
                    name="crediting_date"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.crediting_date}
                    error={formHandler.errors.crediting_date}
                />
                <Button
                    type="submit"
                    loading={formHandler.isSubmitting}
                    label="Submit"
                    onClick={() => {}}
                />
            </form>
        </Modal>
    );
};

export default SendConverterModal;