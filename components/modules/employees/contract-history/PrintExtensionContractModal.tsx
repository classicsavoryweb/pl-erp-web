import Modal from "@/components/common/Modal";
import { useState } from "react";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { toast } from "react-toastify";
import { getEmployeeContractDetails } from "@/api/employee";
import ExtensionContract from "../../pdf/contracts/ExtensionContract";

interface FormModalInterface {
    modal: any;
    contractId: number;
};

const PrintExtensionContractModal = ({
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
                    toast.error("Error fetching contract details");
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
            <ExtensionContract
                data={data}
            />
        </Modal>
    );
};

export default PrintExtensionContractModal;