import Badge from "@/components/common/Badge";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { formatNumber } from "@/helper/amount";
import { useFormik } from "formik";
import * as Yup from "yup";

interface ModalInterface {
    modal: any;
    dataSet: any[];
    onCloseCallBack: () => void;
}

const ViewExcludedTransactions = ({
    modal,
    dataSet = [],
    onCloseCallBack
}: ModalInterface) => {

    const columnSettings = [
        {
            columnHead: "Date Created",
            path: "created_at",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Employee",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Transaction Type",
            path: "transaction_type.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        ];

    return (
        <Modal
            size="lg"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
                onCloseCallBack();
            }}
            title={"Transactions Removed from the Batch"}
        >
            <p className="mt-3">Details</p>
            <div className="max-h-[500px] overflow-hidden overflow-y-auto">
                <Table
                    smallText
                    dataSet={dataSet}
                    columnSettings={columnSettings}
                />
            </div>
        </Modal>
    );
};

export default ViewExcludedTransactions;