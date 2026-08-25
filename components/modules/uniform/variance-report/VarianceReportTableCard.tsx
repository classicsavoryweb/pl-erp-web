"use client";

import {
    createVariance,
    exportVarianceDetails,
    exportVariances,
    getVariances,
    previewVariance,
    getVarianceItemDetails
} from "@/api/uniform/variance-report";
import VarianceReportViewForm from "./VarianceReportViewForm";
import VarianceReportViewItem from "./VarianceReportViewItem";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import {physicalCountDropdown} from "@/api/uniform/physical-count";
import ActionDropDown from "@/components/common/ActionDropDown";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import FilterCard from "@/components/modules/cards/FilterCard";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useState , useEffect} from "react";
import { toast } from "react-toastify";
import VarianceReportCancelForm from "./VarianceReportCancelForm";
interface TableCardProps {
    performPermission: string;
}

const title = "Variance Report";

const numberValue = (value: any) => Number(value || 0);

const today = () => new Date().toISOString().slice(0, 10);

const money = (value: any) => numberValue(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const inputClassName = "w-full min-h-10 rounded-md border-2 border-slate-300 bg-transparent p-2 text-right focus:border-slate-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800";
const textInputClassName = inputClassName.replace("text-right", "text-left");

const responseMessage = (resp: any) =>
    resp?.message ?? resp?.data?.message ?? "Unable to complete request.";

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


const VarianceReportTableCard = ({ performPermission }: TableCardProps) => {
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const formModal = useModal();
    const viewVarianceItemModal = useModal();
    const viewModal = useModal();
    const cancelModal = useModal();
    const [itemSearch, setItemSearch] = useState("");
    const [physicalCounts, setPhysicalCounts] = useState<any[]>([]);
    const [specialFilter, setSpecialFilter] = useState<string>("all");
    const [selected, setSelected] = useState<any>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [modalType, setModalType] = useState<"View" | "Review" | "Post">("View");
    const [showFilter , setShowFilter] = useState<boolean>(false);
    const [varianceForm, setVarianceForm] = useState({
        begin_date: today(),
        ending_date: today(),
        remarks: "",
        items: [] as any[],
    });

    const fetchRecords = () => {
        api.setLoading(true);

        getVariances({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
            .then((resp: any) => {
                if (resp?.error) {
                    toast.error(responseMessage(resp));
                    return;
                }

                api.setDataSet(resp.data ?? []);
                paginator.setPage(resp.current_page ?? 1);
                paginator.setPaginationData(resp);
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    };

    useAsyncEffect(fetchRecords, [paginator.reload, api.reload, filter.reload]);

    const openCreate = () => {
        setVarianceForm({
            begin_date:  physicalCounts[0].begin_date,
            ending_date: physicalCounts[0].ending_date,
            remarks: "",
            items: [],
        });

        formModal.onOpen();
    };
    

    const loadPreview = async () => {
        if (!varianceForm.begin_date || !varianceForm.ending_date) {
            toast.error("Please select Begin Date and Ending Date.");
            setShowFilter(false);
            return;
        }

        if (!moment(varianceForm.ending_date).isAfter(moment(varianceForm.begin_date))) {
            toast.error("Ending date should be greater than Beginning date");
            setShowFilter(false);
            return;
        }

        formModal.setLoading(true);

        try {
            const resp = await previewVariance({
                begin_date: varianceForm.begin_date,
                ending_date: varianceForm.ending_date,
                items: varianceForm.items,
            });

            if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));
                setShowFilter(false);
                return;
            }

            setVarianceForm(prev => ({ ...prev, items: resp.items ?? [] }));
            setShowFilter(true);
        } catch {
            toast.error("Error encountered");
        } finally {
            formModal.setLoading(false);
        }
    };

    useEffect(() => {
        const loadPhysicalCounts = async () => {
            const response = await physicalCountDropdown();

            setPhysicalCounts(response);

             if (response.length > 0) {
            setVarianceForm((prev) => ({
                ...prev,
                begin_date: response[0].begin_date,
                items: [],
            }));
        }
        };

        loadPhysicalCounts();
    }, []);

    const saveRecord = async () => {
        if (!varianceForm.items.length) {
            toast.error("Load items first.");
            return;
        }

        if (!varianceForm.remarks.trim()) {
            toast.error("Please fill up Overall Remarks.");
            return;
        }

        formModal.setLoading(true);

        try {
            const resp = await createVariance(varianceForm);

            if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));
                return;
            }

            toast.success(`${title} created`);
            formModal.onClose();
            setShowFilter(false);
            api.triggerReload();
        } catch {
            toast.error("Error encountered");
        } finally {
            formModal.setLoading(false);
        }
    };

   const handleView = async (record: any) => {
    try {
        const payload = {
            uniform_item_id: record.uniform_item_id,
            begin_date: varianceForm.begin_date,
            end_date: varianceForm.ending_date,
        };
        const response = await getVarianceItemDetails(payload);
        setSelected(response.data);
        viewVarianceItemModal.onOpen();
    } catch (error) {
        console.error("Error fetching item details:", error);
        toast.error("Unable to load item details.");
    }
    };

    const downloadDetailedExport = async (record: any) => {
        const resp = await exportVarianceDetails(record.id);
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
        anchor.download = `VARIANCE-DETAILED-${record.variance_no}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };
    
    const actionsFor = (record: any) => [
        {
            label: "View",
            onClick: () => {
                setModalType('View');
                setSelected(record);
                viewModal.onOpen();
                setItemSearch("");
            },
        },
        {
            label: "Detailed Export",
            onClick: () => downloadDetailedExport(record),
        },
        record.status === "Unposted" && {
            label: "Review",
            permission: performPermission,
            
            onClick: () => {
                setModalType("Review");
                setSelected(record);
                viewModal.onOpen();
                 setItemSearch("");
            },
        },
        record.status === "Reviewed" && {
            label: "Post",
            permission: performPermission,
            onClick: () => {
                setModalType("Post");
                setSelected(record);
                viewModal.onOpen();
                 setItemSearch("");
            },
        },
        ["Unposted", "Reviewed"].includes(record.status) && {
            label: "Cancel",
            permission: performPermission,
            onClick: () => {
                setSelected(record);
                setCancelReason("");
                cancelModal.onOpen();
            },
        },
    ].filter(Boolean) as any[];

    const columns = [
        { columnHead: "Variance No.", path: "variance_no", columnType: COLUMNTYPES.string },
        { columnHead : "Covered Date" , path : "" , columnType:COLUMNTYPES.function,
            function:(data : any) => {
                const begin_date = data.begin_date ? moment(data.begin_date).format("MM/DD/YYYY") : "-";
                const ending_date = data.ending_date ? moment(data.ending_date).format("MM/DD/YYYY") : "-";
                return `${begin_date} To ${ending_date}`;
            }
        
        },
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

    const filterColumns = [
        { columnHead: "Variance No.", path: "variance_no" },
        { columnHead: "Physical Count No.", path: "physical_count.physical_count_no" },
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

    const handleClose = () => {
    setShowFilter(false);
    formModal.onClose();
    };

    const updateVarianceItem = (index: number, key: string, value: any) => {
        setVarianceForm(prev => ({
            ...prev,
            items: prev.items.map((item, itemIndex) => {
                if (itemIndex !== index) return item;

                const next = { ...item, [key]: value };
                const variance = numberValue(next.variance);
                const adjustment = numberValue(next.adjustment);
                const finalVariance = variance + adjustment;

                return {
                    ...next,
                    final_variance: finalVariance,
                    total_variance_cost: finalVariance * numberValue(next.standard_cost),
                };
            }),
        }));
    };

   const specialFilters = [
        {
            label: "All Items",
            value: "all",
        },
        {
            label: "Items with Negative Variance",
            value: "negative",
        },
        {
            label: "Items with Positive Variance",
            value: "positive",
        },
       
    ];

    const filteredVarianceItems = varianceForm.items
        .map((item: any, index: number) => ({
        ...item,
        originalIndex: index,
    }))
    .filter((item: any) => {
        const search = itemSearch.toLowerCase().trim();

        const matchesSearch =
            !search ||
            item.item_no?.toLowerCase().includes(search) ||
            item.description?.toLowerCase().includes(search);

        if (!matchesSearch) {
            return false;
        }

        switch (specialFilter) {
            case "negative":
                return Number(item.variance) < 0;

            case "positive":
                return Number(item.variance) > 0;

            case "adjustment":
                return Number(item.adjustment ?? 0) !== 0;

            default:
                return true;
        }
    });

    return (
        <>
            <FilterCard
                columnSettings={filterColumns}
                filterHandler={filter}
                withStatus
                statusOption={statusOptions}
                hasDateRange
                dateLabel="Variance Date"
                defaultColumnSelected="variance_no"
                hasExport
                api={exportVariances}
                exportFileName={`VARIANCE-REPORT-${moment().format("YYYY-MM-DD")}.xls`}
                callBack={() => paginator.setPage(1)}
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons actions={[
                        {
                            label: `Generate ${title}`,
                            onClick: () => {
                                openCreate();
                                setItemSearch("");
                            }
                        }
                    ]}
                    />
                </div>

                <Table
                    dataSet={api.dataSet}
                    columnSettings={columns}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <Modal
                size="entireScreen"
                title={`Generate ${title}`}
                isShowing={formModal.isShowing}
                loading={formModal.loading}
                onClose={handleClose}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                       <SearchableDropDown
                            label="Beginning Inventory"
                            name="begin_date"
                            value={varianceForm.begin_date}
                            options={physicalCounts.map((pc: any) => ({
                                label: pc.begin_date,
                                value: pc.begin_date,
                            }))}
                            onChange={(event: any) => {
                                setVarianceForm((prev) => ({
                                    ...prev,
                                    begin_date: event.target.value,
                                    items: [],
                                }));
                            }}
                        />
                        <SearchableDropDown
                            label="Ending Inventory"
                            name="ending_date"
                            value={varianceForm.ending_date}
                            options={physicalCounts.map((pc:any) => ({
                                label:pc.ending_date,
                                value:pc.ending_date,
                            }))}
                            onChange={(e: any) =>
                                setVarianceForm((prev) => ({
                                    ...prev,
                                    ending_date: e.target.value,
                                    items: [],
                                }))
                            }
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <Textfield
                            label="Overall Remarks"
                            required
                            value={varianceForm.remarks}
                            onChange={(e: any) =>
                                setVarianceForm((prev) => ({
                                    ...prev,
                                    remarks: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
               <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">
                        <span>Request Data</span>
                    </div>
                    <div className="flex items-end gap-4">
                        {showFilter && (
                        <div className="flex items-end gap-4">
                            <div className="w-80">
                                <SearchableDropDown
                                    label="Special Filter"
                                    name="special_filter"
                                    value={specialFilter}
                                    options={specialFilters}
                                    onChange={(event: any) => {
                                        setSpecialFilter(event.target.value);
                                    }}
                                />
                            </div>
                            <div className="w-80">
                                <Textfield
                                    label="Search Item"
                                    value={itemSearch}
                                    onChange={(e: any) => setItemSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        )}
                       
                        <div className="w-[140px] font-semibold">
                            <Button 
                                type="button"
                                variant="success"
                                label="Generate Data"
                                onClick={() => {                                   
                                    loadPreview();
                                }}
                            />
                        </div>
                    </div>
                </div>
                <VarianceItemsTable
                    items={filteredVarianceItems}
                    editable
                    onChange={(index: number, key: string, value: any) =>
                        updateVarianceItem(
                            filteredVarianceItems[index].originalIndex,
                            key,
                            value
                        )
                    }
                    onView={handleView}
                />
                <div className="flex justify-end gap-x-2 mt-3">
                    <div className="w-[120px]"><Button label="Submit" onClick={saveRecord} /></div>
                </div>
            </Modal>
            <VarianceReportViewForm
                modal={viewModal}
                modalType={modalType}
                title={title}
                selected={selected}
                specialFilter={specialFilter}
                setSpecialFilter ={setSpecialFilter}
                itemSearch = {itemSearch}
                setItemSearch = {setItemSearch}
                onReload={api.triggerReload}
            />
            <VarianceReportCancelForm
                modal={cancelModal}
                title={title}
                selected={selected}
                responseMessage={responseMessage}
                onSubmitCallback ={api.triggerReload}
            />
            <VarianceReportViewItem
                modal={viewVarianceItemModal}
                formValue ={selected}
            />
        </>
    );
};

const VarianceItemsTable = ({
    items,
    editable = false,
    onChange,
    onView,
}: {
    items: any[];
    editable?: boolean;
    onChange?: (index: number, key: string, value: any) => void;
    onView?: (record: any) => void;
    
}) => {
       const totalPositiveVarianceCost = items.reduce(
        (total: number, item: any) => {
            const value = Number(item.total_variance_cost || 0);
            return total + (value > 0 ? value : 0);
        },
        0
    );

    const totalNegativeVarianceCost = items.reduce(
        (total: number, item: any) => {
            const value = Number(item.total_variance_cost || 0);
            return total + (value < 0 ? value : 0);
        },
        0
    );
    return (
        <>
            <div>
                <div className="overflow-auto max-h-[60vh] relative">
                    <table className="table-auto w-full border-collapse dark:text-slate-200 dark:bg-neutral-800">
                        <thead className="sticky top-0 z-20 text-xs">
                            <tr>
                                {["Item Code", "Description", "Beginning", "Purch Dept", "Made Order", "ATD", "Free", "Should Be", "Physical", "Variance", "Adjustment", "Final Variance", "Standard Cost", "Variance Cost", "Reason", "Action"].map(header => (
                                    <th key={header} className="p-3 bg-red-800 text-left text-zinc-100">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className= "text-xs">
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={16} className="w- border-1 border-slate-300 dark:border-neutral-700` p-2 text-center">
                                        <EmptyState />
                                        <p>No data available...</p>
                                    </td>
                                </tr>
                            )}
                            {items.map((item, index) => (
                                <tr key={item.uniform_item_id ?? index}>
                                    <td className="w-10 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{item.item_no}</td>
                                    <td className="w max-w py-[10px] px-2 border border-slate-300 dark:border-neutral-700 truncate">{item.description}</td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.beginning_inventory)}</td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.purchasing_department)}</td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.made_to_order)}</td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.atd)}</td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.free_uniform)}</td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.should_be_inventory)}</td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.physical_count)}</td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.variance)}</td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">
                                        {editable ? (
                                            <input className={inputClassName} type="number" value={item.adjustment ?? 0} onChange={(e) => onChange?.(index, "adjustment", e.target.value)} />
                                        ) : money(item.adjustment)}
                                    </td>
                                <td
                                        className={`w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ${
                                            Number(item.final_variance) > 0
                                                ? "text-green-600 font-semibold"
                                                : Number(item.final_variance) < 0
                                                ? "text-red-600 font-semibold"
                                                : ""
                                        }`}
                                    >
                                        ({money(item.final_variance)})
                                    </td>
                                    <td className="w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">{money(item.standard_cost)}</td>
                                    <td className={`w-20 max-w-100 py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ${
                                        Number(item.total_variance_cost) > 0
                                            ? "text-green-600 font-semibold"
                                            : Number(item.total_variance_cost) < 0
                                            ? "text-red-600 font-semibold"
                                            : ""
                                    }`}>({money(item.total_variance_cost)})</td>
                                    <td className="py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 ">
                                        {editable ? (
                                            <input className={textInputClassName} value={item.reason_of_adjustment ?? ""} onChange={(e) => onChange?.(index, "reason_of_adjustment", e.target.value)} />
                                        ) : item.reason_of_adjustment ?? "-"}
                                    </td>
                                    <td className="py-[10px] px-2 border border-slate-300 dark:border-neutral-700">
                                        <Button
                                            label="View"
                                             onClick={() => onView?.(item)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-400">
                                Showing {items.length} {items.length === 1 ? "item" : "items"}
                            </span>
                            <div>
                                <span className="font-bold text-gray text-sm">
                                    Total Positive Variance Cost:
                                </span>
                                <span className="font-extrabold ml-2 mr-5 text-base text-green-500 ">
                                   {money(totalPositiveVarianceCost)}
                                </span>
                          
                                <span className="font-bold text-gray text-sm">
                                    Total Negative Variance Cost:
                                </span>
                                <span className="font-extrabold ml-2 mr-5 text-base text-red-500">
                                   {money(totalNegativeVarianceCost)}
                                </span>            
                            </div>

                        </div>
            </div>
        </>
    );
}

export default VarianceReportTableCard;
