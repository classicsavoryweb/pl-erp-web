import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";import { importTravelOvertime } from "@/api/transactions/travel-overtime";
;

interface FormModalInterface {
    modal: any;
};

const ImportTravelTimeModal = ({
    modal,
}: FormModalInterface) => {

    const importForm = useFormik({
        initialValues: {
            travel_time_file: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            travel_time_file: Yup.string().required("Excel file is required"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const isConfirmed = await confirm({
                title: "Travel Time",
                message: "Are you sure you want to import?"
            });

            if (isConfirmed) {
                try {
                    const resp = await importTravelOvertime(values);
                    
                    if (!resp.error) {
                        toast.success("Imported successfully");
                        modal.onClose();
                    } else {
                        toast.error(resp.data.message);    
                    }
                } catch {
                    toast.error("Error encountered");
                } finally {
                    setSubmitting(false);
                }
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Travel Overtime"
            onClose={modal.onClose}
            size="sm"
        >
            <form onSubmit={importForm.handleSubmit}>
                <Textfield
                    label="Excel File"
                    type="file"
                    name="travel_time_file"
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                            importForm.setFieldValue("travel_time_file", file);
                        }
                    }}
                    error={importForm.errors.travel_time_file}
                    required
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={modal.onClose}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            onClick={() => {}}
                            loading={importForm.isSubmitting}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default ImportTravelTimeModal;