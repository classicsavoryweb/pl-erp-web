"use client";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { useAsyncEffect } from "@/hooks/async-effect";
import TextArea from "@/components/common/TextArea";
import { useApiCall } from "@/hooks/api-call";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useModal } from "@/hooks/modal";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getDropDownMasterlist } from "@/api/uniform/request-and-issuance"
import { createWeightAverage , getWeightAverageItems , getWeightAverageById } from "@/api/uniform/weighted-average";
import moment from "moment";
import  WeightedAverageItem  from "./WeightAverageItemView";

interface WeightAverageFormProps{
    modal: any;
    mode: "create" | "view";
    formValue?: any;
    onSubmitCallback: () => void;
}

const tagSelectionDropDown = [
    {label:"Items with Purchases" , value:"Items with Purchases"},
    {label:"Items without Purchases" , value:"Items without Purchases"},
    {label:"Check All" , value:"Check All"}
]

const defaultValues = {
    tag : "",
    date_posted: moment().format("YYYY-MM-DD"),
    date_from: moment().format("YYYY-MM-DD"),
    date_to: moment().format("YYYY-MM-DD"),
    status : "",
    overall_remarks:"",
    prepared_by : "",
    prepared_at : "",
    reviewed_by : "",
    reviewed_at : "",
    posted_by : "",
    posted_at : "",
    cancelled_by : "",
    cancelled_at : "",
    cancel_reason : "",
    items:[] as any [],
}

