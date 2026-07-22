import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Dropdown from "@/components/common/Dropdown";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextArea from "@/components/common/TextArea";
import { toast } from "react-toastify";
import { createUniformRequestAndIssuance, reviewUniformRequestAndIssuance , updateRequestStatus } from "@/api/uniform/request-and-issuance";
import { useAsyncEffect } from "@/hooks/async-effect";
import confirm from "@/components/common/Confirm";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import { useEffect,useMemo,useState } from "react";
import { getDropDownMasterlist } from "@/api/uniform/request-and-issuance"
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import moment from "moment";
import Badge from "@/components/common/Badge";
import { create } from "lodash";

interface UniformRequestFormProps {
    modal: any;
    mode: "create" | "view" | "review" | "post";
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
    gender: "",
    issuance_type: "",
    branch: "",         
    position: "",
    date_hired: "",
    total_amount: 0,
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
    const [showAllItems , setShowAllItems] = useState(false)
    const isView = mode === "view";
    const isReview = mode === "review";
    const isPost = mode === "post"
    const isCreate = mode === "create";
    type ItemDraft = {
    item_no: string;
    description: string;
    size: string;
    gender: string;
    stock_on_hand: string;
    requested_quantity: number | "",
    remaining_quantity: number;
    standard_unit: string;
    standard_unit_price: string;
    total_amount: number;
    item_remarks: string;
    uniform_item_no: string;
    };
    
    const [itemdraft, setitemdraft] = useState<ItemDraft>({
    item_no: "",
    description: "",
    size: "",
    gender: "",
    stock_on_hand: "",
    requested_quantity: 0,
    remaining_quantity: 0,
    standard_unit: "",
    standard_unit_price: "",
    total_amount: 0,
    item_remarks: "",
    uniform_item_no: "",
    });
 
    const normalizeGender = (gender?: string) => {
        const normalized = (gender ?? "").trim().toLowerCase();

        if (["m", "male"].includes(normalized)) return "male";
        if (["f", "female"].includes(normalized)) return "female";
        if (["n/a", "na", "unisex"].includes(normalized)) return "unisex";

        return normalized;
    };

    const getReviewAvailableStock = (selected: any) => {
        const currentStock = Number(selected?.stock_on_hand ?? 0);

        if (!isReview) return currentStock;

        const originalItem = (formValue?.items ?? []).find((item: any) =>
            (item.item_no ?? item.uniform_item_no) === selected?.item_no
        );

        return currentStock + Number(originalItem?.requested_quantity ?? 0);
    };

