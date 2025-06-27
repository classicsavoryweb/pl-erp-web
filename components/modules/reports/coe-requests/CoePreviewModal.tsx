import Modal from "@/components/common/Modal";
import CoePDF from "../../pdf/CoePDF";
import { useState } from "react";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getReportsCoeRequest } from "@/api/reports/reports-coe-request";
import { toast } from "react-toastify";

interface FormModalInterface {
    modal: any;
    requestId: number;
};

const CoePreviewModal = ({
    modal,
    requestId
}: FormModalInterface) => {
    const [data, setData] = useState<any>({});
    const api = useApiCall();

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            api.setError(false);
            getReportsCoeRequest(Number(requestId))
            .then((resp) => {
                if (!resp.error) {
                    setData(resp.data);
                } else {
                    toast.error(resp.data.message);
                    api.setError(true);
                }
            }).catch(() => {
                api.setError(true);
            }).finally(() => {
                api.setLoading(false);
            })
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Certificate of Employment"
            onClose={() => {
                modal.onClose();
            }}
            loading={api.loading}
            size="xxl"
            error={api.error}
        >
            <CoePDF
                data={data}
            />
        </Modal>
    );
};

export default CoePreviewModal;