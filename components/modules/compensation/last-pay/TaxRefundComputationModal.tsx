"use client";

import { getTaxRefundComputation } from "@/api/compensation/last-pay";
import Modal from "@/components/common/Modal";
import TaxRefundComputationPDF from "@/components/modules/pdf/TaxRefundComputationPDF";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    data: any;
}

const TaxRefundComputationModal = ({
    modal,
    data,
}: ModalInterface) => {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!modal.isShowing || !data?.id) {
            setReport(null);
            setLoading(false);
            setError(false);
            return;
        }

        setLoading(true);
        setError(false);
        getTaxRefundComputation(data.id)
            .then((resp) => {
                if (!resp?.error) {
                    setReport(resp.data);
                } else {
                    setError(true);
                    toast.error(resp?.data?.message ?? "Error fetching tax refund computation");
                }
            })
            .catch(() => {
                setError(true);
                toast.error("Error fetching tax refund computation");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [modal.isShowing, data?.id]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Tax Refund Computation"
            onClose={modal.onClose}
            loading={loading}
            error={error}
            size="xxl"
        >
            <TaxRefundComputationPDF data={report} />
        </Modal>
    );
};

export default TaxRefundComputationModal;
