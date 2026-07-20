import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { generateBir1601C } from "@/api/reports/reports-bir-1601c";
import Dropdown from "@/components/common/Dropdown";
import Grid from "@/components/common/Grid";
import Button from "@/components/common/Button";
import { useRef } from "react";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
].map((month, index) => ({ label: month, value: String(index + 1) }));

const GenerateBir1601CModal = ({
    modal,
    onSubmitCallback
}: ModalInterface
) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const isGeneratingRef = useRef(false);

    const yearOptions = Array.from({ length: 10 }, (_, i) => {
        const year = currentYear - i;
        return { label: String(year), value: String(year) };
    });

    const formHandler = useFormik({
        initialValues: {
            year: String(currentYear),
            month: String(currentMonth),
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            year: Yup.string().required("Year is required."),
            month: Yup.string().required("Month is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            if (isGeneratingRef.current) {
                return;
            }

            const isConfirmed = await confirm({
                title: "Generate BIR 1601-C",
                message: "Are you sure you want to generate the 1601-C for this period? This recomputes Section A from payroll data."
            });

            if (isConfirmed && !isGeneratingRef.current) {
                isGeneratingRef.current = true;
                setSubmitting(true);
                try {
                    const resp = await generateBir1601C(values);
                    if (!resp.error) {
                        toast.success("1601-C generated.");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data?.message ?? "Error encountered");
                    }
                } catch {
                    toast.error("Error encountered");
                } finally {
                    isGeneratingRef.current = false;
                    setSubmitting(false);
                }
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Generate BIR 1601-C"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            size="sm"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={2}>
                    <Dropdown
                        placeholder="select year"
                        label="Year"
                        name="year"
                        value={formHandler.values.year}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.year}
                        options={yearOptions}
                    />
                    <Dropdown
                        placeholder="select month"
                        label="Month"
                        name="month"
                        value={formHandler.values.month}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.month}
                        options={monthOptions}
                    />
                </Grid>
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
                            label="Generate"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default GenerateBir1601CModal;
