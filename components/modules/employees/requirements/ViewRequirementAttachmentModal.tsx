"use client";

import Modal from "@/components/common/Modal"
import { toast } from "react-toastify";
import { getRequirementAttachment } from "@/api/employee";
import { useParams } from "next/navigation";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import IFramePDFViewer from "@/components/common/IFramePDFViewer";
import EmptyState from "@/components/common/EmptyState";

interface FormModalInterface {
    modal: any;
};

const ViewRequirementsAttachmentModal = ({
    modal,
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);

            getRequirementAttachment(String(employeeNumber))
            .then((resp) => {
                if (!resp.error) {
                    api.setDataSet(resp.data.attachments);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
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
            title="Uploaded Requirements Files"
            size="md"
            loading={api.loading}
        >
            { api.dataSet.length === 0 &&
                <>
                    <EmptyState/>
                    <p className="text-center">No files uploaded</p>
                </>
            }
            { api.dataSet.length > 0 && api.dataSet.map((attachment: any, id: number) => 
                <Grid cols={2} key={id}>
                    <Textfield
                        label="File Name"
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
        </Modal>
    );
};

export default ViewRequirementsAttachmentModal;