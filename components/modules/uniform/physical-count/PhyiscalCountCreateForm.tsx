"use client";

import {
  createPhysicalCount,
  previewPhysicalCount,
} from "@/api/uniform/physical-count";

import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import DropDownButtons from "@/components/common/DropDownButtons";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Table from "@/components/common/Table";
import EmployeeMultiSelect from "@/components/modules/generic/EmployeeMultiSelect";
import { COLUMNTYPES } from "@/constants/column";

import { useFormik } from "formik";
import * as XLSX from "xlsx-js-style";
import { useRef, useState , useEffect} from "react";
import { toast } from "react-toastify";

interface PhysicalCountCreateModalProps {
  modal: any;

  beginDateOptions: {
    label: string;
    value: string;
  }[];

  onCreated?: () => void;
}

const title = "Physical Count";

const today = () => new Date().toISOString().slice(0, 10);

const numberValue = (value: any) => Number(value || 0);

const money = (value: any) =>
  numberValue(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const inputClassName =
  "w-full min-h-10 rounded-md border-2 border-slate-300 bg-transparent p-2 text-right focus:border-slate-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800";

const textInputClassName = inputClassName.replace("text-right", "text-left");

const responseMessage = (resp: any) =>
  resp?.message ?? resp?.data?.message ?? "Unable to complete request.";

const PhysicalCountCreateForm = ({
  modal,
  beginDateOptions,
  onCreated,
}: PhysicalCountCreateModalProps) => {
    const importInputRef = useRef<HTMLInputElement | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [hasGeneratedData, setHasGeneratedData] = useState(false);
    const form = useFormik({
        initialValues: {
        begin_date: beginDateOptions?.[0]?.value,
        ending_date: "",
        counted_by_employees: [] as any[],
        remarks: "",
        total_sales: 0,
        items: [] as any[],
        },

        onSubmit: async (values) => {
            if (!values.items.length) {
                toast.error("Load items first.");
                return;
            }
            if (!values.counted_by_employees.length) {
                toast.error("Counted By required!");
                return;
            }
            if (!values.ending_date) {
                toast.error("Please select an Ending Date.");
                return;
            }
            if (values.begin_date > values.ending_date) {
                toast.error("Begin date cannot be later than ending date.");
                return;
            }
            modal.setLoading(true);
            try {
                const resp = await createPhysicalCount({
                begin_date: values.begin_date,
                ending_date: values.ending_date,
                counted_by_employee_ids: values.counted_by_employees.map(
                    (employee: any) => employee.id,
                ),
                remarks: values.remarks,
                items: values.items,
                });
                if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));
                return;
                }
                toast.success(`${title} created`);
                resetForm();
                modal.onClose();
                onCreated?.();
            } catch (error) {
                console.error("Error creating physical count:", error);
                toast.error("Error encountered");
            } finally {
                modal.setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (modal.isOpen && beginDateOptions?.length > 0) {
            form.setFieldValue(
                "begin_date",
                beginDateOptions[0].value
            );
        }
    }, [modal.isOpen, beginDateOptions]);

    const resetForm = () => {
        form.resetForm({
        values: {
            begin_date: beginDateOptions?.[0]?.value,
            ending_date: "",
            counted_by_employees: [],
            remarks: "",
            total_sales: 0,
            items: [],
        },
        });
    setHasGeneratedData(false);
    setIsLoadingPreview(false);
        if (importInputRef.current) {
        importInputRef.current.value = "";
        }
    };

    const loadPreview = async () => {
        if (!form.values.ending_date) {
        toast.error("Please select an Ending Date.");
        return false;
        }
        if (form.values.begin_date > form.values.ending_date) {
        toast.error("Begin date cannot be later than ending date");
        return false;
        }
        setIsLoadingPreview(true);
        form.setValues((prev) => ({
        ...prev,
        items: [],
        total_sales: 0,
        }));

        try {
            const resp = await previewPhysicalCount({
                begin_date: form.values.begin_date,
                ending_date: form.values.ending_date,
                items: form.values.items,
            });
            if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));
                return false;
            }
            const previewItems = resp?.items?.items ?? [];
            form.setValues((prev) => ({
                ...prev,
                items: previewItems,
                total_sales: resp?.items?.total_sales ?? 0,
            }));
            if (!previewItems.length) {
                toast.info("No data found");
                setHasGeneratedData(false);
                return false;
            }
            setHasGeneratedData(true);
            toast.success("Physical count preview loaded successfully");
            return true;
        } catch (error) {
            console.error("Error loading preview:", error);
            toast.error("Error encountered");
            return false;
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const updatePhysicalItem = (index: number, key: string, value: any) => {
        if (index < 0) {
        return;
        }
        form.setValues((prev) => ({
        ...prev,
        items: prev.items.map((item, itemIndex) =>
            itemIndex === index
            ? {
                ...item,
                [key]: value,
                }
            : item,
        ),
        }));
    };

    const downloadTemplate = () => {
        if (!form.values.items.length) {
        toast.error(
            "Please generate the data first before downloading the template.",
        );
        return;
        }
        const data = form.values.items.map((item: any) => ({
        ID: item.uniform_item_id,
        "Item Code": item.item_no,
        "Item Description": item.description,
        "Standard UOM": item.uom,
        "Beginning Inventory": item.beginning_inventory,
        "Total Purchases": item.total_purchases,
        "Total Outgoing": item.total_outgoing,
        "Should be Inventory": item.should_be_inventory,
        "Physical Count": "",
        "Item Remarks": "",
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Physical Count");
        XLSX.writeFile(workbook, "physical-count-template.xlsx");
    };

    const handleImportItems = async (file?: File) => {
        if (!file) {
            return;
        }
        if (!hasGeneratedData || !form.values.items.length) {
            toast.error("Please generate the data first before importing.");
            return;
        }

        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json<any>(worksheet);
            if (!data.length) {
                toast.error("The Excel file contains no data.");
                return;
            }
            for (const row of data) {
                const originalItem = form.values.items.find(
                (item: any) => String(item.uniform_item_id) === String(row["ID"]),
                );
                if (!originalItem) {
                    toast.error(`Invalid Item ID: ${row["ID"]}`);
                    return;
                }

                const isModified =
                row["Item Code"] !== originalItem.item_no ||
                row["Item Description"] !== originalItem.description ||
                row["Standard UOM"] !== originalItem.uom ||
                Number(row["Beginning Inventory"] ?? 0) !==
                    Number(originalItem.beginning_inventory) ||
                Number(row["Total Purchases"] ?? 0) !==
                    Number(originalItem.total_purchases) ||
                Number(row["Total Outgoing"] ?? 0) !==
                    Number(originalItem.total_outgoing) ||
                Number(row["Should be Inventory"] ?? 0) !==
                    Number(originalItem.should_be_inventory);

                if (isModified) {
                    toast.error(`Generated data was modified for Item ID ${row["ID"]}. Only Physical Count and Item Remarks can be edited.`,);
                    return;
                }
            }
            const importedItems = data.map((row) => {
                const originalItem = form.values.items.find(
                (item: any) => String(item.uniform_item_id) === String(row["ID"]),
                );
                const physicalCount = Number(row["Physical Count"]);
                return {
                ...originalItem,
                physical_count: Math.max(
                    0,
                    Number.isNaN(physicalCount) ? 0 : physicalCount,
                ),
                item_remarks: row["Item Remarks"] ?? "",
                };
            });
            form.setFieldValue("items", importedItems);
            toast.success("Items imported successfully");
        } catch (error) {
            console.error("Import error:", error);
            toast.error("Failed to import Excel file");
        } finally {
            if (importInputRef.current) {
                importInputRef.current.value = "";
            }
        }
    };

    const actionButtons = [
        {
        label: "Generate Data",
        onClick: async () => {
            await loadPreview();
        },
        },
        {
        label: "Download Template",
        onClick: downloadTemplate,
        },
        {
        label: "Import Data",
        onClick: () => importInputRef.current?.click(),
        },
    ];
    const columns = [
        {
        columnHead: "Item Code",
        path: "item_no",
        columnType: COLUMNTYPES.string,
        },
        {
        columnHead: "Description",
        path: "description",
        columnType: COLUMNTYPES.string,
        },
        {
        columnHead: "UOM",
        path: "uom",
        columnType: COLUMNTYPES.function,
        function: (data: any) => data.uom ?? "-",
        },
        {
        columnHead: "Beginning",
        path: "beginning_inventory",
        columnType: COLUMNTYPES.function,
        function: (data: any) => money(data.beginning_inventory),
        },
        {
        columnHead: "Purchases",
        path: "total_purchases",
        columnType: COLUMNTYPES.function,
        function: (data: any) => money(data.total_purchases),
        },
        {
        columnHead: "Outgoing",
        path: "total_outgoing",
        columnType: COLUMNTYPES.function,
        function: (data: any) => money(data.total_outgoing),
        },
        {
        columnHead: "Should Be",
        path: "should_be_inventory",
        columnType: COLUMNTYPES.function,
        function: (data: any) => money(data.should_be_inventory),
        },
        {
        columnHead: "Physical Count",
        path: "physical_count",
        columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const index = form.values.items.findIndex(
                (item: any) => item.uniform_item_id === data.uniform_item_id,
                );
                return (
                    <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        value={data.physical_count ?? 0}
                        onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value));

                        updatePhysicalItem(index, "physical_count", value);
                        }}
                    />
                );
            },
        },
        {
        columnHead: "Remarks",
        path: "item_remarks",
        columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const index = form.values.items.findIndex(
                (item: any) => item.uniform_item_id === data.uniform_item_id,
                );
                return (
                    <input
                        className={textInputClassName}
                        value={data.item_remarks ?? ""}
                        onChange={(e) =>
                        updatePhysicalItem(index, "item_remarks", e.target.value)
                        }
                    />
                );
            },
        },
    ];

    return (
        <Modal
            size="xxl"
            title={`Generate ${title}`}
            isShowing={modal.isShowing}
            loading={modal.loading}
            onClose={() => {
                resetForm();
                modal.onClose();
        }}
        >
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Dropdown
                label="Beginning Date"
                placeholder="Select beginning inventory date"
                name="begin_date"
                value={form.values.begin_date}
                onChange={(e: any) =>
                    form.setFieldValue("begin_date", e.target.value)
                }
                options={beginDateOptions}
                required
            />
            <Textfield
                label="Ending Date"
                type="date"
                value={form.values.ending_date}
                onChange={(e) => form.setFieldValue("ending_date", e.target.value)}
                required
            />
        </div>
        <div className="mt-1">
            <EmployeeMultiSelect
                label="Counted By"
                value={form.values.counted_by_employees}
                onChange={(employees) =>
                    form.setFieldValue("counted_by_employees", employees)
                }
                required
            />
        </div>
        <div className="grid grid-cols-1 gap-x-3">
            <Textfield
                label="Remarks"
                value={form.values.remarks}
                onChange={(e: any) => form.setFieldValue("remarks", e.target.value)}
            />
        </div>
        <div className="flex mt-4 font-semibold pb-1 mb-1 items-center justify-between">
            <span>Request Data</span>
            <div className="flex items-center gap-2">
                <input
                    ref={importInputRef}
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={(event) => handleImportItems(event.target.files?.[0])}
                />
            <DropDownButtons actions={actionButtons} />
            </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
            <Table
                dataSet={form.values.items}
                columnSettings={columns}
                loading={isLoadingPreview}
                fixed
                smallText
            />
        </div>
        <div className="flex justify-end gap-x-2 mt-3">
            <div className="w-[120px]">
                <Button
                    label="Submit"
                    loading={form.isSubmitting}
                    onClick={() => form.handleSubmit()}
                />
            </div>
        </div>
        </Modal>
    );
};

export default PhysicalCountCreateForm;
