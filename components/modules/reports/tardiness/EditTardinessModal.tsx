import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { editMinutesOfTardiness, getTardinessDetails } from "@/api/reports/reports-tardiness";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import TextArea from "@/components/common/TextArea";
import { useState } from "react";

interface FormModalInterface {
    modal: any;
    id: number;
    onSubmitCallBack: () => void;
};

const EditTardinessModal = ({
    modal,
    id,
    onSubmitCallBack
}: FormModalInterface) => {
    const api = useApiCall();

    const [minutes, setMinutes] = useState<number>(0);
    
    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);

            getTardinessDetails(id).then((resp) => {
                if (!resp.error) {
                    api.setData(resp.data);
                    editMinutes.setFieldValue("id", resp.data.id);
                    setMinutes(resp.data.total_minutes);
                    editMinutes.setFieldValue("tardiness_minutes", resp.data.tardiness_minutes);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            })
        }
    }, [modal.isShowing]);
    

    const editMinutes = useFormik({
        initialValues: {
            id: 0,
            tardiness_minutes: []
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            tardiness_minutes: Yup.array().min(1, "Tardiness Minutes is required")
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirm = await confirm({
                title: "Edit Minutes",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirm) {
                const total: number = values.tardiness_minutes.reduce((total: number, minute: any) => {
                    return total + Number(minute.late_minutes);
                }, 0);

                if (total > 60) {
                    editMinutesOfTardiness(values)
                    .then((resp) => {
                        if (!resp.error) {
                            onSubmitCallBack();
                            toast.success(resp.data.message);
                        } else {
                            toast.error(resp.data.message);
                        }
                    });
                } else {
                    toast.error("Total minutes must not be less than 60");
                }
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Minutes of Tardiness"
            onClose={() => {
                modal.onClose();
            }}
            loading={api.loading}
            size="md"
        >
            <Textfield
                disabled
                label="Employee"
                value={api.data?.employee?.full_name}
            />
            <form
                className="mt-2"
                onSubmit={editMinutes.handleSubmit}
            >
                <p className="font-semibold">Total Tardy: {minutes}</p>
                { editMinutes.values.tardiness_minutes  && editMinutes.values.tardiness_minutes.map((minutes: any, idx: number) => {
                    return (
                        <div key={idx}>
                            
                                <Textfield
                                    label={minutes.late_date}
                                    type="number"
                                    value={minutes.late_minutes}
                                    onChange={(e) => {
                                        const updatedMinutes:any = [...editMinutes.values.tardiness_minutes];
                                        updatedMinutes[idx].late_minutes = e.target.value;
                                        editMinutes.setFieldValue('tardiness_minutes', updatedMinutes);
                                        const total: number = editMinutes.values.tardiness_minutes.reduce((total: number, minute: any) => {
                                            return total + Number(minute.late_minutes);
                                        }, 0);

                                        setMinutes(total);
                                    }}
                                    name={`tardiness_minutes.${idx}.late_minutes`}
                                    required
                                />

                                <TextArea
                                    label="Reason"
                                    value={minutes.reason || ""}
                                    onChange={(e) => {
                                        const updatedMinutes:any = [...editMinutes.values.tardiness_minutes];
                                        updatedMinutes[idx].reason = e.target.value;
                                        editMinutes.setFieldValue('tardiness_minutes', updatedMinutes);
                                    }}
                                    name={`tardiness_minutes.${idx}.reason`}
                                    required
                                />
                            
                            <hr className="text-slate-300"/>
                        </div>
                    );
                })
                }
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editMinutes.resetForm();
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

export default EditTardinessModal;