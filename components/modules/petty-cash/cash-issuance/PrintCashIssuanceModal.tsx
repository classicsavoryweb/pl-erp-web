"use client";

import Modal from "@/components/common/Modal";
import { PDFViewer } from "@react-pdf/renderer";
import CashIssuancePDF from "@/components/modules/pdf/CashIssuancePDF";

interface PrintCashIssuanceModalProps {
    modal: any;
    issuance: any;
    custodianName: string;
}

const PrintCashIssuanceModal = ({ modal, issuance, custodianName }: PrintCashIssuanceModalProps) => {
    return (
        <Modal
            isShowing={modal.isShowing}
            title="Print Cash Issuance"
            onClose={modal.onClose}
            size="xxl"
        >
            {modal.isShowing && issuance && (
                <div className="w-full h-[85vh]">
                    <PDFViewer className="w-full h-full">
                        <CashIssuancePDF issuance={issuance} custodianName={custodianName} />
                    </PDFViewer>
                </div>
            )}
        </Modal>
    );
};

export default PrintCashIssuanceModal;