    const getFormItems = (items: any[] = []) => {
        return items.map((item: any) => ({
            ...item,
            item_no: item.item_no || item.uniform_item_no || "",
        }));
    };

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
            employee_id: Yup.number().required("Name is required"),
            issuance_type: Yup.string().required("Issuance Type is required."),
            items: Yup.array()
                .min(1, "At least one request item is required.")
                .max(20, "A request can contain at most 20 items.")
                .of(Yup.object({
                    item_no: Yup.string().required(),
                    requested_quantity: Yup.number().integer().min(1).required(),
                })),
        }),
        
        onSubmit: async (values, {resetForm, setSubmitting}) => {
             if (values.items.length === 0) {
                toast.error("Please add at least one request item.");
                return;
            }

            const isConfirmed = await confirm({
                title: isReview
                    ? "Review Uniform Request"
                    : isPost
                    ? "Post Uniform Request"
                    : "Create Uniform Request",
                message: isReview
                    ? "Are you sure you want to save this reviewed request?"
                    :isPost
                    ? "Are you sure you want to post this request?"
                    : "Are you sure you want to create this request?"
            });

             if (!isConfirmed) return;

             setSubmitting(true);

             const payload = {
                ...values,
                items: values.items,
            };

            const submitRequest = async (requestPayload: any) => {
            switch (mode) {
                case "create":
                return createUniformRequestAndIssuance(requestPayload);

                case "review":
                return reviewUniformRequestAndIssuance(formValue.id, requestPayload);

                case "post":
                return updateRequestStatus(formValue.id, "Posted");

                default:
                throw new Error("Invalid mode");
            }
            };
            try {
                let resp = await submitRequest(payload);   
                if (resp.errors) {
                    const firstError = Object.values(resp.errors).flat()?.[0];
                    toast.error(firstError || resp.message || "Request failed");
                    return;
                }
                if (resp.error) {
                    const firstError = Object.values(resp.data?.errors ?? {}).flat()?.[0];
                    toast.error(firstError || resp.data?.message || "Request failed");
                    return;
                }


                toast.success(
                    isReview
                        ? "Request Reviewed Successfully"
                        : isPost
                        ? "Post Successfully"
                        : "Create Request Successfully"
                );

                onSubmitCallback();
                modal.onClose();
                resetForm();
            } finally {
                setSubmitting(false);
            }
        }
    });
       const filteredItems = useMemo(() => {
            if (showAllItems) {
                return item;
            }
            const employeeGender = normalizeGender(createFormHandler.values.gender);
            const issuanceType = createFormHandler.values.issuance_type;

            return item.filter((record) => {
                const itemGender = normalizeGender(
                    record?.gender?.code ?? record?.gender?.description
                );

                const genderMatch =
                    !employeeGender ||
                    !itemGender ||
                    itemGender === "unisex" ||
                    itemGender === employeeGender;

                const issuanceMatch =
                    issuanceType === "Free Uniform"
                        ? record.free_uniform === true
                        : true;

                return genderMatch && issuanceMatch;
            });
        }, [
            item,
            showAllItems,
            createFormHandler.values.gender,
            createFormHandler.values.issuance_type,
        ]);
    

    useEffect(() => {
            if (!modal.isShowing) return;
    
            if ((mode === "view" || mode === "review" || mode === "post") && formValue) {
                createFormHandler.setValues({
                    item_no:formValue.item_no ?? "",
                    employee_name: formValue.employee_name ?? "",
                    employee_id: formValue.employee_id ?? "",
                    gender: formValue.gender ?? "",
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
                    items: getFormItems(formValue.items),
                    
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

        const totalAmount = createFormHandler.values.items.reduce(
        (sum: number, item: any) => sum + Number(item.total_amount || 0),
        0
    );

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
        {
    columnHead: "Requested Quantity",
    path: "requested_quantity",
    columnType: (isReview || isCreate)
        ? COLUMNTYPES.function
        : COLUMNTYPES.string,

    function: (row: any) => {
        if (isReview && isCreate) {
            return row.requested_quantity;
        }

        const items = createFormHandler.values.items;

        const current = items.find(
            (i: any) => i.item_no === row.item_no
        );

        return (
            <Textfield
                label=""
                type="number"
                value={
                    current?.requested_quantity === 0
                        ? ""
                        : current?.requested_quantity ?? ""
                }
                onChange={(e: any) => {
                    const value = e.target.value;
                    const qty = value === "" ? 0 : Number(value);

                    const updated = items.map((i: any) => {
                        if (i.item_no !== row.item_no) return i;

                        const stock = Number(i.stock_on_hand || 0);
                        const price = Number(i.unit_price || 0);

                        return {
                            ...i,
                            requested_quantity: qty,
                            remaining_quantity: stock - qty,
                            total_amount: qty * price,
                        };
                    });

                    createFormHandler.setFieldValue("items", updated);
                }}
            />
        );
    }
},
        { columnHead: "Remaining Quantity", path: "remaining_quantity", columnType: COLUMNTYPES.string },
        { columnHead: "UOM", path: "uom", columnType: COLUMNTYPES.string },
        { columnHead: "Unit Price", path: "unit_price", columnType: COLUMNTYPES.string },
        { columnHead: "Total Amount ", path: "total_amount", columnType: COLUMNTYPES.amount },
        { columnHead: "Item Remarks", path: "item_remarks", columnType: COLUMNTYPES.string }, 
        ...(!isView && !isPost? [{
            columnHead: "Action",
            path: "item_no",
            columnType: COLUMNTYPES.function,
            function: (requestItem: any) => (
                <button
                    type="button"
                    className="font-medium text-red-400 hover:text-red-200 hover:underline cursor-pointer"
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
    const getStatusBadge = (status: string): "success" | "warning" | "danger" | "default" => {
        switch (status) {
            case "Posted":
                return "success";
            case "Reviewed":
                return "warning";
            case "Cancelled":
                return "danger";
            default:
                return "default";
        }
    };
    
    return (
        <Modal
            isShowing={modal.isShowing}
            title={mode === "create" ? "Create Request" : isReview ? "Review Request" : isPost ? "Post Request" : "View Request" }
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
                setitemdraft({item_no:"",description:"",size:"",gender:"",stock_on_hand:"",requested_quantity:0,remaining_quantity:0,
                    standard_unit:"",standard_unit_price:"",total_amount:0,item_remarks:"",uniform_item_no:"",
                });
            }}
            loading={modal.loading}
            size={mode === "create" || isReview || isPost ? "xxl" : "lg"}
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <div className="grid grid-cols-4 gap-1 items-end">
                    <div className="col-span-3">
                        <EmployeeDropDown
                            label="Name"
                            placeholder="select employee"
                            name="employee_name"
                            value={createFormHandler.values.employee_id}
                            error={createFormHandler.errors.employee_id}
                            disabled={isView || isPost || isReview}
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
                                    "gender",
                                    employee?.gender ?? ""
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

                                createFormHandler.setFieldValue("items", []);
                                setitemdraft({item_no:"",description:"",size:"",gender:"",stock_on_hand:"",requested_quantity:0,remaining_quantity:0,
                                    standard_unit:"",standard_unit_price:"",total_amount:0,item_remarks:"",uniform_item_no:"",
                                });
                            }}
                        />
                    </div>
                     {mode !== "create"  &&  ( 
                   <div className="col-span-1 w-full flex justify-center">
                        <div className="scale-170 -translate-y-3">
                            <Badge
                                status={getStatusBadge(createFormHandler.values.status)}
                                label={createFormHandler.values.status}
                            />
                        </div>
                    </div>
                    )}
                </div>
                <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                    
                    <Dropdown
                        label="Issuance Type"
                        placeholder="select option"
                        name="issuance_type"
                        value={createFormHandler.values.issuance_type}
                        required
                        onChange={async (e: any) => {
                            const newValue = e.target.value;
                            if (createFormHandler.values.items.length > 0) {
                                const confirmed = await confirm({
                                    title: "Change Issuance Type",
                                    message: "Changing the issuance type will remove all added request items. Continue?",
                                });

                                if (!confirmed) return;
                            }
                             createFormHandler.setFieldValue("issuance_type", newValue);
                            createFormHandler.setFieldValue("items", []);
                            setitemdraft({
                                item_no: "",
                                description: "",
                                size: "",
                                gender: "",
                                stock_on_hand: "",
                                requested_quantity: 0,
                                remaining_quantity: 0,
                                standard_unit: "",
                                standard_unit_price: "",
                                total_amount: 0,
                                item_remarks: "",
                                uniform_item_no: "",
                            });
                        }}
                        error={createFormHandler.errors.issuance_type}
                        options={freeOrATD}
                        disabled={isView || isPost || isReview || !createFormHandler.values.employee_id }
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
                        value={createFormHandler.values.date_hired ? moment(createFormHandler.values.date_hired).format("MM/DD/YY") : ""}
                        error={createFormHandler.errors.date_hired}
                        disabled
                    /> 
                   
                </div>
                {mode === "view" && (
                    <div>
                        <Table
                            dataSet={createFormHandler.values.items}
                            columnSettings={requestItemsColumns}
                            smallText
                            dataKey="item_no"
                        />
                        <div className="flex justify-between items-center text-sm">
                            <div className="text-xs text-gray-400">
                                {(createFormHandler.values.items?.length ?? 0)}{" "}
                                {(createFormHandler.values.items?.length ?? 0) === 1 ? "item" : "items"}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-xs">Total Amount:</span>
                                <span className="font-semibold text-sm text-gray-400">
                                    {totalAmount.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                )}
             
                {mode !== "review" && mode !== "create" && mode!=="post" &&  ( 
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
                    <Textfield
                        label="Payroll Entry:"
                        name="created_by"
                        value={createFormHandler.values.cancelled_by ?? ""}
                        error={createFormHandler.errors.posted_by}
                        disabled                       
                    />
                    <Textfield
                        label="Payroll send Date"
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
                {mode === "view" ? null :  mode!=="post" &&  (
                <div>
                    <div className="flex mt-4 font-semibold border-b border-slate-300 pb-1 mb-1 items-center justify-between">
                        <span>Request Items</span>
                    </div>
                    <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-6 items-end">
                        <div className="lg:col-span-5">
                            <SearchableDropDown
                                label="Description"
                                placeholder="select description"
                                name="vendor_no"
                                value={itemdraft.item_no}
                                disabled={
                                    isView ||
                                    !createFormHandler.values.employee_id ||
                                    !createFormHandler.values.issuance_type
                                }
                                onChange={(e: any) => {
                                    const selected = e.target.obj;
                                    const stockOnHand = getReviewAvailableStock(selected);

                                    setitemdraft({
                                        ...itemdraft,
                                        item_no: selected?.item_no ?? "",
                                        uniform_item_no: selected?.item_no ?? "",
                                        description: selected?.description ?? "",
                                        gender: selected?.gender?.code ?? "",
                                        stock_on_hand: String(stockOnHand),
                                        size: selected?.size?.description ?? "",
                                        standard_unit: selected?.standard_unit ?? "",
                                        standard_unit_price: selected?.standard_unit_price ?? "",
                                    });
                                }}
                                options={filteredItems.map((item) => ({
                                    label: `${item.description}-(${item.gender?.code})-${item.size?.description}`,
                                    value: item.item_no,
                                    obj: item,
                                }))}
                            />
                        </div>
                        <div className="lg:col-span-1 flex items-end h-full pb-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 cursor-pointer hover:text-red-600">
                                <input
                                    type="checkbox"
                                    checked={showAllItems}
                                    disabled={
                                        isView ||
                                        !createFormHandler.values.employee_id ||
                                        !createFormHandler.values.issuance_type
                                    }
                                    onChange={(e) => setShowAllItems(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-400 text-red-600 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <span>Show All</span>
                            </label>
                        </div>
                    </div>
                </div>
                )}
                {mode === "view" ? null : mode!=="post" &&  (
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
                        value={itemdraft.requested_quantity === ""
                                ? ""
                                : itemdraft.requested_quantity
                        }
                        onChange={(e: any) => {
                            const value = e.target.value;

                            const qty =
                                value === "" ? "" : Math.max(1, Number(value));

                            setitemdraft({
                                ...itemdraft,
                                requested_quantity: qty,
                                total_amount:
                                    qty === "" ? 0 : Number(qty) * Number(itemdraft.standard_unit_price || 0),
                                remaining_quantity:
                                    qty === "" ? 0 : Number(itemdraft.stock_on_hand) - Number(qty),
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
                <div  className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-4">
                   
                    <div className = "lg:col-span-3">
                        <Textfield
                            label="Item Remarks"
                            name="item_remarks"
                            type="text"
                            value={itemdraft.item_remarks}
                            disabled = {isPost}
                            onChange={(e: any) => setitemdraft({ ...itemdraft, item_remarks: e.target.value })}
                        />
                    </div>
                    {mode === "post" ? null : (
                    <div className="lg:col-span-1 mt-3">
                        <Button
                            type="button"
                            label="Add Request"
                            onClick={addRequest}
                        />
                    </div>
                    )}
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
               <div className="flex justify-between items-center text-sm">
                    <div className="text-xs text-gray-400">
                        {(createFormHandler.values.items?.length ?? 0)}{" "}
                        {(createFormHandler.values.items?.length ?? 0) === 1 ? "item" : "items"}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Total Amount:</span>
                        <span className="font-semibold text-sm">
                            {totalAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                </div>
                {mode === "view" ? null : (
                    <>
                    <hr className="mt-6 pb-2 text-slate-300" />
                    <div className="flex justify-end">
                        <div className="w-[120px]">
                            <Button
                                type="submit"
                                label={mode === "create" ? "Submit" 
                                    :mode === "review" ? "Review"
                                    :mode === "post" ? "Post"
                                    : "Submit"
                                }
                                loading={createFormHandler.isSubmitting}
                                onClick={async () => {
                                    const errors = await createFormHandler.validateForm();

                                    if (errors.items) {
                                        toast.error(errors.items as string);
                                        return;
                                    }

                                    createFormHandler.handleSubmit();
                                }}
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
