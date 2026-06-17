import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import SearchEmployeeDropDown from "@/components/modules/generic/SearchEmployeeDropDown";
import CSHubTransactionTypeDropDown from "@/components/modules/generic/CSHubTransactionTypeDropDown";
import TextArea from "@/components/common/TextArea";
import TermsDropDown from "@/components/modules/generic/TermsDropDown";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createConverterDetails } from "@/api/compensation/converter";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    data: any;
}

const ViewConverterDetailsModal = ({
    modal,
    data
}: ModalInterface) => {

    return (
        <Modal
            size="md"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
            }}
            title="Transaction Details"
        >
            <Textfield
                label="Employee"
                disabled
                value={data.employee?.full_name ?? ""}
            />
            <Textfield
                label="Transaction Type"
                disabled
                value={data.transaction_type?.description ?? ""}
            />
            <Textfield
                label="Amount"
                disabled
                value={data.amount ?? ""}
            />
            <Textfield
                label="Added By"
                disabled
                value={data.admin_added?.full_name ?? ""}
            />
            <TextArea
                label="Remarks"
                disabled
                value={data.remarks ?? ""}
            />
        </Modal>
    );
};

export default ViewConverterDetailsModal;