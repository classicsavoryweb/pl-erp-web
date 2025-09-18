import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import CutOffDropDown from "../../generic/CutOffDropDown";
import Dropdown from "@/components/common/Dropdown";
import * as Yup from "yup";
import { useFormik } from "formik";
import confirm  from "@/components/common/Confirm";
import moment from "moment";
import { getCurrentCutoff } from "@/helper/cutoff";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { createCutOff } from "@/api/compensation/cut-off";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const CreateCutOffModal = ({
    modal,
    onSubmitCallback
}: ModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            cutoff: {
                ...getCurrentCutoff()
            },
            selected_cutoff: getCurrentCutoff().range,
            year: moment().year(),
            pay_date: "",
            initialize: "Yes"
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            year: Yup.string().required("Year is required"),
            selected_cutoff: Yup.string().required("Selected cutoff is required"),
            pay_date: Yup.string().required("Pay date is required"),
            initialize: Yup.string().required("Initialization is required")
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                message: "Are you sure you want to save?",
                title: "Cutoff"
            });

            setSubmitting(true);
            isConfirmed &&
            createCutOff(values)
            .then((resp) => {
                if (!resp.error) {
                    toast.success(resp.data.message);
                    resetForm();
                    modal.onClose();
                    onSubmitCallback();
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                setSubmitting(false);
            });
        }
    });

    return (
        <Modal
            size="md"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title="Setup Cutoff"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <CutOffDropDown
                    value={formHandler.values.selected_cutoff}
                    onChange={(e) => {
                        formHandler.setFieldValue("selected_cutoff", e.target.value);
                        formHandler.setFieldValue("cutoff", e.target.obj || null);
                    }}
                    required
                    error={formHandler.errors.selected_cutoff}
                />
                <Dropdown
                    placeholder="select year"
                    label="Year"
                    name="year"
                    value={String(formHandler.values.year)}
                    onChange={formHandler.handleChange}
                    options={Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return { label: year.toString(), value: year.toString() };
                    })}
                    required
                    error={formHandler.errors.year}
                />
                <Textfield
                    label="Pay Date"
                    name="pay_date"
                    type="date"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.pay_date}
                    error={formHandler.errors.pay_date}
                    required
                />
                <Dropdown
                    label="Initialization"
                    name="initialize"
                    placeholder="select flex schedule"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.initialize}
                    error={formHandler.errors.initialize}
                    options={[
                        {label: "Yes", value: "Yes"},
                        {label: "No", value: "No"},
                    ]}
                    required
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />
                    </div>     
                    <div>
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

export default CreateCutOffModal;