import Modal from "@/components/common/Modal";
import EmploymentStatusReportPDF from "../../pdf/EmploymentStatusReportPDF";

interface FormModalInterface {
    modal: any;
    reports: any[];
};

const EmploymentStatusModal = ({
    modal,
    reports
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
                reports={reports}
            />
        </Modal>
    );
};

export default EmploymentStatusModal;