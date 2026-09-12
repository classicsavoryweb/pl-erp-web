import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { importBir2316 } from "@/api/reports/reports-bir-2316";
import Dropdown from "@/components/common/Dropdown";
import Textfield from "@/components/common/Textfield";
import Grid from "@/components/common/Grid";
import Button from "@/components/common/Button";
import { useRef } from "react";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const scheduleOptions = [
    { label: "Schedule 1 (Taxable)", value: "schedule_1" },
    { label: "Schedule 2 (Non-Taxable)", value: "schedule_2" },
];

const ImportBir2316Modal = ({
    modal,
    onSubmitCallback
}: ModalInterface
) => {
    const currentYear = new Date().getFullYear();
    const isImportingRef = useRef(false);

    const yearOptions = Array.from({ length: 10 }, (_, i) => {
        const year = currentYear - i;
        return { label: String(year), value: String(year) };
    });

    const formHandler = useFormik({
        initialValues: {
            year: String(currentYear),
            schedule_type: "schedule_1",
            bir_2316_file: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            year: Yup.string().required("Year is required."),
            schedule_type: Yup.string().required("Schedule is required."),
            bir_2316_file: Yup.string().required("Excel file is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            if (isImportingRef.current) {
                return;
            }

            const scheduleLabel = scheduleOptions.find((o) => o.value === values.schedule_type)?.label ?? values.schedule_type;

            const isConfirmed = await confirm({
                title: "Import BIR 2316",
                message: `This replaces any existing ${values.year} ${scheduleLabel} certificates already imported with the contents of this file. Continue?`
            });

            if (isConfirmed && !isImportingRef.current) {
                isImportingRef.current = true;
                setSubmitting(true);
                try {
                    const resp = await importBir2316(values);
                    if (!resp.error) {
                        toast.success(`Imported ${resp.data?.imported ?? 0} certificate(s).`);
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data?.message ?? "Error encountered");
                    }
                } catch {
                    toast.error("Error encountered");
                } finally {
                    isImportingRef.current = false;
                    setSubmitting(false);
                }
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Import BIR 2316"
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
                        placeholder="select schedule"
                        label="Schedule"
                        name="schedule_type"
                        value={formHandler.values.schedule_type}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.schedule_type}
                        options={scheduleOptions}
                    />
                </Grid>

                <Textfield
                    label="Excel File"
                    type="file"
                    name="bir_2316_file"
                    onChange={(event: any) => {
                        const file = event.target.files?.[0];
                        if (file) {
                            formHandler.setFieldValue("bir_2316_file", file);
                        }
                    }}
                    error={formHandler.errors.bir_2316_file}
                    required
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
                            label="Import"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ImportBir2316Modal;
