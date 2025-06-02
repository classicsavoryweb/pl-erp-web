import Modal from "@/components/common/Modal";
import { PDFViewer } from "@react-pdf/renderer";
import EmploymentStatusReportPDF from "../../pdf/EmploymentStatusReportPDF";

interface FormModalInterface {
    modal: any;
    data: any;
};

const EmploymentStatusModal = ({
    modal,
    data
}: FormModalInterface) => {

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Employment Status Report"
            onClose={() => {
                modal.onClose();
            }}
            size="xxl"
        >
            <EmploymentStatusReportPDF
                data={data}
            />
        </Modal>
    );
};

export default EmploymentStatusModal;