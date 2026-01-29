import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import BranchDropDown from "../../generic/BranchDropDown";
import { transferTimeKeepingBranch } from "@/api/transactions/schedule-time";
import Textfield from "@/components/common/Textfield";

interface FormModalInterface {
    modal: any;
    data: any;
    onSubmitCallback: () => void;
};

const TransferTimeKeepingBranchModal = ({
    modal,
    data,
    onSubmitCallback
}: FormModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            branch_id: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            branch_id: Yup.string().required("Branch is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirm = await confirm({
                title: "Transfer Branch",
                message: "Are you sure you want to save changes?"
            });

            if (!isConfirm) {
                setSubmitting(false);
                return;
            }

            try {
                const resp = await transferTimeKeepingBranch(values, data.id);

                if (!resp.error) {
                    resetForm();
                    modal.onClose();
                    onSubmitCallback();
                    toast.success(resp.data.message);
                } else {
                    toast.error(resp.data.message);
                }
            } catch (error) {
                toast.error("Error encountered");
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Fetch Schedule"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            size="md"
        >
            <Textfield
                disabled
                value={data?.branch?.name ?? ""}
                label="Old Timekeeping Branch"
            />

            <form onSubmit={formHandler.handleSubmit}>
                <BranchDropDown
                    label="New Timekeeping Branch"
                    placeholder="select branch"
                    name="branch_id"
                    required
                    onChange={formHandler.handleChange}
                    value={formHandler.values.branch_id}
                    error={formHandler.errors.branch_id}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
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

export default TransferTimeKeepingBranchModal;