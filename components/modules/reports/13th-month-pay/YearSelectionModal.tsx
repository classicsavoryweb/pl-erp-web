import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { useApiCall } from "@/hooks/api-call";
import { generateThirteenthMonthPay } from "@/api/reports/reports-13th-month";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const YearSelectionModal = ({
    modal,
    onSubmitCallback
}: ModalInterface
) => {
    const api = useApiCall();

    const formHandler = useFormik({
        initialValues: {
            year: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            year: Yup.string().required("Year is required.")
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Generate 13th Month Pay",
                message: "Are you sure you want to generate 13th pay?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                generateThirteenthMonthPay(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success(resp.data.message);
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally((() => {
                    setSubmitting(false);
                }));
            }
        }
    });
    
    return (
        <Modal
            isShowing={modal.isShowing}
            title="Generate 13th Month Pay"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            loading={modal.loading}
            size="sm"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Dropdown
                    placeholder="select year"
                    label="Year"
                    name="year"
                    value={String(formHandler.values.year)}
                    onChange={formHandler.handleChange}
                    options={Array.from(
                        { length: new Date().getFullYear() - 2017 + 1 }, 
                        (_, i) => {
                            const year = new Date().getFullYear() - i; 
                            return { label: year.toString(), value: year.toString() };
                        }
                    )}
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

export default YearSelectionModal;
