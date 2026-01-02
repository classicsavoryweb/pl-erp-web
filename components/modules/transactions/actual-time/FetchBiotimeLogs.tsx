import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import BranchDropDown from "../../generic/BranchDropDown";
import { fetchBranchBiotimeLogs } from "@/api/transactions/actual-time";

interface FormModalInterface {
    modal: any;
};

const FetchBiotimeLogsModal = ({
    modal,
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
                title: "Fetch Biotime Logs",
                message: "Are you sure you want to fetch logs?"
            });

            if (isConfirm) {
                fetchBranchBiotimeLogs(values)
                .then((resp) => {
                    if (!resp.error) {
                        resetForm();
                        modal.onClose();
                        toast.info(resp.data.message);
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Fetch Biotime Logs"
            onClose={() => {
                modal.onClose();
            }}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <BranchDropDown
                    label="Branch"
                    placeholder="select branch"
                    name="branch_id"
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
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default FetchBiotimeLogsModal;