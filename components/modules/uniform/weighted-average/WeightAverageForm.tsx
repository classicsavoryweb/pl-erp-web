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
import AdditionalChargeModal from "./AdditionalChargeModal";
import { getDropDownMasterlist } from "@/api/uniform/request-and-issuance"
import { createWeightAverage , getWeightAverageItems , getWeightAverageById , updateWeightStatus , updateUnitPrice } from "@/api/uniform/weighted-average";
import moment from "moment";
import Badge from "@/components/common/Badge";
import  WeightedAverageItem  from "./WeightAverageItemView";
import PasswordForm from "./PasswordForm";
import { create } from "lodash";
import * as XLSX from "xlsx-js-style";
import ActionDropDown from "@/components/common/ActionDropDown";
import ChangeUnitPriceForm from "./ChangeUnitPriceForm";

interface WeightAverageFormProps{
    modal: any;
    mode: "create" | "view" | "review" | "post";
    formValue?: any;
    onSubmitCallback: () => void;
}

const tagSelectionDropDown = [
    {label:"Items with Purchases" , value:"Items with Purchases"},
    {label:"Items without Purchases" , value:"Items without Purchases"},
    {label:"Check All" , value:"Check All"}
]

const defaultValues = () => {
    const datePosted = moment();

    return {
        weighted_id: "",
        tag: "",
        date_posted: datePosted.format("YYYY-MM-DD"),
        date_from: datePosted.clone()
            .subtract(1, "month")
            .startOf("month")
            .format("YYYY-MM-DD"),
        date_to: datePosted.clone()
            .subtract(1, "month")
            .endOf("month")
            .format("YYYY-MM-DD"),
        status: "",
        overall_remarks: "",
        prepared_by: "",
        prepared_at: "",
        reviewed_by: "",
        reviewed_at: "",
        posted_by: "",
        posted_at: "",
        price_updated_by: "",
        price_updated_at: "",
        cancelled_by: "",
        cancelled_at: "",
        cancel_reason: "",
        items: [] as any[],
    };
};

