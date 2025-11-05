import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useFormik } from "formik";
import * as Yup from "yup";

interface ModalInterface {
    modal: any;
    dataSet: any[];
}

const ViewBatchModal = ({
    modal,
    dataSet = []
}: ModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {

        }
    });

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
                formHandler.resetForm();
            }}
            title="Batch Converter Details"
        >
            <Table
                smallText
                dataSet={dataSet}
                columnSettings={columnSettings}
            />
        </Modal>
    );
};

export default ViewBatchModal;