import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import moment from "moment";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import SearchEmployeeDropDown from "@/components/modules/generic/SearchEmployeeDropDown";
import CSHubTransactionTypeDropDown from "@/components/modules/generic/CSHubTransactionTypeDropDown";
import TextArea from "@/components/common/TextArea";
import TermsDropDown from "@/components/modules/generic/TermsDropDown";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { editConverterDetails } from "@/api/compensation/converter";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    data: any;
    onSubmitCallback: () => void;
}

const EditConverterDetailForm = ({
    modal,
    data,
    onSubmitCallback
}: ModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            amount: "",
            remarks: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            amount: Yup.string().required("Amount is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                message: "Are you sure you want to save changes?",
                title: "Transaction Details"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editConverterDetails(values, data.id)
                .then((resp) => {
                    if (!resp.error) {
                        modal.onClose();
                        resetForm();
                        onSubmitCallback();
                        toast.success("Details updated successfully");
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    setSubmitting(false);
                });
            }
        }
    });

    useEffect(() => {
        if (modal.isShowing) {
            formHandler.setValues({
                remarks: data.remarks,
                amount: data.amount
            });
        }
    }, [modal.isShowing]);

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
                    label="Employee"
                    disabled
                    required
                    value={data.employee?.full_name ?? ""}
                />
                <Textfield
                    label="Terms"
                    disabled
                    required
                    value={data.terms ?? ""}
                />
                <Textfield
                    label="Transaction Type"
                    disabled
                    required
                    value={data.transaction_type?.description ?? ""}
                />
                <Textfield
                    label="Amount"
                    name="amount"
                    type="number"
                    placeholder="enter amount"
                    required
                    value={formHandler.values.amount}
                    error={formHandler.errors.amount}
                    onChange={formHandler.handleChange}
                />
                <TextArea
                    label="Remarks"
                    name="remarks"
                    placeholder="enter remarks"
                    value={formHandler.values.remarks ?? ""}
                    error={formHandler.errors.remarks}
                    onChange={formHandler.handleChange}
                />
                <Button
                    type="submit"
                    label="Save changes"
                    loading={formHandler.isSubmitting}
                    onClick={() => {}}
                />
            </form>
        </Modal>
    );
};

export default EditConverterDetailForm;