const WeightedAverageForm = ({
    modal,
    mode,
    formValue,
    onSubmitCallback,
    }: WeightAverageFormProps) => {
        const [ item, setitem ] = useState<any[]>([]);
        const api = useApiCall();
        const [selectedItem, setSelectedItem] = useState<any>(null);
        const [password , setPassword] = useState("");
        const viewItemModal = useModal();
        const additionalChargeModal = useModal();
        const changeUnitPriceModal = useModal();
        const passwordModal = useModal();
        const [changePriceItems , setChangePriceItems] = useState<any[]>([]);
        
        const [chargeDraft, setChargeDraft] = useState({
            index: -1,
            additional_charge: "",
            reason: "",
            description: "",
            current_price: "",
            new_standard_price: 0,
            standard_difference : 0,
            original_new_standard_price : "",
            original_standard_difference : "",
        });
        const [changeUnitPrice, setChangeUnitPrice] = useState({
            index: -1,
            change_unit_price: "",
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
            final_standard_price: "",
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
            initialValues  :defaultValues(),
               validate: (values) => {
                    if (!values.items || values.items.length === 0) {
                        toast.error("Load data first.");
                        return {
                            items: "Load data first.",
                        };
                    }

                    return {};
                },
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
                                moment(),
                                "day"
                            );
                        }
                    ),

                date_from: Yup.string()
                    .required("Date From is Required")
                    .test(
                        "previous-month-start",
                        "Date From must be the first day of the previous month based on Date Posted",
                        function (value) {
                            const { date_posted } = this.parent;

                            if (!value || !date_posted) return false;

                            const expectedDateFrom = moment(date_posted)
                                .subtract(1, "month")
                                .startOf("month")
                                .format("YYYY-MM-DD");

                            return value === expectedDateFrom;
                        }
                    ),

                date_to: Yup.string()
                    .required("Date To is Required")
                    .test(
                        "previous-month-end",
                        "Date To must be the last day of the previous month based on Date Posted",
                        function (value) {
                            const { date_posted } = this.parent;

                            if (!value || !date_posted) return false;

                            const expectedDateTo = moment(date_posted)
                                .subtract(1, "month")
                                .endOf("month")
                                .format("YYYY-MM-DD");

                            return value === expectedDateTo;
                        }
                    ),
                overall_remarks:Yup.string().nullable(),
                items:Yup.array()
                    .min(1,"At least one item is required")
                    .of(Yup.object({
                        uniform_item_no: Yup.string().required(),
                        item_remarks : Yup.string().nullable(),
                        new_standard_price : Yup.string().required()
                    })),
                    
            }),

            onSubmit: async (values , {resetForm, setSubmitting}) =>{
                if (!values.items || values.items.length === 0) {
                    toast.error("Load data first.");
                    return;
                }
                const isConfirmed = await confirm({
                    title: isReview 
                        ? "Review Weighted Average"
                        :isPost 
                        ? "Post Weighted Average"
                        : "Create Weighted Average",
                    message: isReview
                        ? "Are you sure you Reviewed this Weighted Average?"
                        :isPost
                        ? "Are you sure you want to post this Weighted Average"
                        : "Are you sure yo want to create this Weighted Average?"
                });

                if(!isConfirmed) return;
                
                setSubmitting(true);
                const payload = {
                    ...values,
                    items: values.items.map((item: any) => ({
                        ...item,
                        final_standard_price:
                            Number(item.new_standard_price || 0) +
                            Number(item.other_charges || 0),
                    })),
                };

                const submitRequest = async (requestPayload: any) => {
                    
                    switch(mode){
                        case "create":
                            return createWeightAverage(requestPayload);
                        case "review":
                            return updateWeightStatus(formValue.id,"Reviewed", createFormHandler.values.items);
                        case "post": 
                            return updateWeightStatus(formValue.id,"Posted", createFormHandler.values.items);
                        default:
                            throw new Error("Invalid Mode");
                    }
                };

                try{
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
                        ? "Weighted Average Reviewed Successfully"
                        : isPost
                        ? "Weighted Average Post Successfully"
                        : "Create Weighted Average Successfully"
                    );

                    onSubmitCallback();
                    modal.onClose();
                    resetForm();
                }finally{
                        setSubmitting(false);
                }
            }     
        });
        const isView = mode == "view";
        const isReview = mode == "review";
        const isPost = createFormHandler.values.status?.toLowerCase() === "posted";
        const items = createFormHandler.values.items || [];
    
        useEffect(() => {
            if (!modal.isShowing) return;

            if ((mode === "view" || mode === "review" || mode === "post") && formValue) {
                createFormHandler.setValues({
                    weighted_id: formValue.weighted_id ?? "",
                    tag: formValue.tag ?? "",
                    date_posted: formValue.date_posted ?? "",
                    date_from: formValue.date_from ?? "",
                    date_to: formValue.date_to ?? "",
                    status: formValue.status ?? "",
                    overall_remarks: formValue.overall_remarks ?? "",
                    prepared_by: formValue.prepared_by ?? "",
                    prepared_at: formValue.prepared_at ?? "",
                    reviewed_by: formValue.reviewed_by ?? "",
                    reviewed_at: formValue.reviewed_at ?? "",
                    posted_by: formValue.posted_by ?? "",
                    posted_at: formValue.posted_at ?? "",
                    price_updated_by: formValue.price_updated_by ?? "",
                    price_updated_at: formValue.price_updated_at ?? "",
                    cancelled_by: formValue.cancelled_by ?? "",
                    cancelled_at: formValue.cancelled_at ?? "",
                    cancel_reason: formValue.cancel_reason ?? "",
                    items: formValue.items ?? [],
                });
            } else {
                createFormHandler.setValues(defaultValues());
            }
        }, [modal.isShowing, formValue, mode]);
    
        const generateItems = async () => {
            const dateFrom = moment(createFormHandler.values.date_from);
            const dateTo = moment(createFormHandler.values.date_to);
            const today = moment();
            if (
                moment(createFormHandler.values.date_from).isAfter(
                    moment(createFormHandler.values.date_to),
                    "day"
                )
            ) {
                toast.error("Date From cannot be later than Date To.");
                return;
            }
            if (
                dateFrom.month() !== dateTo.month() ||
                dateFrom.year() !== dateTo.year()
            ) {
                toast.error("Date From and Date To must be within the same month.");
                return;
            }

                if (dateTo.isAfter(today, "day")) {
                toast.error("Date To cannot be later than today.");
                return;
            }
            if(!createFormHandler.values.tag ){
                toast.error("Need a Tag Selection");
                return;
            }
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
        const filteredChangePriceItems = changePriceItems.filter(
            (item) =>
                Number(item.old_price ?? 0).toFixed(2) !==
                Number(item.new_price ?? 0).toFixed(2)
        );

        const exportChangePriceItems = () => {
            const exportData = changePriceItems.map(item => ({
                "Uniform Number": item.uniform_item_no,
                "Description": item.description,
                "Other Charges": item.other_charges,
                "UOM" : item.standard_uom_two,
                "Old Price": item.old_price,
                "New Price": item.new_price,
                "Standard Difference": item.standard_difference,
            }));
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const newPriceColumn = "F";
            const oldPriceColumn = "E";

            for (let row = 2; row <= exportData.length + 1; row++) {
                const oldPrice = worksheet[`${oldPriceColumn}${row}`]?.v;
                const newPrice = worksheet[`${newPriceColumn}${row}`]?.v;

                if (Number(oldPrice).toFixed(2) !== Number(newPrice).toFixed(2)) {
                    for (let col = 0; col < 7; col++) {
                        const cellAddress = XLSX.utils.encode_cell({
                            r: row - 1, 
                            c: col
                        });

                        if (worksheet[cellAddress]) {
                            worksheet[cellAddress].s = {
                                fill: {
                                    fgColor: { rgb: "FFF2CC" }
                                },
                                font: {
                                    bold: true
                                }
                            };
                        }
                    }
                }
            }
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Prices");
            XLSX.writeFile(workbook, `UPDATED_PRICES-${moment().format("YYYY-MM-DD")}.xlsx`);
        };

        const openAdditionalCharge = (requestItem: any) => {
            const index = createFormHandler.values.items.findIndex(
                (item: any) => item.uniform_item_no === requestItem.uniform_item_no
                
            );
         
            setChargeDraft({
                index,
                additional_charge: requestItem.other_charges ?? "",
                reason: requestItem.reason ?? "",
                description: requestItem.description ?? "",
                current_price:requestItem.current_price ?? "",
                new_standard_price : requestItem.new_standard_price ?? "",
                original_new_standard_price : requestItem.new_standard_price ?? "",
                standard_difference : requestItem.standard_difference ?? "" ,
                original_standard_difference : requestItem.standard_difference ?? ""
            });

            additionalChargeModal.onOpen();
        };

        const confirmPassword = () => {
            if (password !== process.env.NEXT_PUBLIC_WEIGHTED_AVERAGE_PASSWORD) {
                toast.error("Invalid password");
                return;
            }
            const items = createFormHandler.values.items
                .map((item: any) => ({
                    description: item.description,
                    old_price: item.current_price,
                    new_price:
                        Number(item.new_standard_price) +
                        Number(item.other_charges || 0),
                    other_charges: item.other_charges,
                    standard_difference: item.standard_difference,
                    standard_uom_two: item.standard_uom_two,
                    uniform_item_no : item.uniform_item_no,
                    
                }))
            setChangePriceItems(items);

            passwordModal.onClose();
            setPassword("");
            changeUnitPriceModal.onOpen();
        };

        const saveChangeUnitPrice = async () => {
            const items = createFormHandler.values.items;

            if (!items || items.length === 0) return;
            try{
                await updateUnitPrice({
                    weighted_average_id: createFormHandler.values.weighted_id,
                    items: items.map((item: any) => ({
                        item_no: item.item_no ?? item.uniform_item_no,
                        standard_unit_price:
                            Number(item.new_standard_price) +
                            Number(item.other_charges || 0),
                    })),
                    
                });
                toast.success("All selected item prices have been updated in the masterlist.");
                changeUnitPriceModal.onClose();
                onSubmitCallback();
                modal.onClose();
                   
            }
            catch(error){
                toast.error("Failed to update item prices.");
                console.error(error);
            }
        };

        const getStatusBadge = (status: string): "success" | "warning" | "danger" | "purpose" |"default" => {
            switch (status) {
                case "Posted":
                    return "success";
                case "Updated":
                    return "purpose";
                case "Reviewed":
                    return "warning";
                case "Cancelled":
                    return "danger";
                default:
                    return "default";
            }
        };


        const saveAdditionalCharge = () => {
            const additionalCharge = Number(chargeDraft.additional_charge || 0);

            const rows = [...createFormHandler.values.items];
            const row = rows[chargeDraft.index];

            if (!row) return;

            const totalAmount = Number(row.total_amount || 0);
            const totalQuantity = Number(row.total_quantity || 0);
            const standardDiff = Number(row.standard_difference || 0);
       

            rows[chargeDraft.index] = {
                ...row,
                other_charges: additionalCharge.toFixed(2),
                final_standard_price: (
                    Number(row.new_standard_price || 0) + additionalCharge
                ).toFixed(2),
                standard_difference: (
                    Number(row.new_standard_price || 0) +
                    additionalCharge -
                    Number(row.current_price || 0)
                ).toFixed(2),
                reason: chargeDraft.reason,
                item_remarks: chargeDraft.reason,
            };

            createFormHandler.setFieldValue("items", rows);
            additionalChargeModal.onClose();
        };

        const modalTitle =
            mode === "create"
                ? "Generate Weighted Average"
                : isReview
                ? "Review Weighted Average"
                : isPost
                ? "Post Weighted Average"
                : "View Weighted Average";

        const tableActions = [
            ...(mode !== "create"
                ? [{
                    label: "View",
                    onClick: async (requestItem: any) => {
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
                    },
                }]
            :[]),
            
            ...(mode !== "view"
                ? [{
                label: "Additional Charge",
                onClick: async (requestItem : any) => {
                    openAdditionalCharge(requestItem)
                }
                   }]

            :[]),     
        ]

        const changePriceTableColumn = [
            {columnHead : "Item Name" , path: "description" , columnType:COLUMNTYPES.string},
            {columnHead : "Old Standard Price" , path: "old_price" , columnType:COLUMNTYPES.amount},
            {columnHead : "New Standard Price" , path: "new_price" , columnType:COLUMNTYPES.amount},
            {columnHead : "Price Difference" , path: "standard_difference", columnType:COLUMNTYPES.amount},

        ]

        const weightAverageColumn =[
            {columnHead: "Item Code" , path: "uniform_item_no" , columnType:COLUMNTYPES.string },
            {columnHead: "Item Description" , path: "description" , columnType:COLUMNTYPES.string },
            {columnHead: "Standard UOM" , path: "standard_uom" , columnType:COLUMNTYPES.string },
            {columnHead: "Current Standard Price" , path: "current_price" , columnType:COLUMNTYPES.amount },
            {columnHead: "Total Purchases" , path: "total_quantity" , columnType:COLUMNTYPES.string },
            {columnHead: "Standard UOM" , path: "standard_uom" , columnType:COLUMNTYPES.string },
            {columnHead: "Total Amount" , path: "total_amount" , columnType:COLUMNTYPES.amount },
            {columnHead: "New Standard Price" , path: "new_standard_price" , columnType:COLUMNTYPES.amount },
            {columnHead: "Additional Charges" , path: "other_charges" , columnType:COLUMNTYPES.amount }, 
            {columnHead: "Final Standard Price" , path: "" , columnType:COLUMNTYPES.function,
                function:(item : any) => {
                    const finalstandardprice = Number(item.new_standard_price) + Number(item.other_charges);
                    return(
                        <span>
                            {finalstandardprice}
                        </span>
                    )
                }
            },
            {columnHead: "Standard Price Differences" , path: "standard_difference" , columnType:COLUMNTYPES.function,
                function:(item : any) => {
                    const difference = Number(item.standard_difference || 0);
                    return (
                        <span className={difference < 0 ? "text-red-500" : ""}>
                            {item.standard_difference}
                        </span>
                    )
                }
            },
        ];
    
    return (
        <>
        <Modal 
            isShowing={modal.isShowing}
          title={
                    mode === "create"
                        ? "Generate Weighted Average"
                        : mode === "review"
                        ? "Review Weighted Average"
                        : mode === "post"
                        ? "Post Weighted Average"
                        : "View Weighted Average"
                }
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size = {mode === "create" || isReview || isView || isPost ? "xxl" : "xxl"}
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <div className="grid grid-cols-5 gap-1 items-end">
                    <div className="col-span-2">
                        <Textfield
                            label="Posting Date"
                            placeholder="posting_date"
                            name="date_posted"
                            value={createFormHandler.values.date_posted ?? ""}
                            onChange={createFormHandler.handleChange}
                            error={createFormHandler.errors.date_posted}
                            type="date"
                            disabled
                        />
                    </div>
                    <div className="col-span-2">
                        <Dropdown
                            label="Tag Selection"
                            placeholder="select option"
                            name="tag"
                            value={createFormHandler.values.tag}
                            required
                            onChange={createFormHandler.handleChange}
                            error={createFormHandler.errors.tag}
                            options={tagSelectionDropDown}
                            disabled = {isView || isPost || isReview}
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
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-2">
                    <Textfield
                        label="Date From"
                        placeholder="date_from"
                        name="date_from"
                        value={createFormHandler.values.date_from ?? ""}
                        onChange={createFormHandler.handleChange}
                        error={createFormHandler.errors.date_from}
                        type="date"
                        disabled={isView || isPost || isReview}
                    />
                    <Textfield
                        label="Date To"
                        placeholder="date_to"
                        name="date_to"
                        value={createFormHandler.values.date_to ?? ""}
                        onChange={createFormHandler.handleChange}
                        error={createFormHandler.errors.date_to}
                        type="date"
                        disabled={isView || isPost || isReview}
                    />     
                </div> 
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-1">
                    <Textfield
                        label="Overall Remarks"
                        name="overall_remarks"
                        value={createFormHandler.values.overall_remarks ?? ""}
                        onChange={createFormHandler.handleChange}
                        error={createFormHandler.errors.overall_remarks}
                        disabled={isView || isPost || isReview}
                    />
                   
                </div>
            
                <div className="flex font-semibold border-b border-slate-300 items-center gap-4">
                    <div className = "flex-[5]">
                        <span>Request Data</span>
                    </div>
                    {(mode === "create" || (isPost && !isReview)) && (
                        <div className="flex-[1]">
                            <Button
                                type="button"
                                label={mode === "create" ? "Generate Data" : "Update Unit Price"}
                                onClick={() => {
                                    if (mode === "create") {
                                        generateItems();
                                    } else {
                                        passwordModal.onOpen();
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
                       
                <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                    <Table
                        dataSet={createFormHandler.values.items || []}
                        columnSettings={weightAverageColumn}
                        smallText
                        dataKey="item_no"
                        withActions
                        actions={tableActions}
                        fixed
                    />
                     
                </div>
               <div className="flex justify-between items-center mt-1 text-sm">
                    <div className="text-xs text-gray-400">
                        Showing {(createFormHandler.values.items?.length ?? 0)}{" "}
                        {(createFormHandler.values.items?.length ?? 0) === 1 ? "item" : "items"}
                    </div>

                    <div className="flex justify-end text-sm text-gray-400">
                        <span className="font-normal">
                            Total Amount:
                        </span>
                        <span className="ml-2 mr-2 font-semibold text-sm ">
                            {createFormHandler.values.items
                                ?.reduce(
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
                <WeightedAverageItem
                    modal={viewItemModal}
                    formValue={selectedItem}
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
                        label="Price Updated By:"
                        name="price_updated_by"
                        value={createFormHandler.values.price_updated_by ?? ""}
                        error={createFormHandler.errors.price_updated_by}
                        disabled
                    />
                    <Textfield
                        label="Date & Time"
                        value={
                            createFormHandler.values.price_updated_at
                                ? moment(createFormHandler.values.price_updated_at).format("MMMM DD, YYYY h:mm A")
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
                                other_charges:"",total_amount:"",standard_difference:"",reason:"",final_standard_price:""
                            });
                    
                        }}
                    />
                    <Button
                        type="submit"
                        label={mode === "review" ? "Review"
                            :mode === "post" ? "Post" 
                            : "Submit"
                        }
                        loading={createFormHandler.isSubmitting}
                        onClick={() => {}}
                    />
                </div>
                </div>
                </>
            )}
                        
            </form>
        </Modal>
     
         <AdditionalChargeModal
            modal={additionalChargeModal}
            chargeDraft={chargeDraft}
            setChargeDraft={setChargeDraft}
            onSave={saveAdditionalCharge}
        />
        <PasswordForm
            modal= {passwordModal}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
        />
        <ChangeUnitPriceForm
            modal={changeUnitPriceModal}
            items={changePriceItems}
            onExport={exportChangePriceItems}
            onUpdate={saveChangeUnitPrice}
        />
    </>
       
    )
    
};

export default WeightedAverageForm;
