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
import { addActingCapacity, getActingCapacity } from "@/api/acting-capacity";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import { PDFViewer } from "@react-pdf/renderer";
import IFramePDFViewer from "@/components/common/IFramePDFViewer";

interface FormModalInterface {
    modal: any;
    id: string;
};

const ViewActingCapacity = ({
    modal,
    id
}: FormModalInterface) => {

    const api = useApiCall();
    
    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getActingCapacity(id)
            .then((resp) => {
                if (!resp.error) {
                    api.setData(resp.data.acting_capacity);
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
            }}
            loading={api.loading}
            title="View Acting Capacity"
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
                    label="Branch"
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
                <div className="col-span-2">
                    <TextArea
                        label="Remarks"
                        value={api.data?.remarks ?? ""}
                        disabled
                    />
                </div>
                
                { api.data?.recommendation_letter &&
                    <IFramePDFViewer
                        label="Recommendation Letter"
                        src={api.data?.recommendation_letter}
                    />
                }
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

            { api.data?.attachments && api.data?.attachments.length > 0 &&
                <>
                    <p className="text-sm  font-semibold text-gray-500 pt-3">
                        Attachments
                    </p>
                    { api.data.attachments.map((attachment: any, id: number) => 
                        <Grid cols={2} key={id}>
                            <Textfield
                                label="File Type"
                                value={attachment.file_name}
                                disabled
                            />

                            <div className="mt-[14px]">
                                <IFramePDFViewer
                                    src={attachment.file_path}
                                    label={attachment.file_name}
                                />
                            </div>
                        </Grid>
                    )
                    }
                </>
            }

            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end gap-x-2">
                <div>
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ViewActingCapacity;