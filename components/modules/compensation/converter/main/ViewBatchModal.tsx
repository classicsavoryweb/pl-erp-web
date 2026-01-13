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
    data: any;
}

const ViewBatchModal = ({
    modal,
    dataSet = [],
    data = {}
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
            title={data?.batch_number ?? ""}
        >
            <div className="flex justify-end pb-2">
                <Badge
                    label={data?.status ?? ""}
                    status={data?.status == "Generated" ? "success" : "warning"}
                />
            </div>
            <Grid cols={2}>
                <Textfield
                    label="Count"
                    disabled
                    value={data?.count ?? 0}
                />
                <Textfield
                    label="Total Amount"
                    disabled
                    value={formatNumber(data?.total_amount ?? 0)}
                />
            </Grid>
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

export default ViewBatchModal;