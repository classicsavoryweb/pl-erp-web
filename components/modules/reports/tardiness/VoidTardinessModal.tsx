import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { voidTardiness } from "@/api/reports/reports-tardiness";
import TextArea from "@/components/common/TextArea";

interface FormModalInterface {
    modal: any;
    id: number;
    onSubmitCallBack: () => void;
};

const VoidTardinessModal = ({
    modal,
    id,
    onSubmitCallBack
}: FormModalInterface) => {

    const voidTardinessHandler = useFormik({
        initialValues: {
            reason: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            reason: Yup.string().required("Reason is required")
        }),
        onSubmit: async (values, {resetForm}) => {
            const isConfirm = await confirm({
                title: "Void Tardiness",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirm) {
                voidTardiness(id, values).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        resetForm();
                        onSubmitCallBack();
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
            title="Void Tardiness"
            onClose={() => {
                modal.onClose();
                voidTardinessHandler.resetForm();
            }}
            size="md"
        >
            <form onSubmit={voidTardinessHandler.handleSubmit}>
                <TextArea
                    name="reason"
                    label="Reason"
                    required
                    onChange={voidTardinessHandler.handleChange}
                    value={voidTardinessHandler.values.reason}
                    error={voidTardinessHandler.errors.reason}
                    placeholder="enter reason for voiding"
                />
            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end">
                <div className="w-1/2 flex justify-end items-center gap-x-2">
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                            voidTardinessHandler.resetForm();
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

export default VoidTardinessModal;