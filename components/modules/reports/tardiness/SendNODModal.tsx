import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { getNTEDetaills, importTardinessOffenses, sendTardinessNOD } from "@/api/reports/reports-tardiness";
import Dropdown from "@/components/common/Dropdown";
import TextArea from "@/components/common/TextArea";
import { pdf } from "@react-pdf/renderer";
import TardinessNOD from "../../pdf/TardinessNOD";

interface FormModalInterface {
    modal: any;
    id: number,
    onSubmitCallBack: () => void;
};

const SendNODModal = ({
    modal,
    id,
    onSubmitCallBack
}: FormModalInterface) => {

    const sendNODHandler = useFormik({
        initialValues: {
            with_statement: "No",
            statement: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            statement: Yup.string().when('with_statement', (keyWord, schema) => 
                String(keyWord) === "Yes"
                    ? schema.required('Statement is required')
                    : schema.notRequired()
            ),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const resp = await getNTEDetaills(id);
            const blob = await pdf(<TardinessNOD data={resp.data} employeeStatement={values.statement} />).toBlob();
            const isConfirmed = await confirm({
                title: "Send Tardiness NOD",
                message: "Are you sure you want to send an NOD?",
            });

            isConfirmed &&
            sendTardinessNOD(id, {
                "nod_memo": new File([blob], "nod_memo.pdf", { type: "application/pdf" })
            }).then((resp) => {
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
            <form onSubmit={sendNODHandler.handleSubmit}>
                <Dropdown
                    name="with_statement"
                    placeholder="select option"
                    value={sendNODHandler.values.with_statement}
                    onChange={(e) => {
                        sendNODHandler.handleChange(e);
                        sendNODHandler.setFieldValue("statement", "With written explanation submitted.");
                    }}
                    label="With Statement"
                    options={[
                        {
                            label: "No",
                            value: "No"
                        },
                        {
                            label: "Yes",
                            value: "Yes"
                        },
                    ]}
                />

                { sendNODHandler.values.with_statement === "Yes" &&
                    <TextArea
                        name="statement"
                        label="Statement"
                        placeholder="enter employee statement"
                        value={sendNODHandler.values.statement}
                        error={sendNODHandler.errors.statement}
                        onChange={sendNODHandler.handleChange}
                        required
                    />
                }

            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end">
                <div className="w-1/2 flex justify-end items-center gap-x-2">
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                            sendNODHandler.resetForm();
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

export default SendNODModal;