import Modal from "@/components/common/Modal";
import CoePDF from "../../pdf/CoePDF";
import { useState } from "react";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getReportsCoeRequest } from "@/api/reports/reports-coe-request";
import { toast } from "react-toastify";
import FirstContract from "../../pdf/contracts/FirstContract";
import { getEmployeeContractDetails } from "@/api/employee";

interface FormModalInterface {
    modal: any;
    contractId: number;
};

const PrintInitialContractModal = ({
    modal,
    contractId
}: FormModalInterface) => {
    const [data, setData] = useState<any>({});
    const api = useApiCall();

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getEmployeeContractDetails(Number(contractId))
            .then((resp) => {
                if (!resp.error) {
                    setData(resp.data);
                } else {
                    toast.error(resp.data.message);
                }
            }).finally(() => {
                api.setLoading(false);
            })
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Contract"
            onClose={() => {
                modal.onClose();
            }}
            loading={api.loading}
            size="xxl"
        >
            <FirstContract
                data={data}
            />
        </Modal>
    );
};

export default PrintInitialContractModal;