"use client";

import { createUniformItem, editUniformItem, getUniformItemOptions } from "@/api/uniform/item-masterlist";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";

interface UniformItemFormProps {
    modal: any;
    mode: "create" | "edit";
    formValue?: any;
    onSubmitCallback: () => void;
}

const yesNoOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
];

const unitOptions = [
    { label: "Piece", value: "piece" },
    { label: "Pack", value: "pack" },
    { label: "Box", value: "box" },
    { label: "Set", value: "set" },
];

const defaultValues = {
    description: "",
    uniform_size_id: "",
    uniform_gender_id: "",
    standard_unit_price: 0,
    stock_on_hand: 0,
    status: "active",
    standard_qty: 1,
    standard_unit: "piece",
    min_order: 1,
    order_limit: 1,
    crit_level: 1,
    minimum_rpl: 1,
    free_uniform: "0",
    made_to_order: "0",
    suppliers: [] as any[],
};

const UniformItemForm = ({
    modal,
    mode,
    formValue,
    onSubmitCallback,
}: UniformItemFormProps) => {
    const [sizes, setSizes] = useState<any[]>([]);
    const [genders, setGenders] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [supplierDraft, setSupplierDraft] = useState({
        vendor_no: "",
        vendor_name: "",
        unit_price: 1,
        packaging_unit: "",
        remarks: "",
    });

    useAsyncEffect(() => {
        if (!modal.isShowing) return;

        getUniformItemOptions()
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching uniform options");
                    return;
                }

                setSizes(resp.data.sizes ?? []);
                setGenders(resp.data.genders ?? []);
                setSuppliers(resp.data.suppliers ?? []);
            })
            .catch(() => toast.error("Error encountered"));
    }, [modal.isShowing]);

    const formHandler = useFormik({
        initialValues: defaultValues,
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            uniform_size_id: Yup.string().required("Size is required."),
            uniform_gender_id: Yup.string().required("Gender is required."),
            status: Yup.string().required("Status is required."),
            standard_unit_price: Yup.number().min(0).required("Standard price is required."),
            stock_on_hand: Yup.number().min(0).required("Stock on hand is required."),
            standard_qty: Yup.number().min(0).required("Standard packaging quantity is required."),
            min_order: Yup.number().min(0).required("Minimum order is required."),
            order_limit: Yup.number()
                .min(Yup.ref("min_order"), "Ordering limit must be greater than or equal to minimum order.")
                .required("Ordering limit is required."),
            crit_level: Yup.number().min(0).required("Critical level is required."),
            minimum_rpl: Yup.number().min(0).required("Minimum replenishment is required."),
            free_uniform: Yup.string().required("Free uniform status is required."),
            made_to_order: Yup.string().required("Made to order status is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: mode === "create" ? "Create Uniform Item" : "Edit Uniform Item",
                message: mode === "create" ? "Are you sure you want to create?" : "Are you sure you want to save changes?",
            });

            if (!isConfirmed) return;

            setSubmitting(true);
            const payload = {
                ...values,
                free_uniform: values.free_uniform === "1",
                made_to_order: values.made_to_order === "1",
            };

            const submitter = mode === "create"
                ? createUniformItem(payload)
                : editUniformItem(payload, formValue.id);

            submitter
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(mode === "create" ? "Uniform item created successfully" : "Uniform item updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                })
                .catch(() => toast.error("Error encountered"))
                .finally(() => setSubmitting(false));
        },
    });

    useEffect(() => {
        if (!modal.isShowing) return;

        if (mode === "edit" && formValue) {
            formHandler.setValues({
                description: formValue.description ?? "",
                uniform_size_id: String(formValue.uniform_size_id ?? ""),
                uniform_gender_id: String(formValue.uniform_gender_id ?? ""),
                standard_unit_price: Number(formValue.standard_unit_price ?? 0),
                stock_on_hand: Number(formValue.stock_on_hand ?? 0),
                status: formValue.status ?? "active",
                standard_qty: Number(formValue.standard_qty ?? 1),
                standard_unit: formValue.standard_unit ?? "piece",
                min_order: Number(formValue.min_order ?? 1),
                order_limit: Number(formValue.order_limit ?? 1),
                crit_level: Number(formValue.crit_level ?? 1),
                minimum_rpl: Number(formValue.minimum_rpl ?? 1),
                free_uniform: formValue.free_uniform ? "1" : "0",
                made_to_order: formValue.made_to_order ? "1" : "0",
                suppliers: formValue.suppliers ?? [],
            });
        } else {
            formHandler.setValues(defaultValues);
        }
    }, [modal.isShowing, formValue, mode]);

    const supplierColumns = [
        { columnHead: "Vendor", path: "vendor_name", columnType: COLUMNTYPES.string },
        { columnHead: "Unit Price", path: "unit_price", columnType: COLUMNTYPES.amount },
        { columnHead: "Packaging Unit", path: "packaging_unit", columnType: COLUMNTYPES.string },
        { columnHead: "Remarks", path: "remarks", columnType: COLUMNTYPES.string },
    ];

    const addSupplier = () => {
        if (!supplierDraft.vendor_no) {
            toast.error("Supplier is required");
            return;
        }

        if (Number(supplierDraft.unit_price) <= 0) {
            toast.error("Supplier unit price must be greater than zero");
            return;
        }

        const existing = formHandler.values.suppliers.some((supplier: any) => supplier.vendor_no === supplierDraft.vendor_no);
        if (existing) {
            toast.error("Supplier already exists");
            return;
        }

        if (formHandler.values.suppliers.length >= 3) {
            toast.error("Maximum of 3 suppliers per item");
            return;
        }

        formHandler.setFieldValue("suppliers", [
            ...formHandler.values.suppliers,
            {
                ...supplierDraft,
                vendor_name: supplierDraft.vendor_name || supplierDraft.vendor_no,
                unit_price: Number(supplierDraft.unit_price),
            },
        ]);
        setSupplierDraft({ vendor_no: "", vendor_name: "", unit_price: 1, packaging_unit: "", remarks: "" });
    };

    const removeSupplier = (supplier: any) => {
        formHandler.setFieldValue(
            "suppliers",
            formHandler.values.suppliers.filter((item: any) => item.vendor_no !== supplier.vendor_no)
        );
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title={mode === "create" ? "Create Uniform Item" : "Edit Uniform Item"}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            loading={modal.loading}
            size="lg"
        >
            <form onSubmit={formHandler.handleSubmit}>
                {mode === "edit" && (
                    <Textfield
                        label="Item Code"
                        name="item_no"
                        value={formValue?.item_no ?? ""}
                        disabled
                    />
                )}
                <Textfield
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    value={formHandler.values.description}
                    required
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.description}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                    <Dropdown
                        label="Size"
                        placeholder="select size"
                        name="uniform_size_id"
                        value={formHandler.values.uniform_size_id}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.uniform_size_id}
                        options={sizes.map((size) => ({ label: size.description, value: size.id }))}
                    />
                    <Dropdown
                        label="Gender"
                        placeholder="select gender"
                        name="uniform_gender_id"
                        value={formHandler.values.uniform_gender_id}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.uniform_gender_id}
                        options={genders.map((gender) => ({ label: gender.description, value: gender.id }))}
                    />
                    <ActiveInactiveDropDown
                        label="Status"
                        placeholder="select status"
                        name="status"
                        value={formHandler.values.status}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.status}
                    />
                    <Dropdown
                        label="Applicable for Free Uniform"
                        placeholder="select option"
                        name="free_uniform"
                        value={formHandler.values.free_uniform}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.free_uniform}
                        options={yesNoOptions}
                    />
                    <Dropdown
                        label="Made to Order"
                        placeholder="select option"
                        name="made_to_order"
                        value={formHandler.values.made_to_order}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.made_to_order}
                        options={yesNoOptions}
                    />
                    <Textfield
                        label="Standard Price"
                        name="standard_unit_price"
                        type="number"
                        value={formHandler.values.standard_unit_price}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.standard_unit_price}
                    />
                    <Textfield
                        label="Stock on Hand"
                        name="stock_on_hand"
                        type="number"
                        value={formHandler.values.stock_on_hand}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.stock_on_hand}
                    />
                    <Textfield
                        label="Standard Packaging Qty"
                        name="standard_qty"
                        type="number"
                        value={formHandler.values.standard_qty}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.standard_qty}
                    />
                    <Dropdown
                        label="Standard Packaging Unit"
                        placeholder="select unit"
                        name="standard_unit"
                        value={formHandler.values.standard_unit}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.standard_unit}
                        options={unitOptions}
                    />
                    <Textfield
                        label="Minimum Order"
                        name="min_order"
                        type="number"
                        value={formHandler.values.min_order}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.min_order}
                    />
                    <Textfield
                        label="Ordering Limit"
                        name="order_limit"
                        type="number"
                        value={formHandler.values.order_limit}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.order_limit}
                    />
                    <Textfield
                        label="Critical Level"
                        name="crit_level"
                        type="number"
                        value={formHandler.values.crit_level}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.crit_level}
                    />
                    <Textfield
                        label="Minimum Replenishment"
                        name="minimum_rpl"
                        type="number"
                        value={formHandler.values.minimum_rpl}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.minimum_rpl}
                    />
                </div>

                <div className="flex font-semibold border-b border-slate-300 items-center justify-between pb-2">
                    <span>Suppliers</span>

                    <div>
                        <Button
                            type="button"
                            variant="success"
                            label="Add Request"
                            onClick={addSupplier}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 items-end">
                    <SearchableDropDown
                        label="Supplier"
                        placeholder="select supplier"
                        name="vendor_no"
                        value={supplierDraft.vendor_no}
                        onChange={(e: any) => setSupplierDraft({
                            ...supplierDraft,
                            vendor_no: e.target.value,
                            vendor_name: e.target.obj?.vendor_name ?? e.target.value,
                        })}
                        options={suppliers.map((supplier) => ({
                            label: supplier.vendor_name,
                            value: supplier.vendor_number,
                            obj: supplier,
                        }))}
                    />
                    <Textfield
                        label="Unit Price"
                        name="unit_price"
                        type="number"
                        value={supplierDraft.unit_price}
                        onChange={(e: any) => setSupplierDraft({ ...supplierDraft, unit_price: e.target.value })}
                    />
                    <Textfield
                        label="Packaging Unit"
                        name="packaging_unit"
                        value={supplierDraft.packaging_unit}
                        onChange={(e: any) => setSupplierDraft({ ...supplierDraft, packaging_unit: e.target.value })}
                    />
                </div>
                <Textfield
                    label="Supplier Remarks"
                    name="remarks"
                    value={supplierDraft.remarks}
                    onChange={(e: any) => setSupplierDraft({ ...supplierDraft, remarks: e.target.value })}
                />
                <Table
                    dataSet={formHandler.values.suppliers}
                    columnSettings={supplierColumns}
                    withActions
                    actions={[{ label: "Remove", onClick: removeSupplier }]}
                    smallText
                    dataKey="vendor_no"
                />
                <div className="flex justify-between items-center text-sm">
                    <div className="text-xs text-gray-400">
                        {(formHandler.values.suppliers?.length ?? 0)}{" "}
                        {(formHandler.values.suppliers?.length ?? 0) === 1 ? "supplier" : "suppliers"}
                    </div>
                </div>
                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default UniformItemForm;
