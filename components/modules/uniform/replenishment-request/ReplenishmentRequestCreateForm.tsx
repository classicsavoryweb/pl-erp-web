"use client";

import {
    createReplenishment,
    generateReplenishmentList,
    getStockOptions,
    importReplenishmentItems,
} from "@/api/uniform/stock-replenishment";

import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import DropDownButtons from "@/components/common/DropDownButtons";
import Dropdown from "@/components/common/Dropdown";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import Table from "@/components/common/Table";
import { useModal } from "@/hooks/modal";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const today = () => new Date().toISOString().slice(0, 10);

const createEmptyRequest = () => ({
    supplier_id: "",
    replenishment_type: "Purchasing Department",
    requested_date: today(),
    remarks: "",
    items: [] as any[],
});

const messageOf = (response: any) =>
    response?.data?.message ??
    response?.message ??
    "Unable to complete the request.";

const lineInputClassName = [
    "w-full min-h-10 rounded-md border-2 border-slate-300 bg-transparent p-2",
    "focus:border-slate-400 focus:outline-none",
    "dark:border-neutral-700 dark:bg-neutral-800",
].join(" ");

const numericLineInputClassName = `${lineInputClassName} text-right`;

const readOnlyNumericLineInputClassName =
    `${numericLineInputClassName} cursor-default !border-slate-300 !bg-slate-200 !text-slate-600 ` +
    `focus:!border-slate-300 dark:!border-neutral-700 dark:!bg-neutral-900 dark:!text-neutral-400`;

interface ReplenishmentRequestCreateFormProps {
    modal: ReturnType<typeof useModal>;
    onSubmitCallback?: () => void;
}

