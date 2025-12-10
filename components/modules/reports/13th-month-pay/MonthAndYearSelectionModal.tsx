import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { useApiCall } from "@/hooks/api-call";
import { generateThirteenthMonthMonthlyAllocation } from "@/api/reports/reports-13th-month";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";

interface ModalInterface {
    modal: any;
    id: any;
    onSubmitCallback: () => void;
}

const MonthAndYearSelectionModal = ({
    modal,
    id,
    onSubmitCallback
}: ModalInterface
) => {
    const api = useApiCall();

    const formHandler = useFormik({
        initialValues: {
            year: "",
            month: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            year: Yup.string().required("Year is required."),
            month: Yup.string().required("Month is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Generate 13th Month Monthly Allocation",
                message: "Are you sure you want to generate 13th month monthly allocation?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                generateThirteenthMonthMonthlyAllocation(values)
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
            title="Generate 13th Month Monthly Allocation"
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
                <Dropdown
                    placeholder="select month"
                    label="Month"
                    name="month"
                    value={formHandler.values.month}
                    onChange={formHandler.handleChange}
                    options={[
                            { label: "January", value: "01" },
                            { label: "February", value: "02" },
                            { label: "March", value: "03" },
                            { label: "April", value: "04" },
                            { label: "May", value: "05" },
                            { label: "June", value: "06" },
                            { label: "July", value: "07" },
                            { label: "August", value: "08" },
                            { label: "September", value: "09" },
                            { label: "October", value: "10" },
                            { label: "November", value: "11" },
                            { label: "December", value: "12" },
                    ]}
                    error={formHandler.errors.month}
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

export default MonthAndYearSelectionModal;
