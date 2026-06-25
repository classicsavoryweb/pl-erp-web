import { useEffect } from "react";
import { useFormik } from "formik";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import Modal from "@/components/common/Modal";
interface WeightAverageItemProps {
    modal: any;
    mode: "view" | "create";
    formValue?: any;
    onSubmitCallback: () => void;
}

const WeightAverageItem = ({
    modal,
    mode,
    formValue,
    onSubmitCallback,
}: WeightAverageItemProps) => {

    const formHandler = useFormik({
        initialValues: {
            uniform_item_no: "",
            total_quantity: "",
            total_amount: "",
            new_standard_price: "",
            standard_difference: "",
            date_received:"",
            standard_uom: "",
            supplier: "",
            crf_no: "",
            document_no: "",
            receiving_no: "",
        },
        onSubmit: () => {},
    });

    const receivingDetails = Array.isArray(formValue?.receiving_details) && formValue.receiving_details.length > 0
        ? formValue.receiving_details
        : [formHandler.values];

    useEffect(() => {
        if (!formValue) return;

        formHandler.setValues({
            uniform_item_no: formValue.uniform_item_no ?? "",
            total_quantity: formValue.total_quantity ?? "",
            total_amount: formValue.total_amount ?? "",
            new_standard_price: formValue.new_standard_price ?? "",
            standard_difference: formValue.standard_difference ?? "",
            standard_uom: formValue.standard_uom ?? "",
            supplier: "",
            date_received: "-",
            crf_no: "",
            document_no: "",
            receiving_no: "",
        });
    }, [formValue]);
    
    const weightAverageItemColumn = [
    { columnHead: "Date Received", path: "date_received", columnType: COLUMNTYPES.date },
    { columnHead: "Quantity", path: "total_quantity", columnType: COLUMNTYPES.string },
    { columnHead: "Standard UOM", path: "standard_uom", columnType: COLUMNTYPES.string },
    { columnHead: "Standard Price", path: "new_standard_price", columnType: COLUMNTYPES.string },
    { columnHead: "Total Net Amount", path: "total_amount", columnType: COLUMNTYPES.string },
    { columnHead: "Supplier", path: "supplier", columnType: COLUMNTYPES.string },
    { columnHead: "CRF", path: "crf_no", columnType: COLUMNTYPES.string },
    { columnHead: "Document Number", path: "document_no", columnType: COLUMNTYPES.string },
    { columnHead: "RI Number", path: "receiving_no", columnType: COLUMNTYPES.string },
    { columnHead: "Transmitted By", path: "transmitted_by", columnType: COLUMNTYPES.string },
    ];

    return (
       <Modal
        isShowing={modal.isShowing}
        title="Item Details"
        onClose={modal.onClose}
        size="xl"
    >
        <div className="p-4">
            <Table
                dataSet={receivingDetails}
                columnSettings={weightAverageItemColumn}
                smallText
                dataKey="receiving_no"
            />
        </div>
    </Modal>
    );
};

export default WeightAverageItem;