const WeightedAverageForm = ({
    
    modal,
    mode,
    formValue,
    onSubmitCallback,
}: WeightAverageFormProps) => {
    const [ item, setitem ] = useState<any[]>([]);
    const api = useApiCall();
    const isView = mode == "view";
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;
    
    const viewItemModal = useModal();
    const additionalChargeModal = useModal();
    const [chargeDraft, setChargeDraft] = useState({
        index: -1,
        additional_charge: "",
        reason: "",
    });
    const [itemdraft , setitemdraft]  = useState({
        weighted_id_number : "",
        uniform_item_no : "",
        description : "",
        standard_uom : "",
        current_price : "",
        total_quantity : "",
        standard_uom_two : "",
        total_amount : "",
        new_standard_price : "",
        other_charges : "",
        standard_difference : "",
        reason : "",
    });
    useAsyncEffect(() => {
        if(!modal.isShowing) return;
        getDropDownMasterlist()
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching options");
                    return;
                }
            setitem(resp.data.items ?? []);
            })
            .catch(() => toast.error("Error encountered"));
    },[modal.isShowing]);

    const createFormHandler = useFormik({
        initialValues  :defaultValues,
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            tag:Yup.string().required("Tag is Required."),
            date_posted: Yup.string()
            .required("Date Posted is Required")
            .test(
                    "not-future",
                    "Posting Date cannot be later than today",
                    function (value) {
                        if (!value) return false;

                        return moment(value).isSameOrBefore(
                            moment().format("YYYY-MM-DD"),
                            "day"
                        );
                    }
                ),
            date_from:Yup.string()
            .required("Date From is Required")
            .test(
                    "not-future",
                    "Date From cannot be later than today",
                    function (value) {
                        if (!value) return false;

                        return moment(value).isSameOrBefore(
                            moment().format("YYYY-MM-DD"),
                            "day"
                        );
                    }
                ),
            date_to:Yup.string()
            .required("Date From is Required")
            .test(
                    "not-future",
                    "Date To cannot be later than today",
                    function (value) {
                        if (!value) return false;

                        return moment(value).isSameOrBefore(
                            moment().format("YYYY-MM-DD"),
                            "day"
                        );
                    }
                ),
            overall_remarks:Yup.string().nullable(),
            items:Yup.array()
                .min(1,"At least one item is required")
                .max(40,"A contain maximum is 40.")
                .of(Yup.object({
                    item_no: Yup.string().required(),
                    item_remarks : Yup.string().nullable(),
                    new_standard_price : Yup.string().required()
                })),
        }),

        onSubmit: async (values , {resetForm, setSubmitting}) =>{
            const isConfirmed = await confirm({
                title: " Generate Weight Average",
                message: "Are you sure you want to generate weight average?"
            });

            if(!isConfirmed) return;
            
            setSubmitting(true);
            const payload = {
                ...values,
                items: values.items,
            };
            const submitter = mode == "create"
            ? createWeightAverage(payload) : Promise.resolve(null);;

            submitter
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(mode === "create" ? "Weight Average Created Successfully" : "");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    }else{
                        toast.error(resp.data.message);
                    }
                })
                .catch((err) => {
                    toast.error("Request failed")
                });
        }
        
    });
    const items = createFormHandler.values.items || [];

    const paginatedItems = items.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const paginator = {
        paginationData: {
            current_page: currentPage,
            last_page: Math.ceil(items.length / perPage),
            total: items.length,
            from: items.length === 0 ? 0 : (currentPage - 1) * perPage + 1,
            to: Math.min(currentPage * perPage, items.length),
        },
        onClickSetPageNumber: (page: number) => {
            setCurrentPage(page);
        },
    };
    
    useEffect(() => {
        if(!modal.isShowing) return;

        if(mode === "view" && formValue){
            createFormHandler.setValues({
                tag : formValue.tag ?? "",
                date_posted: formValue.date_posted ?? "",
                date_from : formValue.date_from ?? "",
                date_to : formValue.date_to ?? "",
                status : formValue.status ?? "",
                overall_remarks : formValue.overall_remarks ?? "",
                prepared_by : formValue.prepared_by ?? "",
                prepared_at : formValue.prepared_at ?? "",
                reviewed_by : formValue.reviewed_by ?? "",
                reviewed_at : formValue.reviewed_at ?? "",
                posted_by : formValue.posted_by ?? "",
                posted_at : formValue.posted_at ?? "",
                cancelled_by : formValue.cancelled_by ?? "",
                cancelled_at : formValue.cancelled_at ?? "",
                cancel_reason : formValue.cancel_reason ?? "",
                items: formValue.items ?? [],
            });
        }else{
            createFormHandler.setValues(defaultValues);
        }
    },[modal.isShowing, formValue, mode]);

    const addWeightAverage = () =>{
        if(!itemdraft.uniform_item_no){
            toast.error("Description is Required");
            return;
        }
        if(createFormHandler.values.items.length >= 40){
            toast.error("A request can contain at most 20 items.");
            return;
        }
        const existing = createFormHandler.values.items.some((item: any) =>
        item.item_no === itemdraft.uniform_item_no) ;

        if(existing){
            toast.error("Item Description already exist")
            return;
        }

        createFormHandler.setFieldValue("items",[
            ...createFormHandler.values.items,
            {
                ...itemdraft,
                description: itemdraft.description || itemdraft.uniform_item_no
            }
        ]);
        setitemdraft({
            weighted_id_number:"",uniform_item_no: "",description: "",standard_uom:"",current_price:"",total_quantity:"",standard_uom_two:"",total_amount:"",new_standard_price:"",other_charges:"",standard_difference:"",reason:"",
        });
    };
    
    const generateItems = async () => {
    try {
        const resp = await getWeightAverageItems({
            date_from: createFormHandler.values.date_from,
            date_to: createFormHandler.values.date_to,
            tag: createFormHandler.values.tag,
        });
        const rows = resp?.data ?? [];

        if (!Array.isArray(rows) || rows.length === 0) {
            toast.info("No data found");
            createFormHandler.setFieldValue("items", []);
            return;
        }

        if (!Array.isArray(rows)) {
            console.error("Invalid rows format:", rows);
            toast.error("Invalid response format");
            return;
        }

        const mapped = rows.map((row: any) => ({
            item_no: row.item_no,
            uniform_item_no: row.uniform_item_no,
            description: row.description,
            standard_uom: row.standard_uom,
            current_price: row.current_price,
            total_quantity: row.total_quantity,
            standard_uom_two: row.standard_uom_two,
            total_amount: row.total_amount,
            new_standard_price: row.new_standard_price,
            other_charges: row.other_charges,
            standard_difference: row.standard_difference,
            reason: row.reason,
        }));

        createFormHandler.setFieldValue("items", mapped);
        toast.success("Items loaded successfully");
    } catch (err) {
        console.error(err);
        toast.error("Failed to load items");
    }
};

    const openAdditionalCharge = (requestItem: any) => {
        const index = createFormHandler.values.items.findIndex((item: any) =>
            item.item_no === requestItem.item_no
        );

        if (index < 0) return;

        setChargeDraft({
            index,
            additional_charge: String(requestItem.other_charges ?? ""),
            reason: requestItem.reason ?? "",
        });
        additionalChargeModal.onOpen();
    };

    const saveAdditionalCharge = () => {
        const additionalCharge = Number(chargeDraft.additional_charge || 0);

        if (Number.isNaN(additionalCharge) || additionalCharge < 0) {
            toast.error("Additional charge must be zero or greater");
            return;
        }

        if (additionalCharge > 0 && !chargeDraft.reason.trim()) {
            toast.error("Reason is required when additional charge is not zero");
            return;
        }

        const rows = [...createFormHandler.values.items];
        const row = rows[chargeDraft.index];

        if (!row) return;

        const totalAmount = Number(row.total_amount || 0);
        const totalQuantity = Number(row.total_quantity || 0);
        const currentPrice = Number(row.current_price || 0);
        const baseStandardPrice = totalQuantity > 0 ? totalAmount / totalQuantity : 0;
        const newStandardPrice = baseStandardPrice + additionalCharge;

        rows[chargeDraft.index] = {
            ...row,
            other_charges: additionalCharge.toFixed(2),
            new_standard_price: newStandardPrice.toFixed(2),
            standard_difference: (newStandardPrice - currentPrice).toFixed(2),
            reason: chargeDraft.reason,
            item_remarks: chargeDraft.reason,
        };

        createFormHandler.setFieldValue("items", rows);
        additionalChargeModal.onClose();
    };

    const weightAverageColumn =[
        {columnHead: "Item Code" , path: "uniform_item_no" , columnType:COLUMNTYPES.string },
        {columnHead: "Item Description" , path: "description" , columnType:COLUMNTYPES.string },
        {columnHead: "Standard UOM" , path: "standard_uom" , columnType:COLUMNTYPES.string },
        {columnHead: "Current Standard Price" , path: "current_price" , columnType:COLUMNTYPES.string },
        {columnHead: "Total Quantity" , path: "total_quantity" , columnType:COLUMNTYPES.string },
        {columnHead: "Standard UOM" , path: "standard_uom" , columnType:COLUMNTYPES.string },
        {columnHead: "Total Amount" , path: "total_amount" , columnType:COLUMNTYPES.string },
        {columnHead: "New Standard Price" , path: "new_standard_price" , columnType:COLUMNTYPES.string },
        {columnHead: "Additional Charges" , path: "other_charges" , columnType:COLUMNTYPES.string },
        {columnHead: "Standard Price Differences" , path: "standard_difference" , columnType:COLUMNTYPES.string },
        ...(!isView ? [{
            columnHead: "Action",
            path: "uniform_item_no",
            columnType: COLUMNTYPES.function,
            function: (requestItem: any) => (
            <Button
                label="Charge"
                type="button"
                onClick={() => openAdditionalCharge(requestItem)}
            />
        ),
    }] : []),
        ...(isView ? [{
            columnHead: "Action",
            path: "uniform_item_no",
            columnType: COLUMNTYPES.function,
            function: (requestItem: any) => (
            <Button
                label="View"
                type="button"
               onClick={async () => {
                    try {
                        const resp = await getWeightAverageById(requestItem.id);

                        if (!resp?.error) {
                            setSelectedItem(resp.data);
                            viewItemModal.onOpen();
                        } else {
                            toast.error("Failed to load item details");
                        }
                    } catch (err) {
                        toast.error("Request failed");
                    }
                }}
            />
        ),
    }]
    : []),
        
        
    ];
    
    return (
        <Modal 
            isShowing={modal.isShowing}
            title={mode === "create" ? "Generate Weight Average" : "View Weight Average"}
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size = {mode === "create" ? "xxl" : "xl"}
        >
        <form onSubmit={createFormHandler.handleSubmit}>
            <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-2">
                <Textfield
                    label="Posting Date"
                    placeholder="posting_date"
                    name="date_posted"
                    value={createFormHandler.values.date_posted ?? ""}
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.date_posted}
                    type="date"
                    disabled={isView}
                />
                <Dropdown
                    label="Tag Selection"
                    placeholder="select option"
                    name="tag"
                    value={createFormHandler.values.tag}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.tag}
                    options={tagSelectionDropDown}
                />
                <Textfield
                    label="Date From"
                    placeholder="date_from"
                    name="date_from"
                    value={createFormHandler.values.date_from ?? ""}
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.date_from}
                    type="date"
                    disabled={isView}
                />
                <Textfield
                    label="Date To"
                    placeholder="date_to"
                    name="date_to"
                    value={createFormHandler.values.date_to ?? ""}
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.date_to}
                    type="date"
                    disabled={isView}
                />     
            </div> 
            <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-2">
                <Textfield
                    label="Overall Remarks"
                    name="overall_remarks"
                    value={createFormHandler.values.overall_remarks ?? ""}
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.overall_remarks}
                    disabled={isView}
                />
            </div>
            {mode === "view" ? null : (
                  <div className="flex mt-4 font-semibold border-b border-slate-300 pb-1 mb-1 items-center justify-between">
                    <span>Request Data</span>
                    <button
                        type="button"
                        className="text-sm font-medium text-red-800 hover:text-red-700 hover:underline cursor-pointer"
                        onClick={generateItems}
                        disabled={isView}
                    >
                        Generate Data
                    </button>
                </div>
            )}           
             <Table
                dataSet={createFormHandler.values.items}
                columnSettings={weightAverageColumn}
                smallText
                dataKey="item_no"
                paginator={paginator}
            />
            <Modal
                isShowing={additionalChargeModal.isShowing}
                title="Additional Charge"
                onClose={additionalChargeModal.onClose}
                size="md"
            >
                <div className="grid grid-cols-1 gap-3">
                    <Textfield
                        label="Additional Charge"
                        name="additional_charge"
                        type="number"
                        value={chargeDraft.additional_charge}
                        onChange={(event: any) => setChargeDraft({
                            ...chargeDraft,
                            additional_charge: event.target.value,
                        })}
                    />
                    <TextArea
                        label="Reason"
                        name="reason"
                        value={chargeDraft.reason}
                        onChange={(event: any) => setChargeDraft({
                            ...chargeDraft,
                            reason: event.target.value,
                        })}
                    />
                    <div className="flex justify-end gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={additionalChargeModal.onClose}
                        />
                        <Button
                            label="Save"
                            onClick={saveAdditionalCharge}
                        />
                    </div>
                </div>
            </Modal>
            <WeightedAverageItem
                modal={viewItemModal}
                mode="view"
                formValue={selectedItem}
                onSubmitCallback={api.triggerReload}
            />
            {mode === "create" ? null : (  
                <div>
                    <hr className="mt-6 pb-2 text-slate-300" /> 
                    <p>Report Log:</p>          
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                    <Textfield
                        label="Prepared By:"
                        name="created_by"
                        value={createFormHandler.values.prepared_by ?? ""}
                        error={createFormHandler.errors.prepared_by}
                        disabled                       
                    />
                 <Textfield
                        label="Date & Time"
                        value={
                            createFormHandler.values.prepared_at
                                ? moment(createFormHandler.values.prepared_at).format("MMMM DD, YYYY h:mm A")
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
                            createFormHandler.values.reviewed_at
                                ? moment(createFormHandler.values.reviewed_at).format("MMMM DD, YYYY h:mm A")
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
                            createFormHandler.values.posted_at
                                ? moment(createFormHandler.values.posted_at).format("MMMM DD, YYYY h:mm A")
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
                            createFormHandler.values.cancelled_at
                                ? moment(createFormHandler.values.cancelled_at).format("MMMM DD, YYYY h:mm A")
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
                               setitemdraft({weighted_id_number:"",uniform_item_no:"",description:"",standard_uom:"",standard_uom_two:"",current_price:"",total_quantity:"",new_standard_price:"",
                                    other_charges:"",total_amount:"",standard_difference:"",reason:""
                                });
                          
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={createFormHandler.handleSubmit}
                        />
                    </div>
                    </div>
                    </>
                )}
                
                </form>
        </Modal>
    )
};

export default WeightedAverageForm;