const ReplenishmentRequestCreateForm = ({
    modal,
    onSubmitCallback,
}: ReplenishmentRequestCreateFormProps) => {
    const [form, setForm] = useState(createEmptyRequest);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [requestItemId, setRequestItemId] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const importInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!modal.isShowing) return;

        getStockOptions()
            .then((response) => {
                if (response.error) {
                    toast.error(messageOf(response));
                    return;
                }

                setSuppliers(response.data.suppliers ?? []);
                setItems(response.data.items ?? []);
            })
            .catch(() => {
                toast.error("Error fetching stock options.");
            });
    }, [modal.isShowing]);

    const selectedSupplier = suppliers.find(
        (supplier) =>
            String(supplier.id) === String(form.supplier_id)
    );

    const availableItems = (() => {
        if (!selectedSupplier) return [];

        const linked = items.filter((item) =>
            item.suppliers?.some(
                (supplier: any) =>
                    supplier.vendor_no === selectedSupplier.vendor_number
            )
        );

        return linked.length ? linked : items;
    })();

    const closeModal = () => {
        modal.onClose();
        setForm(createEmptyRequest());
        setRequestItemId("");
    };

    const applyGeneratedItems = (generatedItems: any[]) => {
        setForm((current) => ({
            ...current,
            items: generatedItems.map((line: any) => ({
                uniform_item_id: line.uniform_item_id,
                item: line.item,
                requested_qty: Number(line.requested_qty ?? 1),
                approved_qty: Number(
                    line.approved_qty ??
                    line.requested_qty ??
                    1
                ),
                unit_price: Number(line.unit_price ?? 0),
                remarks: line.remarks ?? "",
            })),
        }));
    };

    const handleGenerateList = async () => {
        if (!form.supplier_id) {
            toast.error(
                "Supplier is required before generating a list."
            );
            return;
        }

        setSubmitting(true);

        try {
            const response = await generateReplenishmentList({
                supplier_id: form.supplier_id,
                replenishment_type: form.replenishment_type,
            });

            if (response.error) {
                toast.error(messageOf(response));
                return;
            }

            applyGeneratedItems(response.data.items ?? []);

            toast.success(response.data.message);
        } catch {
            toast.error("Error encountered");
        } finally {
            setSubmitting(false);
        }
    };

    const updateReplenishmentItem = (
        index: number,
        field: string,
        value: any
    ) => {
        setForm((current) => ({
            ...current,
            items: current.items.map((item, itemIndex) => {
                if (itemIndex !== index) {
                    return item;
                }

                if (field === "requested_qty") {
                    return {
                        ...item,
                        requested_qty: value,
                        approved_qty: value,
                    };
                }

                return {
                    ...item,
                    [field]: value,
                };
            }),
        }));
    };


    const handleLineChange = (
    uniformItemId: number,
    field: string,
    value: any
    ) => {
        setItems((prev) =>
            prev.map((item) =>
                item.uniform_item_id === uniformItemId
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );
    };

    const handleLineRemove = (uniformItemId: number) => {
        setItems((prev) =>
            prev.filter(
                (item) =>
                    item.uniform_item_id !== uniformItemId
            )
        );
    };


    const handleImportItems = async (file?: File) => {
        if (!file) return;

        if (!form.supplier_id) {
            toast.error(
                "Supplier is required before importing items."
            );

            if (importInputRef.current) {
                importInputRef.current.value = "";
            }

            return;
        }

        setSubmitting(true);

        try {
            const response = await importReplenishmentItems({
                supplier_id: form.supplier_id,
                supplier_item_file: file,
            });

            if (response.error) {
                toast.error(messageOf(response));
                return;
            }

            applyGeneratedItems(response.data.items ?? []);

            toast.success(response.data.message);
        } catch {
            toast.error("Error encountered");
        } finally {
            setSubmitting(false);

            if (importInputRef.current) {
                importInputRef.current.value = "";
            }
        }
    };

    const addRequestItem = (itemId: string) => {
        const item = items.find(
            (record) => String(record.id) === String(itemId)
        );

        if (!itemId) {
            toast.error("Description is required.");
            return;
        }

        if (!item) return;

        if (
            form.items.some(
                (record) =>
                    String(record.uniform_item_id) ===
                    String(item.id)
            )
        ) {
            toast.error("Item description already exists.");
            return;
        }

        const supplierPrice = item.suppliers?.find(
            (supplier: any) =>
                supplier.vendor_no ===
                selectedSupplier?.vendor_number
        )?.unit_price;

        const quantity = Number(item.minimum_rpl ?? 1);

        setForm((current) => ({
            ...current,
            items: [
                ...current.items,
                {
                    uniform_item_id: item.id,
                    item,
                    requested_qty: quantity,
                    approved_qty: quantity,
                    unit_price: Number(
                        supplierPrice ??
                        item.standard_unit_price ??
                        0
                    ),
                    remarks: "",
                },
            ],
        }));

        setRequestItemId("");
    };

    const updateRequestItem = (
        index: number,
        field: string,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            items: current.items.map(
                (item, itemIndex) => {
                    if (itemIndex !== index) {
                        return item;
                    }

                    if (field === "requested_qty") {
                        return {
                            ...item,
                            requested_qty: value,
                            approved_qty: value,
                        };
                    }

                    return {
                        ...item,
                        [field]: value,
                    };
                }
            ),
        }));
    };

    const removeItem = (index: number) => {
        setForm((current) => ({
            ...current,
            items: current.items.filter(
                (_, itemIndex) => itemIndex !== index
            ),
        }));
    };

    const submitRequest = async () => {
        if (
            !form.supplier_id ||
            form.items.length === 0
        ) {
            toast.error(
                "Supplier and at least one item are required."
            );
            return;
        }

        const hasInvalidItem = form.items.some(
            (item) =>
                Number(item.requested_qty) <= 0 ||
                Number(item.approved_qty) <= 0 ||
                Number(item.unit_price) < 0
        );

        if (hasInvalidItem) {
            toast.error(
                "Requested and approved quantities must be greater than zero, and unit price cannot be negative."
            );
            return;
        }

        const accepted = await confirm({
            title: "Create Replenishment Request",
            message:
                "Are you sure you want to create this request?",
        });

        if (!accepted) return;

        setSubmitting(true);

        try {
            const response =
                await createReplenishment(form);

            if (response.error) {
                toast.error(messageOf(response));
                return;
            }

            toast.success(response.data.message);

            closeModal();

            onSubmitCallback?.();
        } catch {
            toast.error("Error encountered");
        } finally {
            setSubmitting(false);
        }
    };

    const requestTotal = form.items.reduce(
        (total: number, item: any) =>
            total +
            Number(item.approved_qty || 0) *
            Number(item.unit_price || 0),
        0
    );

    const lineColumnSettings = [
        {
            columnHead: "Item",
            path: "item",
            columnType: COLUMNTYPES.function,
            function: (line: any) => (
                <>
                    {line.item?.item_no} - {line.item?.description}
                </>
            ),
        },
        {
            columnHead: "Stock on hand",
            path: "item.stock_on_hand",
            columnType: COLUMNTYPES.function,
            function: (line: any) =>
                Number(line.item?.stock_on_hand ?? 0).toLocaleString(),
        },
       {
            columnHead: "Requested Quantity",
            path: "requested_qty",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const index = form.items.findIndex(
                    (item: any) =>
                        String(item.uniform_item_id) ===
                        String(data.uniform_item_id)
                );

                return (
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        className={numericLineInputClassName}
                        value={data.requested_qty ?? ""}
                        onChange={(e) =>
                            updateReplenishmentItem(
                                index,
                                "requested_qty",
                                e.target.value
                            )
                        }
                    />
                );
            },
        },


        {
            columnHead: "Approved",
            path: "approved_qty",
            columnType: COLUMNTYPES.function,
            function: (line: any) => (
                <input
                    type="number"
                    className={readOnlyNumericLineInputClassName}
                    value={line.approved_qty ?? ""}
                    readOnly
                />
            ),
        },
        {
            columnHead: "Unit Price",
            path: "unit_price",
            columnType: COLUMNTYPES.function,
            function: (line: any) => (
                <input
                    type="number"
                    className={readOnlyNumericLineInputClassName}
                    value={line.unit_price ?? ""}
                    readOnly
                />
            ),
        },
        {
            columnHead: "Total Amount",
            path: "total_amount",
            columnType: COLUMNTYPES.function,
            function: (line: any) =>
                (
                    Number(line.approved_qty || 0) *
                    Number(line.unit_price || 0)
                ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
        },
        {
            columnHead: "Remarks",
            path: "remarks",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const index = form.items.findIndex(
                    (item: any) =>
                        String(item.uniform_item_id) ===
                        String(data.uniform_item_id)
                );

                return (
                    <input
                        type="text"
                        className={lineInputClassName}
                        value={data.remarks ?? ""}
                        onChange={(e) =>
                            updateReplenishmentItem(
                                index,
                                "remarks",
                                e.target.value
                            )
                        }
                    />
                );
            },
        },
        {
            columnHead: "Action",
            path: "uniform_item_id",
            columnType: COLUMNTYPES.function,
            function: (line: any) => {
                const index = form.items.findIndex(
                    (item: any) =>
                        String(item.uniform_item_id) ===
                        String(line.uniform_item_id)
                );

                return (
                    <button
                        type="button"
                        className="text-red-600 hover:underline"
                        onClick={() => removeItem(index)}
                    >
                        Remove
                    </button>
                );
            },
        },

    ];


    return (
        <Modal
            isShowing={modal.isShowing}
            title="New Replenishment Request"
            onClose={closeModal}
            size="xxl"
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    submitRequest();
                }}
            >
                <SearchableDropDown
                    label="Supplier"
                    placeholder="select supplier"
                    name="supplier_id"
                    value={form.supplier_id}
                    required
                    onChange={(event) => {
                        setForm({
                            ...form,
                            supplier_id: event.target.value,
                            items: [],
                        });

                        setRequestItemId("");
                    }}
                    options={suppliers.map((supplier) => ({
                        label: supplier.vendor_name,
                        value: String(supplier.id),
                    }))}
                />

                <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                    <Dropdown
                        label="Request Type"
                        placeholder="select request type"
                        name="replenishment_type"
                        value={form.replenishment_type}
                        required
                        onChange={(event) =>
                            setForm({
                                ...form,
                                replenishment_type:
                                    event.target.value,
                            })
                        }
                        options={[
                            {
                                label: "Purchasing Department",
                                value: "Purchasing Department",
                            },
                            {
                                label: "Made to Order",
                                value: "Made to Order",
                            },
                        ]}
                    />

                    <Textfield
                        label="Requested Date"
                        name="requested_date"
                        type="date"
                        value={form.requested_date}
                        required
                        onChange={(event) =>
                            setForm({
                                ...form,
                                requested_date:
                                    event.target.value,
                            })
                        }
                    />
                </div>

                <div className="flex mt-4 font-semibold border-b border-slate-300 pb-1 mb-1 items-center justify-between">
                    <span>Request Items</span>

                    <div className="flex flex-wrap justify-end gap-x-3 gap-y-2">
                        <input
                            ref={importInputRef}
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls,.csv,.txt"
                            onChange={(event) =>
                                handleImportItems(
                                    event.target.files?.[0]
                                )
                            }
                        />

                        <DropDownButtons
                            actions={[
                                {
                                    label: "Generate List",
                                    onClick:
                                        handleGenerateList,
                                },
                                {
                                    label:
                                        "Import Supplier/Item list",
                                    onClick: () =>
                                        importInputRef.current?.click(),
                                },
                            ]}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-3 md:grid-cols-5">
                    <div className="col-span-4">
                        <SearchableDropDown
                            label="Description"
                            placeholder="select description"
                            name="uniform_item_id"
                            value={requestItemId}
                            disabled={!form.supplier_id}
                            onChange={(event) =>
                                setRequestItemId(
                                    event.target.value
                                )
                            }
                            options={availableItems.map(
                                (item) => ({
                                    label: `${item.item_no} - ${item.description} (${item.size?.description ?? ""})`,
                                    value: String(item.id),
                                })
                            )}
                        />
                    </div>

                    <div className="col-span-1 mt-3">
                        <Button
                            label="Add Request"
                            variant="success"
                            type="button"
                            onClick={() =>
                                addRequestItem(
                                    requestItemId
                                )
                            }
                        />
                    </div>
                </div>

                <Table
                    dataSet={form.items}
                    columnSettings={lineColumnSettings}
                    loading={false}
                    fixed
                />

                <TextArea
                    label="Overall Remarks"
                    name="remarks"
                    value={form.remarks}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            remarks: event.target.value,
                        })
                    }
                />

                <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                    <div>
                        Showing {form.items.length}{" "}
                        {form.items.length === 1
                            ? "item"
                            : "items"}
                    </div>

                    <div className="text-right">
                        <span>
                            Total Amount:
                        </span>

                        <span className="ml-2 font-semibold">
                            {requestTotal.toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </span>
                    </div>
                </div>

                <hr className="mt-6 pb-2 text-slate-300" />

                <div className="flex justify-end">
                    <div className="w-[120px]">
                        <Button
                            type="submit"
                            label="Submit"
                            loading={submitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ReplenishmentRequestCreateForm;
