"use client";

import {
    createPhysicalCount,
    exportPhysicalCountDetails,
    exportPhysicalCounts,
    getPhysicalCounts,
    previewPhysicalCount,
    updateQuantity
} from "@/api/uniform/physical-count";
import PhysicalCountViewForm from "./PhysicalCountViewForm";
import PhysicalCountCancelForm from "./PhysicalCountCancelForm";
import ActionDropDown from "@/components/common/ActionDropDown";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Dropdown from "@/components/common/Dropdown";
import DropDownButtons from "@/components/common/DropDownButtons";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import FilterCard from "@/components/modules/cards/FilterCard";
import EmployeeMultiSelect from "@/components/modules/generic/EmployeeMultiSelect";
import { COLUMNTYPES } from "@/constants/column";
import * as XLSX from "xlsx-js-style";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useFormik } from "formik";
import moment from "moment";
import { useState, useRef , useEffect } from "react";
import { toast } from "react-toastify";
import PasswordForm from "./PasswordForm";
import ChangeQuanityForm from "./PhysicalChangeQuantityForm";

interface TableCardProps {
    performPermission: string;
    reviewPermission?: string;
    postPermission?: string;
}

const title = "Physical Count";
const today = () => new Date().toISOString().slice(0, 10);

const numberValue = (value: any) => Number(value || 0);

