import Modal from "@/components/common/Modal";
import CoePDF from "../../pdf/CoePDF";
import { useState } from "react";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { toast } from "react-toastify";
import { getNTEDetaills } from "@/api/reports/reports-tardiness";
import TardinessNotice from "../../pdf/TardinessNotice";
import { PDFViewer } from "@react-pdf/renderer";

interface FormModalInterface {
    modal: any;
    id: number;
};

const TardinessMemoModal = ({
    modal,
    id
}: FormModalInterface) => {
    const [data, setData] = useState<any>({});
    const api = useApiCall();

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getNTEDetaills(Number(id))
            .then((resp) => {
                if (!resp.error) {
                    setData(resp.data);
                } else {
                    toast.error("Error fetching memo details");
                }
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
        >
            <PDFViewer
                className="w-full h-[85vh]"
            >
                <TardinessNotice
                    data={data}
                />
            </PDFViewer>
        </Modal>
    );
};

export default TardinessMemoModal;