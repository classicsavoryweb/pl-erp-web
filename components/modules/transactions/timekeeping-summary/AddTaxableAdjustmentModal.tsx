import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import Textfield from "@/components/common/Textfield";
import { addTimeKeepingSummaryAdjustment, getTimeKeepingSummaryAdjustmentLogs } from "@/api/transactions/time-keeping";
import { useEffect, useState } from "react";
import Accordion from "@/components/common/Accordion";
import Timeline from "../../generic/Timeline";
import moment from "moment";
import TextArea from "@/components/common/TextArea";

interface FormModalInterface {
    modal: any;
    data: any;
    onSubmitCallback?: () => void;
};

const AddTaxableAdjustmentModal = ({
    modal,
    data,
    onSubmitCallback
}: FormModalInterface) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [logsLoading, setLogsLoading] = useState<boolean>(false);

    const formHandler = useFormik<{
        amount: string;
        remarks: string;
    }>({
        initialValues: {
            amount: "",
            remarks: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            amount: Yup.number()
                .typeError("Amount is required.")
                .required("Amount is required."),
            remarks: Yup.string().required("Remarks is required")
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const isConfirm = await confirm({
                title: "Taxable Adjustment",
                message: "Are you sure you want to save changes?"
            });

            if (!isConfirm) {
                setSubmitting(false);
                return;
            }

            try {
                const resp = await addTimeKeepingSummaryAdjustment({
                    timekeeping_summary_id: data.id,
                    amount: values.amount,
                    remarks: values.remarks
                });

                if (!resp.error) {
                    toast.success(resp.data.message);
                    onSubmitCallback && onSubmitCallback();
                    resetForm();
                    modal.onClose();
                } else {
                    toast.error(resp.data.message);
                }
            } catch (error) {
                toast.error("Error encountered");
            } finally {
                setSubmitting(false);
            }
        }
    });

    useEffect(() => {
        if (!modal.isShowing || !data?.id) {
            setLogs([]);
            return;
        }

        let isMounted = true;
        setLogsLoading(true);
        getTimeKeepingSummaryAdjustmentLogs({
            timekeeping_summary_id: data.id
        })
            .then((resp) => {
                if (!isMounted) return;
                if (resp.error) {
                    toast.error("Error fetching taxable adjustment logs");
                    setLogs([]);
                } else {
                    setLogs(resp.data ?? []);
                }
            })
            .catch(() => {
                if (!isMounted) return;
                toast.error("Error encountered");
                setLogs([]);
            })
            .finally(() => {
                if (!isMounted) return;
                setLogsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [modal.isShowing, data?.id]);

    useEffect(() => {
        if (!modal.isShowing) {
            return;
        }

        formHandler.setValues({
            amount: data.adjustment_amount,
            remarks: data.remarks
        });
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Add Taxable Adjustment"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Textfield
                    type="number"
                    label="Amount"
                    name="amount"
                    placeholder="enter amount"
                    value={formHandler.values.amount}
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.amount}
                    required
                />

                <TextArea
                    label="Remarks"
                    name="remarks"
                    placeholder="enter remarks"
                    value={formHandler.values.remarks}
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.remarks}
                    required
                />

                <div className="mt-4">
                    <Accordion title="Taxable Adjustment Logs">
                        { logsLoading
                            ? <p className="text-[12px] text-slate-500">Loading...</p>
                            : (
                                logs.length > 0
                                    ? <Timeline
                                        data={logs.map((log: any) => {
                                            const createdAt = log?.created_at
                                                ? moment(log.created_at).format("MMMM DD, YYYY h:mm:ss A")
                                                : "—";
                                            const amount = log?.taxable_amount ?? "—";
                                            const status = log?.status ?? "—";
                                            const userName = log?.added_by_user?.proper_full_name || log?.added_by_user?.full_name || log?.added_by_user?.email || "—";

                                            return {
                                                timeline_title: createdAt,
                                                description: `Amount: ${amount}\nStatus: ${status}\nBy: ${userName}`
                                            };
                                        })}
                                    />
                                    : <p className="text-[12px] text-slate-500">No logs available.</p>
                            )
                        }
                    </Accordion>
                </div>

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            type="submit"
                            label="Apply"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
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
                </div>
            </form>
        </Modal>
    );
};

export default AddTaxableAdjustmentModal;

