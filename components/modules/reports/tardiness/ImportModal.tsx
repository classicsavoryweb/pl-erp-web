import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
};

const ImportModal = ({
    modal,
}: FormModalInterface) => {

    const importForm = useFormik({
        initialValues: {
            tardiness_file: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            tardiness_file: Yup.string().required("Excel file is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirm = confirm({
                title: "Import",
                message: "Are you sure you want to import?"
            }) 
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Import Tardiness"
            onClose={() => {
                modal.onClose();
            }}
            size="sm"
        >
            <form onSubmit={importForm.handleSubmit}>
                <Textfield
                label="Excel File"
                type="file"
                name="tardiness_file"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                        importForm.setFieldValue("tardiness_file", file);
                    }
                    // importForm.setFieldValue("tardiness_file", event.target.files[0]);
                }}
                error={importForm.errors.tardiness_file}
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
                            importForm.resetForm();
                        }}
                    />

                    <Button
                        type="submit"
                        label="Submit"
                        loading={importForm.isSubmitting}
                        onClick={() => {}}
                    />
                </div>              
            </div>
            </form>
        </Modal>
    );
};

export default ImportModal;