import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import { useFormik } from "formik";
import * as Yup from "yup";
import { importConverterTransactions } from "@/api/compensation/converter";
import { toast } from "react-toastify";
import { useState } from "react";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const ImportConverterTransactionForm = ({
    modal,
    onSubmitCallback
}: ModalInterface) => {

    const [loading, setLoading] = useState<boolean>(false);
    const formHandler = useFormik({
        initialValues: {
            transactions_file: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            transactions_file: Yup.string().required("File is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                message: "Are you sure you want to submit?",
                title: "Transaction Details"
            });

            if (isConfirmed) {
                setLoading(true);
                setSubmitting(true);
                importConverterTransactions(values)
                .then((resp) => {
                    if (!resp.error) {
                        modal.onClose();
                        resetForm();
                        onSubmitCallback();
                        toast.info("Details imported successfully");
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    setSubmitting(false);
                    setLoading(false);
                });
            }
        }
    });

    return (
        <Modal
            size="md"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title="Transaction Details"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Textfield
                    label="File"
                    name="transactions_file"
                    type="file"
                    placeholder="upload file"
                    required
                    error={formHandler.errors.transactions_file}
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        formHandler.setFieldValue("transactions_file", file);
                    }}
                />
                <Button
                    type="submit"
                    label="Submit"
                    loading={loading}
                    onClick={() => {}}
                />
            </form>
        </Modal>
    );
};

export default ImportConverterTransactionForm;