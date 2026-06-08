import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { createUniformSupplier } from "@/api/maintenance/vendor-supplier";
import confirm from "@/components/common/Confirm";
import VendorDropDown from "../../../generic/VendorDropDown";
    
interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const AddVendorSupplierFormInactive = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            vendor_number : "",
            vendor_name: "",          
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            vendor_name: Yup.string().required("Vendor Name is required."),
            vendor_number: Yup.string().required("Vendor Number is required.")
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Add Vendor",
                message: "Are you sure you want to add this Vendor?"
            });
            if (isConfirmed) {
                try {
                    setSubmitting(true);
                    const resp = await createUniformSupplier(values);

                    if(!resp.error) {
                        toast.success("Training title created successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                } catch (err) {
                    toast.error("Error encountered");
                } finally {
                    setSubmitting(false);
                };
            }
        }
    });
    return (
        <Modal
            isShowing={modal.isShowing}
            title="Add Vendors"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>

                <Textfield
                    label="Vendor Number"
                    placeholder="vendor number"
                    name="vendor_number"
                    value={createFormHandler.values.vendor_number ?? ""}
                    error={createFormHandler.errors.vendor_number}
                    disabled
                />
                                        
                <VendorDropDown
                label="Vendor Account"
                placeholder="select vendor"
                name="vendor_name"
                value={createFormHandler.values.vendor_number}
                error={createFormHandler.errors.vendor_name}
                required
                onChange={(event: any) => {
                    const vendor = event?.target?.obj;

                    createFormHandler.setFieldValue("vendor_name", vendor?.ven_name ?? "");
                    createFormHandler.setFieldValue("vendor_number", vendor?.ven_no ?? "");
                }}
                />                                                   
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default AddVendorSupplierFormInactive;