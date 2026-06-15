import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Dropdown from "@/components/common/Dropdown";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useFormik } from "formik";
import { createUniformItem, editUniformItem, getUniformItemOptions } from "@/api/uniform/item-masterlist";
import * as Yup from "yup";
import TextArea from "@/components/common/TextArea";
import { toast } from "react-toastify";
import { createUniformRequestAndIssuance } from "@/api/uniform/request-and-issuance";
import { useAsyncEffect } from "@/hooks/async-effect";
import confirm from "@/components/common/Confirm";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import { useEffect,useState } from "react";
import { getDropDownMasterlist } from "@/api/uniform/request-and-issuance"
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import moment from "moment";

interface UniformRequestFormProps {
    modal: any;
    mode: "create" | "view";
    formValue?: any;
    onSubmitCallback: () => void;
};

const freeOrATD = [
    { label:"Free Uniform", value:"Free Uniform"},
    { label:"Authority To Deduct", value:"Authority To Deduct"},
]

const defaultValues = {
    item_no : "",
    employee_name: "",
    employee_id: "",
    issuance_type: "",
    branch: "",         
    position: "",
    date_hired: "",
    total_amount: 1,
    status: "Unposted",
    sent_email: "No",
    payroll_entry: "",
    payroll_sent_date: "",
    prepared_by: "",
    created_by: "",
    date_requested: "",
    reviewed_by:"",
    date_reviewed:"",
    posted_by:"",
    date_posted:"",
    cancelled_by:"",
    date_cancelled:"",
    cancel_reason:"",
    items:[] as any [],
    
}

