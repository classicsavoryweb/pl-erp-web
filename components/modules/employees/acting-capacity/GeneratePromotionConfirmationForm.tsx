"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import moment from "moment";
import Grid from "@/components/common/Grid";
import EmployeeBasicInfo from "../EmployeeBasicInfo";
import Badge from "@/components/common/Badge";
import { addActingCapacity, generateConfirmationPromotion, getActingCapacity } from "@/api/acting-capacity";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import { PDFViewer } from "@react-pdf/renderer";
import IFramePDFViewer from "@/components/common/IFramePDFViewer";

interface FormModalInterface {
    modal: any;
    id: string;
    onSubmitCallBack: () => void;
};

const GeneratePromotionConfirmationForm = ({
    modal,
    id,
    onSubmitCallBack
}: FormModalInterface) => {

    const api = useApiCall();
    const formHandler = useFormik({
        initialValues: {
            effectivity_date: "",
            bond_amount: 50000,
            bond_year: 1,
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            bond_amount: Yup.string().required("Bond amount is required"),
            bond_year: Yup.string().required("Bond year is required"),
            effectivity_date: Yup.string().required("Effectivity date is required")
            .test(
            'future-date',
            `Effectivity date must be same or after ${api.data.latest_end_date}`,
            function (value) {
                if (!value || !api.data.latest_end_date) return true;

                return moment(value).isSameOrAfter
                (moment(api.data.latest_end_date));
            }),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Generate Confirmation Documents",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                generateConfirmationPromotion(id, values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Promotion confirmation updated successfully");
                        resetForm();
                        onSubmitCallBack();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    setSubmitting(false);
                });
            }
        }
    });
    
    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getActingCapacity(id)
            .then((resp) => {
                if (!resp.error) {
                    api.setData(resp.data.acting_capacity);
                    formHandler.setFieldValue("effectivity_date", resp.data.acting_capacity.latest_end_date);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered")
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            loading={api.loading}
            title="Generate Promotion Confirmation"
            size="lg"
        >
            <p className="text-sm  font-semibold text-gray-500">
                Employee Details
            </p>
            <Grid cols={2}>
                <Textfield
                    label="Name"
                    value={api.data?.employee?.proper_full_name}
                    disabled={true}
                />

                <Textfield
                    label="Status"
                    value={api.data?.employee?.employee_status?.description}
                    disabled={true}
                />

                <Textfield
                    label="Current Branch"
                    value={api.data?.branch?.name}
                    disabled={true}
                />
            </Grid>

            <p className="text-sm  font-semibold text-gray-500 pt-3">
                Acting Capacity
            </p>
            <Grid cols={2}>
                <Textfield
                    label="Current Position"
                    value={api.data?.current_position?.description}
                    disabled={true}
                />
                <Textfield
                    label="Recommended Position"
                    value={api.data?.recommended_position?.description}
                    disabled={true}
                />
                <Textfield
                    type="date"
                    label="Start Date"
                    value={api.data?.start_date}
                    disabled={true}
                />
                <Textfield
                    type="date"
                    label="End Date"
                    value={api.data?.end_date}
                    disabled={true}
                />
                <Textfield
                    label="Period"
                    value={api.data?.period}
                    disabled={true}
                />
                <Textfield
                    label="Branch Assignment"
                    value={api.data?.branch_assignment?.name}
                    disabled={true}
                />
                <div className="col-span-2">
                    <TextArea
                        label="Remarks"
                        value={api.data?.remarks ?? ""}
                        disabled
                    />
                </div>
            </Grid>

            { api.data?.extensions && api.data?.extensions.length > 0 &&
                <>
                    <p className="text-sm  font-semibold text-gray-500 pt-3">
                        Extensions
                    </p>
                    { api.data.extensions.map((extension: any, id: number) => 
                        <Grid cols={3} key={id}>
                            <Textfield
                                label="End Date"
                                value={extension.end_date}
                                disabled
                            />
                            <Textfield
                                label="Reason"
                                value={extension.reason}
                                disabled
                            />
                            <Textfield
                                label="Remarks"
                                value={extension.remarks}
                                disabled
                            />
                        </Grid>
                    )
                    }
                </>
            }

            <p className="text-sm  font-semibold text-gray-500 pt-3">
                Promotion Confirmation
            </p>

            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={3}>
                    <Textfield
                        type="date"
                        label="Effectivity Date"
                        name="effectivity_date"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.effectivity_date}
                        error={formHandler.errors.effectivity_date}
                        required
                    />

                    <Textfield
                        type="number"
                        label="Bond Amount"
                        name="bond_amount"
                        onChange={formHandler.handleChange}
                        value={String(formHandler.values.bond_amount)}
                        error={formHandler.errors.bond_amount}
                        required
                    />

                    <Textfield
                        type="number"
                        label="Bond Year"
                        name="bond_year"
                        onChange={formHandler.handleChange}
                        value={String(formHandler.values.bond_year)}
                        error={formHandler.errors.bond_year}
                        required
                    />

                </Grid>
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            type="submit"
                            label="Submit"
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

export default GeneratePromotionConfirmationForm;