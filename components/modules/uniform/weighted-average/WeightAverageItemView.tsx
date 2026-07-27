import { useEffect } from "react";
import { useFormik } from "formik";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import moment from "moment";
interface WeightAverageItemProps {
    modal: any;
    formValue?: any;
    
}

const WeightAverageItem = ({
    modal,
    formValue,
}: WeightAverageItemProps) => {

    const formHandler = useFormik({
        initialValues: {
            description: "",
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
            description:formValue.description ?? "",
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
    { columnHead: "Date Received", path: "date_received", columnType: COLUMNTYPES.function,
        function:(data: any) => 
            data.date_received ? moment(data.date_received).format("MM/DD/YYYY") : "-"
        
     },
    { columnHead: "Quantity", path: "total_quantity", columnType: COLUMNTYPES.string },
    { columnHead: "Standard UOM", path: "standard_uom", columnType: COLUMNTYPES.string },
    { columnHead: "Standard Price", path: "new_standard_price", columnType: COLUMNTYPES.amount },
    { columnHead: "Total Net Amount", path: "total_amount", columnType: COLUMNTYPES.amount },
    { columnHead: "Supplier", path: "supplier", columnType: COLUMNTYPES.string },
    { columnHead: "CRF", path: "crf_no", columnType: COLUMNTYPES.string },
    { columnHead: "Document Number", path: "document_no", columnType: COLUMNTYPES.string },
    { columnHead: "RI Number", path: "receiving_no", columnType: COLUMNTYPES.string },
    ];

    return (
       <Modal
        isShowing={modal.isShowing}
        title="Item Details"
        onClose={modal.onClose}
        size="xl"
    >
        <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
                <Textfield 
                    label= "Item Description"
                    name  ="description"
                    value = {formHandler.values.description}
                    disabled
                />
                <Textfield 
                    label="Item Code"
                    name = "item_code"
                    value= {formHandler.values.uniform_item_no}
                    disabled
                />
            </div>
            <Table
                dataSet={receivingDetails}
                columnSettings={weightAverageItemColumn}
                smallText
                dataKey="receiving_no"
            />
            <div className="flex justify-between items-center mt-1 text-sm">
                <div className="text-xs text-gray-400">
                    Showing {receivingDetails.length}{" "}
                    {receivingDetails.length === 1 ? "item" : "items"}
                </div>

                <div className="flex gap-6 justify-end text-xs text-gray-400">
                    <div className="flex items-center">
                        <span className="font-normal">
                            Total Standard Quantity:
                        </span>
                        <span className="ml-2 mr-2 font-semibold">
                            {receivingDetails
                                .reduce(
                                    (total: number, item: any) =>
                                        total + Number(item.new_standard_price || 0),
                                    0
                                )
                                .toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-normal">
                            Total Amount:
                        </span>
                        <span className="ml-2 mr-2 font-semibold">
                            {receivingDetails
                                .reduce(
                                    (total: number, item: any) =>
                                        total + Number(item.total_amount || 0),
                                    0
                                )
                                .toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
    );
};

export default WeightAverageItem;
