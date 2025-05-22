import Modal from "@/components/common/Modal";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    data: any;
};

const CoePreviewModal = ({
    modal,
    onSubmitCallback,
    data
}: FormModalInterface) => {

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Certificate of Employment"
            onClose={() => {
                modal.onClose();
            }}
            loading={modal.loading}
            size="xxl"
        >
            <p>test</p>
        </Modal>
    );
};

export default CoePreviewModal;