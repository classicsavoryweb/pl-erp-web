import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import SearchEmployeeDropDown from "@/components/modules/generic/SearchEmployeeDropDown";
import CSHubTransactionTypeDropDown from "@/components/modules/generic/CSHubTransactionTypeDropDown";
import TextArea from "@/components/common/TextArea";
import TermsDropDown from "@/components/modules/generic/TermsDropDown";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createConverterDetails } from "@/api/compensation/converter";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const CreateConverterDetailForm = ({
    modal,
    onSubmitCallback
}: ModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            employee: "",
            employee_id: "",
            transaction_type_id: "",
            amount: "",
            terms_id: "",
            remarks: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_id: Yup.string().required("Employee is required"),
            transaction_type_id: Yup.string().required("Transaction Type is required"),
            amount: Yup.string().required("Amount is required"),
            terms_id: Yup.string().required("Terms is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                message: "Are you sure you want to submit?",
                title: "Transaction Details"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createConverterDetails(values)
                .then((resp) => {
                    if (!resp.error) {
                        modal.onClose();
                        resetForm();
                        onSubmitCallback();
                        toast.success("Details created successfully");
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
                <SearchEmployeeDropDown
                    label="Employee"
                    name="employee"
                    placeholder="select employee"
                    required
                    value={formHandler.values.employee}
                    error={formHandler.errors.employee_id}
                    onChange={(e) => {
                        formHandler.setFieldValue("employee", e.target.value);
                        formHandler.setFieldValue("employee_id", e.target.value.id);
                    }}
                />
                <CSHubTransactionTypeDropDown
                    label="Transaction Type"
                    name="transaction_type_id"
                    placeholder="select transaction type"
                    required
                    value={formHandler.values.transaction_type_id}
                    error={formHandler.errors.transaction_type_id}
                    onChange={formHandler.handleChange}
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
                <TermsDropDown
                    label="Terms"
                    name="terms_id"
                    placeholder="select terms"
                    required
                    value={formHandler.values.terms_id}
                    error={formHandler.errors.terms_id}
                    onChange={formHandler.handleChange}
                />
                <TextArea
                    label="Remarks"
                    name="remarks"
                    placeholder="enter remarks"
                    value={formHandler.values.remarks}
                    error={formHandler.errors.remarks}
                    onChange={formHandler.handleChange}
                />
                <Button
                    type="submit"
                    label="Submit"
                    loading={formHandler.isSubmitting}
                    onClick={() => {}}
                />
            </form>
        </Modal>
    );
};

export default CreateConverterDetailForm;