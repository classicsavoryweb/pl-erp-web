import { useEffect, useState } from "react";
import { useFormik } from "formik";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import moment from "moment";
import Dropdown from "@/components/common/Dropdown";
interface VarianceReportViewItem {
    modal: any;
    formValue?: any;
    
}

const WeightAverageItem = ({
    modal,
    formValue,
}: VarianceReportViewItem) => {
const [filter, setFilter] = useState("All");

    const formHandler = useFormik({
        initialValues: {
            description: "",
            item_no: "",
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

    const request_details = Array.isArray(formValue?.request_details) && formValue.request_details.length > 0
        ? formValue.request_details
        : [formHandler.values];

    useEffect(() => {
        if (!formValue) return;

        formHandler.setValues({
            description:formValue.description ?? "",
            item_no: formValue.item_no ?? "",
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
    { columnHead: "Date Requested", path: "date_requested", columnType: COLUMNTYPES.function,
        function:(data: any) => 
            data.date_requested ? moment(data.date_requested).format("MM/DD/YYYY") : "-"
        
     },
    { columnHead: "Standard UOM", path: "uom", columnType: COLUMNTYPES.string },
    { columnHead: "Total Issuance", path: "quantity", columnType: COLUMNTYPES.string },
    { columnHead: "Employee Name", path: "employee_name", columnType: COLUMNTYPES.string },
    { columnHead: "Position", path: "position", columnType: COLUMNTYPES.string },
    { columnHead: "Branch", path: "branch", columnType: COLUMNTYPES.string },
    { columnHead: "Type of Issuance", path: "issuance_type", columnType: COLUMNTYPES.string },
    { columnHead: "Total Net Amount", path: "total_amount", columnType: COLUMNTYPES.amount },
    ];

   const filteredRequestDetails = request_details.filter((item: any) => {
        if (filter === "All") return true;

        return item.issuance_type === filter;
    });

    return (
       <Modal
        isShowing={modal.isShowing}
        title="Request Details"
        onClose={modal.onClose}
        size="xl"
    >
        <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
                <Textfield 
                    label= "Item Description"
                    name  ="description"
                    value = {formHandler.values.description}
                    disabled
                />
                <Textfield 
                    label="Item Code"
                    name = "item_code"
                    value= {formHandler.values.item_no}
                    disabled
                />
                <Dropdown
                    label="Filter"
                    name="filter"
                    value={filter}
                    onChange={(e: any) => setFilter(e.target.value)}
                    options={[
                        { label: "All", value: "All" },
                        { label: "Authority to Deduct", value: "Authority To Deduct" },
                        { label: "Free Uniform", value: "Free Uniform" },
                    ]}
                />
              
            </div>
            <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                <Table
                    dataSet={filteredRequestDetails}
                    columnSettings={weightAverageItemColumn}
                    smallText
                    dataKey="receiving_no"
                    fixed
                />
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
                <div className="text-xs text-gray-400">
                    Showing {request_details.length}{" "}
                    {request_details.length === 1 ? "item" : "items"}
                </div>

                <div className="flex gap-6 justify-end text-xs text-gray-400">
                    <div className="flex items-center">
                        <span className="font-normal">
                            Total Standard Quantity:
                        </span>
                        <span className="ml-2 mr-2 font-semibold">
                            {request_details
                                .reduce(
                                    (total: number, item: any) =>
                                        total + Number(item.quantity || 0),
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
                            Total Free Uniform:
                        </span>
                        <span className="ml-2 mr-2 font-semibold">
                            {
                                request_details.filter(
                                    (item: any) => item.issuance_type === "Free Uniform"
                                ).length
                            }
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-normal">
                            Total ATD :
                        </span>
                        <span className="ml-2 mr-2 font-semibold">
                            {
                                request_details.filter(
                                    (item: any) => item.issuance_type === "Authority To Deduct"
                                ).length
                            }
                        </span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-normal">
                            Total Amount:
                        </span>
                        <span className="ml-2 mr-2 font-semibold">
                            {request_details
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
