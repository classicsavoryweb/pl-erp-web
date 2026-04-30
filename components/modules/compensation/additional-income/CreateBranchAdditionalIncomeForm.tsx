import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import CutOffDropDown from "../../generic/CutOffDropDown";
import Dropdown from "@/components/common/Dropdown";
import * as Yup from "yup";
import { useFormik } from "formik";
import confirm  from "@/components/common/Confirm";
import moment from "moment";
import { getCurrentCutoff } from "@/helper/cutoff";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { toast } from "react-toastify";
import { useAsyncEffect } from "@/hooks/async-effect";
import BranchDropDown from "../../generic/BranchDropDown";
import { saveBranchAdditionalIncome } from "@/api/compensation/branch-additional-income";

interface ModalInterface {
    modal: any;
    cutoffStart: string;
    cutoffEnd: string;
    year: number;
    onSubmitCallback: () => void;
}

const CreateBranchAdditionalIncomeForm = ({
    modal,
    cutoffStart,
    cutoffEnd,
    year,
    onSubmitCallback
}: ModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            branch_id: "",
            amount: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            branch_id: Yup.string().required("Branch is required"),
            amount: Yup.number().required("Amount is required")
            .min(0, "Cannot accept below 0")
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Additional Income",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                saveBranchAdditionalIncome({
                    ...values,
                    cutoff_start: cutoffStart,
                    cutoff_end: cutoffEnd,
                    year
                })
                .then((resp) => {
                    if (!resp.error) {
                        onSubmitCallback();
                        resetForm();
                        toast.success("Additional income saved successully");
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered")
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
            }}
            title="Create Branch Additional Income"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <BranchDropDown
                    label="Branch"
                    name="branch_id"
                    placeholder="select branch"
                    value={formHandler.values.branch_id}
                    error={formHandler.errors.branch_id}
                    onChange={formHandler.handleChange}
                />
                <Textfield
                    type="number"
                    label="Amount"
                    name="amount"
                    placeholder="enter amount"
                    value={formHandler.values.amount}
                    error={formHandler.errors.amount}
                    onChange={formHandler.handleChange}
                />
                <Button
                    type="submit"
                    label="Submit"
                    onClick={() => {}}
                />
            </form>
        </Modal>
    );
};

export default CreateBranchAdditionalIncomeForm;