const money = (value: any) => numberValue(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const inputClassName = "w-full min-h-10 rounded-md border-2 border-slate-300 bg-transparent p-2 text-right focus:border-slate-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800";
const textInputClassName = inputClassName.replace("text-right", "text-left");

const responseMessage = (resp: any) =>
    resp?.message ?? resp?.data?.message ?? "Unable to complete request.";

const getStatusBadge = (status: string): "success" | "warning" | "danger" | "purpose" |"default" => {
    switch (status) {
        case "Posted":
            return "success";
        case "Reviewed":
            return "warning";
        case "Cancelled":
            return "danger";
        case "Updated":
            return "purpose";
        default:
            return "default";
    }
};

const PhysicalCountTableCard = ({
    performPermission,
    reviewPermission = performPermission,
    postPermission = performPermission,
}: TableCardProps) => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const formModal = useModal();
    const viewModal = useModal();
    const passwordModal = useModal();
    const cancelModal = useModal();
    const activityLog = useModal();
    const changeQuantityModal = useModal();
    const importInputRef = useRef<HTMLInputElement | null>(null);
    const [selected, setSelected] = useState<any>(null);
    const [hasGeneratedData, setHasGeneratedData] = useState(false);
    const [modalType, setModalType] = useState<"View" | "Review" | "Post">("View");
    const [physicalCounts, setPhysicalCounts] = useState<any[]>([]);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [password , setPassword] = useState("");
    const [changeQuantityItems , setChangeQuantityItems] = useState<any[]>([]);
    const physicalCountForm = useFormik({
        initialValues: {
            begin_date: today(),
            ending_date: today(),
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

            formModal.setLoading(true);

            try {
                const resp = await createPhysicalCount({
                    begin_date: values.begin_date,
                    ending_date: values.ending_date,
                    counted_by_employee_ids: values.counted_by_employees.map((employee: any) => employee.id),
                    remarks: values.remarks,
                    items: values.items,
                });

                if (resp?.error || resp?.errors) {
                    toast.error(responseMessage(resp));
                    return;
                }

                toast.success(`${title} created`);
                formModal.onClose();
                api.triggerReload();
            } catch {
                toast.error("Error encountered");
            } finally {
                formModal.setLoading(false);
            }
        },
    });


    const fetchRecords = () => {
        api.setLoading(true);

        getPhysicalCounts({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
            .then((resp: any) => {
                if (resp?.error) {
                    toast.error(responseMessage(resp));
                    return;
                }

                api.setDataSet(resp.data ?? []);
                setPhysicalCounts(resp.data ?? []);
                paginator.setPage(resp.current_page ?? 1);
                paginator.setPaginationData(resp);
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    };

    useAsyncEffect(fetchRecords, [paginator.reload, api.reload, filter.reload]);

    const openCreate = () => {
        const lastRecord = api.dataSet?.filter((record:any)=> record.status ==="Updated")
         ?.sort(
            (a: any, b: any) =>
                new Date(b.begin_date).getTime() -
                new Date(a.begin_date).getTime()
        )[0];

        physicalCountForm.setValues({
            begin_date: lastRecord?.ending_date ?? today(),
            ending_date: today(),
            counted_by_employees: [],
            remarks: "",
            total_sales: 0,
            items: [],
        });

        formModal.onOpen();
    };

    const loadPreview = async () => {
        if (physicalCountForm.values.begin_date > physicalCountForm.values.ending_date) {
            toast.error("Begin date cannot be later than ending date");
            return false;
        }

        setIsLoadingPreview(true);

        physicalCountForm.setValues(prev => ({
            ...prev,
            items: [],
            total_sales: 0,
        }));

        try {
            const resp = await previewPhysicalCount({
                begin_date: physicalCountForm.values.begin_date,
                ending_date: physicalCountForm.values.ending_date,
                items: physicalCountForm.values.items,
            });

            if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));
                return false;
            }

            const previewItems = resp?.items?.items ?? [];

            physicalCountForm.setValues(prev => ({
                ...prev,
                items: previewItems,
                total_sales: resp?.items?.total_sales ?? 0,
            }));

            if (previewItems.length === 0) {
                toast.info("No data found");
                return false;
            }

            toast.success("Physical count preview loaded successfully");
            return true;

        } catch {
            toast.error("Error encountered");
            return false;
        } finally {
            setIsLoadingPreview(false);
        }
    };


    useEffect(() => {
    if (physicalCounts.length > 0) {
        const latestPosted = physicalCounts
            .filter((pc: any) => pc.status === "Posted")
            .sort(
                (a: any, b: any) =>
                    new Date(b.begin_date).getTime() -
                    new Date(a.begin_date).getTime()
            )[0];

        if (latestPosted) {
            physicalCountForm.setFieldValue("begin_date", latestPosted.begin_date);
        }
    }
    }, [physicalCounts]);

    const downloadDetailedExport = async (record: any) => {
        const resp = await exportPhysicalCountDetails(record.id);
        const payload = resp?.data ?? resp;
        const isBlob = payload instanceof Blob;
        const isArrayBuffer = payload && payload.byteLength !== undefined;

        if (!resp || resp.error || (!isBlob && !isArrayBuffer)) {
            toast.error(resp?.data?.message || resp?.message || "Export failed. Please try again.");
            return;
        }

        const blob = isBlob ? payload : new Blob([payload], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = downloadUrl;
        anchor.download = `PHYSICAL-COUNT-DETAILED-${record.physical_count_no}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };

    const downloadTemplate = () => {
        const data = physicalCountForm.values.items.map((item) => ({
            "ID": item.uniform_item_id,
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

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Physical Count"
        );

        XLSX.writeFile(
            workbook,
            "physical-count-template.xlsx"
        );
    };

    const handleDownloadTemplate = () => {
        if (!physicalCountForm.values.items || physicalCountForm.values.items.length === 0) {
            toast.error("Please generate the data first before downloading the template.");
            return;
        }

        downloadTemplate();
    };

    const handleImportItems = async (file?: File) => {
        if (!file) return;

        if (!hasGeneratedData || physicalCountForm.values.items.length === 0) {
            toast.error("Please generate the data first before importing.");
            return;
        }

        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json<any>(worksheet);

            for (const row of data) {
                const originalItem = physicalCountForm.values.items.find(
                    (item) => item.uniform_item_id === row["ID"]
                );

                if (!originalItem) {
                    toast.error(`Invalid Item ID: ${row["ID"]}`);
                    return;
                }

                if (
                    row["Item Code"] !== originalItem.item_no ||
                    row["Item Description"] !== originalItem.description ||
                    row["Standard UOM"] !== originalItem.uom ||
                    Number(row["Beginning Inventory"] ?? 0) !== Number(originalItem.beginning_inventory) ||
                    Number(row["Total Purchases"] ?? 0) !== Number(originalItem.total_purchases) ||
                    Number(row["Total Outgoing"] ?? 0) !== Number(originalItem.total_outgoing) ||
                    Number(row["Should be Inventory"] ?? 0) !== Number(originalItem.should_be_inventory)
                ) {
                    toast.error(
                        `Generated data was modified for Item ID ${row["ID"]}. Only Physical Count and Item Remarks can be edited.`
                    );
                    return;
                }
            }

            const importedItems = data.map((row) => {
                const physical_count = Number(row["Physical Count"]);
                const originalItem = physicalCountForm.values.items.find(
                    (item) => item.uniform_item_id === row["ID"]
                );
                return {
                    ...originalItem,

                    physical_count: Math.max(0,Number.isNaN(physical_count) ? 0 : physical_count),
                    item_remarks: row["Item Remarks"] ?? "",
                };
            });


            physicalCountForm.setFieldValue("items", importedItems);

            toast.success("Items imported successfully");

        } catch (error) {
            console.error(error);
            toast.error("Failed to import Excel file");
        } finally {
            if (importInputRef.current) {
                importInputRef.current.value = "";
            }
        }
    };

    const actionsFor = (record: any) => [
        {
            label: "View",
            onClick: () => {
                setModalType("View");
                setSelected(record);
                viewModal.onOpen();
            },
        },
        {
            label: "Detailed Export",
            onClick: () => downloadDetailedExport(record),
        },
        record.status === "Unposted" && {
            label: "Review",
            permission: reviewPermission,
            onClick: () =>{
                setModalType("Review");
                setSelected(record);
                viewModal.onOpen();
            },
        },
        record.status === "Reviewed" && {
            label: "Post",
            permission: postPermission,
             onClick: () =>{
                setModalType("Post");
                setSelected(record);
                viewModal.onOpen();
            },
        },
        ["Unposted", "Reviewed"].includes(record.status) && {
            label: "Cancel",
            permission: performPermission,
            onClick: () => {
                setSelected(record);
                cancelModal.onOpen();
            },
        },
        record.status === "Posted" && {
            label : "Update to Masterlist",
            permission: performPermission,
            onClick: () => {
                setSelected(record);
                passwordModal.onOpen();
            }

        }
    ].filter(Boolean) as any[];

    const columns = [
        { columnHead: "Physical Count No.", path: "physical_count_no", columnType: COLUMNTYPES.string },
        {
        columnHead: "Covered Date" , path: "" , columnType:COLUMNTYPES.function,
            function:(data: any) => {
                const begin_date = data.begin_date ? moment(data.begin_date).format("MM/DD/YYYY") : "-";
                const end_date = data.ending_date ? moment(data.ending_date).format("MM/DD/YYYY") : "-";
                return `${begin_date} To ${end_date}`
            }
        },
        {columnHead: "Ending Inventory Date" , path: "" ,columnType:COLUMNTYPES.function,
            function:(data: any) => {
                const ending_inventory_date = data.ending_date ? moment(data.ending_date).format("MM/DD/YYYY") : "";
                return `${ending_inventory_date}`
            }
        },
        { columnHead: "Counted By", path: "counted_by", columnType: COLUMNTYPES.string },

       {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (record: any) => (
                <Badge
                    status={getStatusBadge(record.status)}
                    label={record.status}
                />
            ),
        },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
            function: (record: any) => <ActionDropDown data={record} actions={actionsFor(record)} />,
        },
    ];

    const beginDateOptions = Array.from(
        new Map(
            physicalCounts
                .filter((pc: any) => pc.status !== "Cancelled" && pc.ending_date)
                .map((pc: any) => [pc.ending_date, pc])
        ).values()
    )
        .sort((a: any, b: any) => new Date(b.ending_date).getTime() - new Date(a.ending_date).getTime())
        .map((pc: any) => ({
            label: moment(pc.ending_date).format("MM/DD/YYYY"),
            value: moment(pc.ending_date).format("YYYY-MM-DD"),
        }));

    const filterColumns = [
        { columnHead: "Physical Count No.", path: "physical_count_no" },
        { columnHead: "Counted By", path: "counted_by" },
        { columnHead: "Status", path: "status" },
        { columnHead: "Prepared By", path: "prepared_by" },
        { columnHead: "Reviewed By", path: "reviewed_by" },
        { columnHead: "Posted By", path: "posted_by" },
        { columnHead: "Cancelled By", path: "cancelled_by" },
    ];

    const statusOptions = [
        { label: "Unposted", value: "Unposted" },
        { label: "Reviewed", value: "Reviewed" },
        { label: "Posted", value: "Posted" },
        { label: "Cancelled", value: "Cancelled" },
    ];

    const updatePhysicalItem = (index: number, key: string, value: any) => {
        physicalCountForm.setValues(prev => ({
            ...prev,
            items: prev.items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [key]: value } : item
            ),
        }));
    };

    const confirmPassword = () => { 
        if (password !== process.env.NEXT_PUBLIC_WEIGHTED_AVERAGE_PASSWORD) { 
            toast.error("Invalid password"); 
            return; 
        } 
        if(!selected?.items || selected.items.length === 0){
            toast.error("No items Founds");
        }
        setChangeQuantityItems(selected.items); 
        passwordModal.onClose(); 
        setPassword(""); 
        changeQuantityModal.onOpen(); 
    };
  

    const actionbutton = [
        {
            label: "Generate Data",
            onClick: async () => {
                const success = await loadPreview();

                if (success) {
                    setHasGeneratedData(true);
                }
            },
        },
        {
            label: "Download Template",
            onClick : handleDownloadTemplate,
        },
        {
            label: "Import Data",
            onClick: () => importInputRef.current?.click()
        }
    ]

   const saveChangeQuantity = async () => 
    {
        if (!changeQuantityItems.length) { 
            toast.error("No items to update."); 
            return; 
        } 
        try { 
            await updateQuantity({ 
                physical_count_id: selected?.physical_count_no, 
                items: changeQuantityItems.map((item: any) => ({ 
                    item_no: item.item_no,
                     physical_count: Number(item.physical_count || 0), 
                    })),
                }); 
                     
                toast.success( "All quantities updated successfully." ); 
                changeQuantityModal.onClose(); 
                api.triggerReload(); 
            } 
        catch (error) { 
            console.error(error); 
            toast.error("Failed to update quantities."); 
        } 
    };
    
    const exportChangeQuantityItems = () => {
        const exportData = changeQuantityItems.map(item => ({
            "Uniform Number": item.item_no,
            "Description": item.description,
            "UOM" : item.uom,
            "Beginning Inventory": item.beginning_inventory,
            "Purchases":item.total_purchases,
            "ATD": item.atd,
            "Free Uniform": item.free_uniform,
            "Total Outgoing": item.total_outgoing,
            "Should Be": item.should_be_inventory,
            "Physical Count": item.physical_count,
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const shouldBe = "I";
        const physicalCount = "J";

        for (let row = 2; row <= exportData.length + 1; row++) {
            const shouldbe = worksheet[`${shouldBe}${row}`]?.v;
            const physicalcount = worksheet[`${physicalCount}${row}`]?.v;

            if (Number(shouldbe).toFixed(2) !== Number(physicalcount).toFixed(2)) {
                for (let col = 0; col < 10; col++) {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Quantity");
        XLSX.writeFile(workbook, `UPDATED_QUANTITY_ITEMS-${moment().format("YYYY-MM-DD")}.xlsx`);
    };


    return (
        <>
            <FilterCard
                columnSettings={filterColumns}
                filterHandler={filter}
                withStatus
                statusOption={statusOptions}
                hasDateRange
                dateLabel="Physical Count Date"
                defaultColumnSelected="physical_count_no"
                hasExport
                api={exportPhysicalCounts}
                exportFileName={`PHYSICAL-COUNT-${moment().format("YYYY-MM-DD")}.xls`}
                callBack={() => paginator.setPage(1)}
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons actions={[{ label: `Generate ${title}`, onClick: openCreate }]} />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columns}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <Modal
                size="xxl"
                title={`Generate ${title}`}
                isShowing={formModal.isShowing}
                loading={formModal.loading}
                onClose={() => {formModal.onClose(); setHasGeneratedData(false);  }}
            >
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                    <Dropdown
                        label="Beginning Date"
                        placeholder="select ending inventory date"
                        name="begin_date"
                        value={physicalCountForm.values.begin_date}
                        onChange={(e: any) => physicalCountForm.setFieldValue("begin_date", e.target.value)}
                        options={beginDateOptions}
                        required
                    />
                    <Textfield
                        label="Ending Date"
                        type="date"
                        value={physicalCountForm.values.ending_date}
                        onChange={(e) => physicalCountForm.setFieldValue("ending_date", e.target.value)}
                        required
                    />
                </div>
                <div className="mt-1">
                    <EmployeeMultiSelect
                        label="Counted By"
                        value={physicalCountForm.values.counted_by_employees}
                        onChange={(employees) => physicalCountForm.setFieldValue("counted_by_employees", employees)}
                        required
                    />
                </div>
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-1">
                    <Textfield
                        label="Remarks"
                        value={physicalCountForm.values.remarks}
                        onChange={(e: any) => physicalCountForm.setFieldValue("remarks", e.target.value)}
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
                        <DropDownButtons actions={actionbutton} />

                    </div>
                </div>

                <PhysicalCountItemsTable 
                items={physicalCountForm.values.items} 
                editable 
                loading={isLoadingPreview} 
                onChange={updatePhysicalItem} />

                <div className="flex justify-end gap-x-2 mt-3">
                    <div className="w-[120px]">
                        <Button
                            label="Submit"
                            loading={physicalCountForm.isSubmitting}
                            onClick={() => physicalCountForm.handleSubmit()}
                        />
                    </div>
                </div>
            </Modal>
            <PhysicalCountViewForm
                modal={viewModal}
                modalType={modalType}
                title={title}
                selected={selected}  
                onReload={api.triggerReload}
            />
            <PhysicalCountCancelForm
                modal={cancelModal}
                title={title}
                selected = {selected}
                responseMessage = {responseMessage}
                onSubmitCallback={api.triggerReload}
            />
           <PasswordForm
                modal={passwordModal}
                password={password}
                setPassword={setPassword}
                onConfirm={confirmPassword}
            />
           <ChangeQuanityForm
                modal={changeQuantityModal}
                items={changeQuantityItems}
                onExport={exportChangeQuantityItems}
                onUpdate={saveChangeQuantity}
            />

        </>
    );
};

const PhysicalCountItemsTable = ({
    items,
    editable = false,
    loading=false,
    onChange,
}: {
    items: any[];
    editable?: boolean;
    loading?:boolean;
    onChange?: (index: number, key: string, value: any) => void;
}) => (
    <div>
        <div className="overflow-auto max-h-[60vh] relative">
            <table className="table-auto w-full border-collapse dark:text-slate-200 dark:bg-neutral-800">
                <thead className="sticky top-0 z-20">
                    <tr>
                        {["Item Code", "Description", "UOM", "Beginning", "Purchases", "Outgoing", "Should Be", "Physical Count", "Remarks"].map(header => (
                            <th key={header} className="p-3 bg-red-800 text-left text-zinc-100">{header}</th>
                        ))}
                    </tr>
                </thead>
                
                <tbody>
                    
                     {loading ? (
                        <tr>
                            <td colSpan={10} className="p-8 text-center">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-red-800" />
                                    <span className="text-sm text-gray-500">
                                        Generating data...
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="border-1 border-slate-300 dark:border-neutral-700 p-2 text-center">
                                <EmptyState />
                                <p>No data available...</p>
                            </td>
                        </tr>
                    ) : (
                    items.map((item, index) => (
                        <tr key={item.uniform_item_id ?? index}>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{item.item_no}</td>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{item.description}</td>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{item.uom ?? "-"}</td>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{money(item.beginning_inventory)}</td>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{money(item.total_purchases)}</td>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{money(item.total_outgoing)}</td>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">{money(item.should_be_inventory)}</td>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">
                            {editable ? (
                                <input
                                className={inputClassName}
                                type="number"
                                min={0}
                                value={item.physical_count ?? 0}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value));
                                    onChange?.(index, "physical_count", value);
                                }}
                                />
                                ) : (
                                    money(item.physical_count)
                                )}
                            </td>
                            <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700">
                                {editable ? (
                                    <input className={textInputClassName} value={item.item_remarks ?? ""} onChange={(e) => onChange?.(index, "item_remarks", e.target.value)} />
                                ) : item.item_remarks ?? "-"}
                            </td>
                        </tr>
                    )))}
                </tbody>
            </table>
        </div>
        <div className="mt-1 text-xs text-gray-400">
            Showing {items.length} {items.length === 1 ? "item" : "items"}
        </div>
        <div className="flex justify-end mt-1 text-sm">
            <span className="text-gray-500 font-normal">
                Total Amount:
            </span>
            <span className="ml-2 font-semibold">
                {items
                    .reduce(
                        (total: number, item: any) =>
                            total + Number(item.physical_count || 0) * Number(item.unit_price || 0),
                        0
                    )
                    .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
            </span>
        </div>
    </div>
    
);

export default PhysicalCountTableCard;