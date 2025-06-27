"use client";

import Modal from "@/components/common/Modal"
import { toast } from "react-toastify";
import { getRequirementAttachment } from "@/api/employee";
import { useParams } from "next/navigation";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import IFramePDFViewer from "@/components/common/IFramePDFViewer";
import EmptyState from "@/components/common/EmptyState";
import { COLUMNTYPES } from "@/constants/column";

interface FormModalInterface {
    modal: any;
};

const ViewRequirementsAttachmentModal = ({
    modal,
}: FormModalInterface) => {
    const params = useParams();
    const paginator = usePagination(10);
    const employeeNumber = params["employee-number"];
    const api = useApiCall();

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);

            getRequirementAttachment(String(employeeNumber), {
                page: paginator.page,
                per_page: paginator.per_page
            })
            .then((resp) => {
                if (!resp.error) {
                    api.setDataSet(resp.data.data);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing, paginator.reload]);

    const columnSettings = [
        {
            columnHead: "File Name",
            path:"file_name",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Action",
            path:"file_path",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <IFramePDFViewer
                        src={data.file_path}
                        label={data.file_name}
                    />
                );
            }
        }
    ];

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
        <Table
            dataSet={api.dataSet}
            columnSettings={columnSettings}
            paginator={paginator}
        />
            
        </Modal>
    );
};

export default ViewRequirementsAttachmentModal;