const UniformRequestAndIssuanceForm = ({
    modal,
    mode,
    formValue,
    onSubmitCallback,
    
}: UniformRequestFormProps) => {
    const [item , setitem] = useState<any[]>([]);
    const isView = mode === "view";
    const [itemdraft, setitemdraft] = useState({
        item_no: "",
        description: "",
        size:"",
        gender:"",
        stock_on_hand:"",
        requested_quantity: 0,
        remaining_quantity: 0,
        standard_unit:"",
        standard_unit_price:"",
        total_amount: 1,
        item_remarks:"",
        uniform_item_no:""
    });

    useAsyncEffect(() => {
        if (!modal.isShowing) return;

        getDropDownMasterlist()
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching options");
                    return;
                }
                setitem(resp.data.items ?? []);
            })
            .catch(() => toast.error("Error encountered"));
    }, [modal.isShowing]);

    const createFormHandler = useFormik({
        initialValues:defaultValues,        
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_name: Yup.string().required("Name is required."),
            issuance_type: Yup.string().required("Issuance Type is required."),
            branch: Yup.string().required("Branch is required."),
            position: Yup.string().required("Position is required."),
            date_hired: Yup.string().required("Date Hired is required."),
            total_amount: Yup.number().min(1).required("Total Amount is required."),
            status: Yup.string().required("Status is required."),
            sent_email: Yup.string().required("Sent Email is required."),
            items: Yup.array()
                .min(1, "At least one request item is required.")
                .max(20, "A request can contain at most 20 items.")
                .of(Yup.object({
                    item_no: Yup.string().required(),
                    requested_quantity: Yup.number().integer().min(1).required(),
                })),
        }),
        
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Create Uniform Request",
                message: "Are you sure you want to create this request?"
            });

             if (!isConfirmed) return;

             setSubmitting(true);

             const payload = {
                ...values,
                items: values.items,
            };

            const submitter = mode === "create"
                ? createUniformRequestAndIssuance(payload)
                : editUniformItem(payload, formValue.id);

            submitter
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(mode === "create" ? "Request Created Successfully" : "");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                })
                .catch((err) => {
                    toast.error("Request failed - check console");
                });
        }
    });
 

    useEffect(() => {
            if (!modal.isShowing) return;
    
            if (mode === "view" && formValue) {
                createFormHandler.setValues({
                    item_no:formValue.item_no ?? "",
                    employee_name: formValue.employee_name ?? "",
                    employee_id: formValue.employee_id ?? "",
                    issuance_type: formValue.issuance_type ?? "",
                    branch: formValue.branch ?? "",
                    position: formValue.position ?? "",
                    date_hired: formValue.date_hired ?? "",
                    total_amount: Number(formValue.total_amount ?? 1),
                    status: formValue.status ?? "Unposted",
                    sent_email: formValue.sent_email ?? "no",
                    payroll_entry: formValue.payroll_entry ?? "",
                    payroll_sent_date: formValue.payroll_sent_date ?? "",
                    prepared_by: formValue.prepared_by ?? "",
                    created_by: formValue.created_by ?? "",
                    date_requested: formValue.date_requested ?? "",
                    reviewed_by:formValue.reviewed_by ?? "",
                    date_reviewed:formValue.date_reviewed ?? "",
                    posted_by:formValue.posted_by ?? "",
                    date_posted:formValue.date_posted ?? "",
                    cancelled_by:formValue.cancelled_by ?? "",
                    date_cancelled:formValue.date_cancelled ?? "",
                    cancel_reason:formValue.cancel_reason ?? "",
                    items: formValue.items ?? [],
                    
                });
            } else {
                createFormHandler.setValues(defaultValues);
            }
        }, [modal.isShowing, formValue, mode]);
   
    const addRequest = () => {
        if(!itemdraft.item_no){
            toast.error("Description is required");
            return;
        }

        if(Number(itemdraft.requested_quantity) <= 0){
            toast.error("Requested must be greater that zero");
            return;
        }

        if(Number(itemdraft.requested_quantity) > Number(itemdraft.stock_on_hand)){
            toast.error(`Requested quantity exceeds available stock (${itemdraft.stock_on_hand}).`);
            return;
        }

        if(createFormHandler.values.items.length >= 20){
            toast.error("A request can contain at most 20 items.");
            return;
        }

        const existing = createFormHandler.values.items.some((item: any) =>
        item.item_no === itemdraft.item_no) ;

        if(existing){
            toast.error("Item Description already exist")
            return;
        }
        

        createFormHandler.setFieldValue("items", [
            ...createFormHandler.values.items,
            {
                ...itemdraft,
                description: itemdraft.description || itemdraft.item_no,
                uom: itemdraft.standard_unit,
                unit_price: itemdraft.standard_unit_price,
            },
        ]);
        setitemdraft({item_no:"",description:"",size:"",gender:"",stock_on_hand:"",requested_quantity:0,remaining_quantity:0,
            standard_unit:"",standard_unit_price:"",total_amount:0,item_remarks:"",uniform_item_no:"",
        });

      
    };
    const removeRequest = async (items: any) => {
        const isConfirmed = await confirm({
            title: "Remove Item",
            message: `Are you sure you want to remove ${items.description || items.item_no}?`
        });

        if (!isConfirmed) return;

        createFormHandler.setFieldValue(
            "items",
            createFormHandler.values.items.filter(
                (item: any) => item.item_no !== items.item_no
            )
        );

        toast.success("Item removed successfully");
    };

    const requestItemsColumns = [
        { columnHead: "Type of Uniform", path: "description", columnType: COLUMNTYPES.string },
        { columnHead: "Size", path: "size", columnType: COLUMNTYPES.string },
        { columnHead: "Gender", path: "gender", columnType: COLUMNTYPES.string },
        { columnHead: "Stocks on hand", path: "stock_on_hand", columnType: COLUMNTYPES.string },
        { columnHead: "Requested Quantity", path: "requested_quantity", columnType: COLUMNTYPES.string },
        { columnHead: "Remaining Quantity", path: "remaining_quantity", columnType: COLUMNTYPES.string },
        { columnHead: "UOM", path: "uom", columnType: COLUMNTYPES.string },
        { columnHead: "Unit Price", path: "unit_price", columnType: COLUMNTYPES.string },
        { columnHead: "Total Amount ", path: "total_amount", columnType: COLUMNTYPES.string },
        { columnHead: "Item Remarks", path: "item_remarks", columnType: COLUMNTYPES.string },
        ...(!isView ? [{
            columnHead: "Action",
            path: "item_no",
            columnType: COLUMNTYPES.function,
            function: (requestItem: any) => (
                <button
                    type="button"
                    className="font-medium text-red-800 hover:text-red-700 hover:underline cursor-pointer"
                    onClick={() => removeRequest(requestItem)}
                >
                    Remove
                </button>
            ),
        }] : []),
    ];
        
    
    const grandTotal = createFormHandler.values.items.reduce(
        (sum: number, item: any) => sum + Number(item.total_amount || 0),
        0
    );
    
    return (
        <Modal
            isShowing={modal.isShowing}
            title={mode === "create" ? "Create Request" : "View Request"}
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size={mode === "create" ? "xxl" : "lg"}
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                
                    <EmployeeDropDown
                        label="Name"
                        placeholder="select employee"
                        name="employee_name"
                        value={createFormHandler.values.employee_id}
                        error={createFormHandler.errors.employee_id}
                        disabled={isView}
                        required
                        onChange={(event: any) => {
                            const employee = event.target.obj;

                            createFormHandler.setFieldValue(
                                "employee_id",
                                employee.employee_number
                            );

                            createFormHandler.setFieldValue(
                                "employee_name",
                                employee.full_name
                            );

                            createFormHandler.setFieldValue(
                                "branch",
                                employee?.current_branch?.name ?? ""
                            );

                            createFormHandler.setFieldValue(
                                "position",
                                employee?.current_position?.description ?? ""
                            );

                            createFormHandler.setFieldValue(
                                "date_hired",
                                employee?.date_hired ?? ""
                            );
                        }}
                    />
                <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                    <Dropdown
                        label="Issuance Type"
                        placeholder="select option"
                        name="issuance_type"
                        value={createFormHandler.values.issuance_type}
                        required
                        onChange={createFormHandler.handleChange}
                        error={createFormHandler.errors.issuance_type}
                        options={freeOrATD}
                        disabled={isView}
                    />
                    <Textfield
                        label="Branch"
                        placeholder="branch"
                        name="employee_branch"
                        value={createFormHandler.values.branch ?? ""}
                        error={createFormHandler.errors.branch}
                        disabled
                    />
                    <Textfield
                        label="Position"
                        placeholder="position"
                        name="employee_position"
                        value={createFormHandler.values.position ?? ""}
                        error={createFormHandler.errors.position}
                        disabled
                    />
                    <Textfield
                        label="Date Hired"
                        placeholder="date hired"
                        name="employee_date_hired"
                        value={createFormHandler.values.date_hired ?? ""}
                        error={createFormHandler.errors.date_hired}
                        disabled
                    />
                    <Textfield
                        label="Total"
                        placeholder="total amount"
                        name="total_amount"
                        value={grandTotal.toFixed(2)}
                        disabled
                    />
                </div>
                {mode === "view" && (
                    <Table
                        dataSet={createFormHandler.values.items}
                        columnSettings={requestItemsColumns}
                        smallText
                        dataKey="item_no"
                    />
                )}
                {mode === "create" ? null : (  
                <div>
                    <hr className="mt-6 pb-2 text-slate-300" /> 
                    <p>Report Log:</p>          
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                    <Textfield
                        label="Prepared By:"
                        name="created_by"
                        value={createFormHandler.values.created_by ?? ""}
                        error={createFormHandler.errors.created_by}
                        disabled                       
                    />
                 <Textfield
                        label="Date & Time"
                        value={
                            createFormHandler.values.date_requested
                                ? moment(createFormHandler.values.date_requested).format("MMMM DD, YYYY h:mm A")
                                : "-"
                        }
                        disabled
                    />   
                    <Textfield
                        label="Reviewed By:"
                        name="reviewed_by"
                        value={createFormHandler.values.reviewed_by ?? ""}
                        error={createFormHandler.errors.reviewed_by}
                        disabled                       
                    />
                 <Textfield
                        label="Date & Time"
                        value={
                            createFormHandler.values.date_reviewed
                                ? moment(createFormHandler.values.date_reviewed).format("MMMM DD, YYYY h:mm A")
                                : "-"
                        }
                        disabled
                    />   
                    <Textfield
                        label="Posted By:"
                        name="posted_by"
                        value={createFormHandler.values.posted_by ?? ""}
                        error={createFormHandler.errors.posted_by}
                        disabled                       
                    />
                 <Textfield
                        label="Date & Time"
                        value={
                            createFormHandler.values.date_posted
                                ? moment(createFormHandler.values.date_posted).format("MMMM DD, YYYY h:mm A")
                                : "-"
                        }
                        disabled
                    />               
                    <Textfield
                        label="Cancelled By:"
                        name="created_by"
                        value={createFormHandler.values.cancelled_by ?? ""}
                        error={createFormHandler.errors.posted_by}
                        disabled                       
                    />
                    <Textfield
                        label="Date & Time"
                        value={
                            createFormHandler.values.date_cancelled
                                ? moment(createFormHandler.values.date_cancelled).format("MMMM DD, YYYY h:mm A")
                                : "-"
                        }
                        disabled
                    />       
                    </div>
                    <div>
                        <TextArea
                            label="Cancel Reason"
                            name="cancel_reason"
                            value={createFormHandler.values.cancel_reason ?? ""}
                            error={createFormHandler.errors.cancel_reason}
                            disabled
                        />
                    </div>
                    
                </div>
                )}
                {mode === "view" ? null : (
                <div>
                    <div className="flex mt-4 font-semibold border-b border-slate-300 pb-1 mb-1 items-center justify-between">
                        <span>Request Items</span>
                        <button
                            type="button"
                            className="text-sm font-medium text-red-800 hover:text-red-700 hover:underline cursor-pointer"
                            onClick={addRequest}
                        >
                            Add Request
                        </button>
                    </div>
                    <SearchableDropDown
                        label="Description"
                        placeholder="select description"
                        name="vendor_no"
                        value={itemdraft.item_no}
                        disabled={isView}
                        onChange={(e: any) => {
                            const selected = e.target.obj;

                            setitemdraft({
                                ...itemdraft,
                                item_no: selected?.item_no ?? "",
                                uniform_item_no: selected?.item_no ?? "", 
                                description: selected?.description ?? "",
                                gender: selected?.gender?.code ?? "",
                                stock_on_hand: selected?.stock_on_hand ?? "",
                                size: selected?.size?.description ?? "",
                                standard_unit: selected?.standard_unit ?? "",
                                standard_unit_price: selected?.standard_unit_price ?? "",
                            });
                        }}                            
                        options={item.map((item) => ({
                            label: item.description,
                            value: item.item_no,
                            obj: item,
                        }
                        
                    )) }
                    />
                </div>
                )}
                {mode === "view" ? null : (
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Textfield
                        label="Gender"
                        placeholder="Gender"
                        name="gender"
                        value={itemdraft.gender}
                        disabled
                    />
                    <Textfield
                        label="Stocks on hand"
                        placeholder="Stocks on hand"
                        name="stock_on_hand"
                        value={itemdraft.stock_on_hand}
                        disabled
                    />
                
                    <Textfield
                        label="Size"
                        placeholder="Size"
                        name="size"
                        value={itemdraft.size}
                        disabled
                    />
                    <Textfield
                        label="UOM"
                        placeholder="UOM"
                        name="standard_unit"
                        value={itemdraft.standard_unit}
                        disabled
                    />
                    <Textfield
                        label="Unit Price"
                        placeholder="Unit Price"
                        name="standard_unit_price"
                        value={itemdraft.standard_unit_price}
                        disabled
                    />             
                    <Textfield
                        label="Request Quantity"
                        name="request_quantity"
                        type="number"
                        value={itemdraft.requested_quantity}
                        onChange={(e: any) => {
                            const qty = Math.max(0, Number(e.target.value));
                            const unitPrice = Number(itemdraft.standard_unit_price) || 0;
                            const onHand = Number(itemdraft.stock_on_hand);

                            setitemdraft({
                                ...itemdraft,
                                requested_quantity: qty,
                                total_amount: qty * unitPrice,
                                remaining_quantity: onHand - qty,
                            });
                        }}
                    />
                    <Textfield
                        label="Total Amount"
                        placeholder="Total Amount"
                        name="item_total_amount"
                        value={Number(itemdraft.total_amount || 0).toFixed(2)}
                        disabled
                    />
                </div>
                )}
                {mode === "view" ? null : (
                <div>
                <Textfield
                    label="Item Remarks"
                    name="item_remarks"
                    type="text"
                    value={itemdraft.item_remarks}
                    onChange={(e: any) => setitemdraft({ ...itemdraft, item_remarks: e.target.value })}
                />
                </div>
                 )}                                                                                                                                        
                {mode === "view" ? null : (
                <Table
                    dataSet={createFormHandler.values.items}
                    columnSettings={requestItemsColumns}
                    smallText
                    dataKey="item_no"
                />
                )}
                {mode === "view" ? null : (
                    <>
                    <hr className="mt-6 pb-2 text-slate-300" />
                    <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createFormHandler.resetForm();
                               setitemdraft({item_no:"",description:"",size:"",gender:"",stock_on_hand:"",requested_quantity:0,remaining_quantity:0,
                                    standard_unit:"",standard_unit_price:"",total_amount:1,item_remarks:"",uniform_item_no:""
                                });
                                
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={()=>{}}
                        />
                    </div>
                    </div>
                    </>
                )}
            </form>
        </Modal>
    );
};

export default UniformRequestAndIssuanceForm;
