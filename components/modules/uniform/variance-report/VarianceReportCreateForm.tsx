"use client";

import {
  createVariance,
  getVarianceItemDetails,
  previewVariance,
} from "@/api/uniform/variance-report";
import { physicalCountDropdown } from "@/api/uniform/physical-count";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { useModal } from "@/hooks/modal";

import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import VarianceReportViewItem from "./VarianceReportViewItem";
interface VarianceReportCreateFormProps {
  modal: any;
  onCreated?: () => void;
  onView?: (record: any) => void;
}

    const title = "Variance Report";
    const numberValue = (value: any) => Number(value || 0);
    const today = () => new Date().toISOString().slice(0, 10);
    const money = (value: any) =>
    numberValue(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    const inputClassName = "w-full min-h-10 rounded-md border-2 border-slate-300 bg-transparent p-2 text-right focus:border-slate-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800";

    const textInputClassName = inputClassName.replace("text-right", "text-left");
    const responseMessage = (resp: any) => resp?.message ?? resp?.data?.message ?? "Unable to complete request.";
    const VarianceReportCreateForm = ({
        modal,
        onCreated,
        onView,
    }: VarianceReportCreateFormProps) => {

    const viewItemModal = useModal();
    const [physicalCounts, setPhysicalCounts] = useState<any[]>([]);
    const [itemSearch, setItemSearch] = useState("");
    const [specialFilter, setSpecialFilter] = useState("all");
    const [showFilter, setShowFilter] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [varianceForm, setVarianceForm] = useState({
        begin_date: today(),
        ending_date: today(),
        remarks: "",
        items: [] as any[],
    });

  useEffect(() => {
    loadPhysicalCounts();
  }, []);

    const loadPhysicalCounts = async () => {
        try {
            const response = await physicalCountDropdown();
            setPhysicalCounts(response ?? []);
            if (response?.length > 0) {
                setVarianceForm((prev) => ({
                ...prev,
                begin_date: response[0].begin_date,
                ending_date: response[0].ending_date,
                items: [],
                }));
            }
        } catch (error) {
            console.error("Error loading physical counts:", error);
            toast.error("Unable to load physical counts.");
        }
    };

    const resetForm = () => {
        setVarianceForm({
            begin_date: physicalCounts[0]?.begin_date ?? today(),
            ending_date: physicalCounts[0]?.ending_date ?? today(),
            remarks: "",
            items: [],
        });
        setItemSearch("");
        setSpecialFilter("all");
        setShowFilter(false);
    };

    const handleClose = () => {
        setShowFilter(false);
        modal.onClose();
    };

    const loadPreview = async () => {
        if (!varianceForm.begin_date || !varianceForm.ending_date) {
            toast.error("Please select Begin Date and Ending Date.");
            setShowFilter(false);
            return;
        }
        if (!moment(varianceForm.ending_date).isAfter(moment(varianceForm.begin_date))) {
            toast.error("Ending date should be greater than Beginning date.");
            setShowFilter(false);
            return;
        }
        modal.setLoading(true);
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

        setVarianceForm((prev) => ({
            ...prev,
            items: resp?.items ?? [],
        }));

        setShowFilter(true);
        } catch (error) {
        console.error("Error loading variance preview:", error);

        toast.error("Error encountered.");
        } finally {
        modal.setLoading(false);
        }
    };

    const updateVarianceItem = (index: number, key: string, value: any) => {
        setVarianceForm((prev) => ({
            ...prev,
            items: prev.items.map((item, itemIndex) => {
                if (itemIndex !== index) {
                return item;
                }
                const next = {
                ...item,
                [key]: value,
                };
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

    const handleView = async (record: any) => {
        try {
            const payload = {
                uniform_item_id: record.uniform_item_id,

                begin_date: varianceForm.begin_date,

                end_date: varianceForm.ending_date,
            };
            const response = await getVarianceItemDetails(payload);
            setSelectedItem(response?.data);
            viewItemModal.onOpen();
            onView?.(response?.data);
        } catch (error) {
            console.error("Error fetching item details:", error);
            toast.error("Unable to load item details.");
        }
    };

    const saveRecord = async () => {
        if (!varianceForm.items.length) {
        toast.error("Load items first.");
        return;
    }

    const invalidItem = varianceForm.items.find(
        (item: any) =>
            (numberValue(item.final_variance) !== 0 ||
            numberValue(item.total_variance_cost) !== 0) &&
            !item.reason_of_adjustment?.trim(),
    );

    if (invalidItem) {
        toast.error(`Reason is required for ${invalidItem.description}.`);
        return;
    }
    modal.setLoading(true);
        try {
            const resp = await createVariance(varianceForm);

            if (resp?.error || resp?.errors) {
                toast.error(responseMessage(resp));

                return;
            }
            toast.success(`${title} created`);
            handleClose();
            resetForm();
            onCreated?.();
        } catch (error) {
            console.error("Error creating variance:", error);
            toast.error("Error encountered.");
        } finally {
            modal.setLoading(false);
        }
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
        {
        label: "Items with Adjustment",
        value: "adjustment",
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
            return numberValue(item.variance) < 0;

            case "positive":
            return numberValue(item.variance) > 0;

            case "adjustment":
            return numberValue(item.adjustment) !== 0;

            default:
            return true;
        }
        });

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
            columnHead: "Beginning",
            path: "beginning_inventory",
            columnType: COLUMNTYPES.function,
                function: (data: any) => money(data.beginning_inventory),
        },
        {
            columnHead: "Purchases",
            path: "purchasing_department",
            columnType: COLUMNTYPES.function,
                function: (data: any) => money(data.purchasing_department),
        },
        {
            columnHead: "Made To Order",
            path: "made_to_order",
            columnType: COLUMNTYPES.function,
                function: (data: any) => money(data.made_to_order),
        },
        {
            columnHead: "ATD",
            path: "atd",
            columnType: COLUMNTYPES.function,
                function: (data: any) => money(data.atd),
        },
        {
            columnHead: "Free",
            path: "free_uniform",
            columnType: COLUMNTYPES.function,
                function: (data: any) => money(data.free_uniform),
        },
        {
            columnHead: "Should Be",
            path: "should_be_inventory",
            columnType: COLUMNTYPES.function,
                function: (data: any) => money(data.should_be_inventory),
        },
        {
            columnHead: "Physical",
            path: "physical_count",
            columnType: COLUMNTYPES.function,
                function: (data: any) => money(data.physical_count),
        },
        {
            columnHead: "Variance",
            path: "variance",
            columnType: COLUMNTYPES.function,
                function: (data: any) => money(data.variance),
        },
        {
            columnHead: "Adjustment",
            path: "adjustment",
            columnType: COLUMNTYPES.function,
                function: (data: any) => {
                    const index = varianceForm.items.findIndex(
                    (item: any) => item.uniform_item_id === data.uniform_item_id,
                    );

                    return editableInput(data, index);
                },
        },
        {
            columnHead: "Final Variance",
            path: "final_variance",
            columnType: COLUMNTYPES.function,
                function: (data: any) => {
                    const value = numberValue(data.final_variance);
                    return (
                    <span
                        className={
                        value > 0
                            ? "text-green-600 font-semibold"
                            : value < 0
                            ? "text-red-600 font-semibold"
                            : ""
                        }
                    >
                        ({money(value)})
                    </span>
                    );
                },
        },
        {
            columnHead: "Standard Cost",
            path: "standard_cost",
            columnType: COLUMNTYPES.function,
                function: (data: any) => money(data.standard_cost),
        },
        {
            columnHead: "Variance Cost",
            path: "total_variance_cost",
            columnType: COLUMNTYPES.function,
                function: (data: any) => {
                    const value = numberValue(data.total_variance_cost);

                    return (
                    <span
                        className={
                        value > 0
                            ? "text-green-600 font-semibold"
                            : value < 0
                            ? "text-red-600 font-semibold"
                            : ""
                        }
                    >
                        ({money(value)})
                    </span>
                    );
                },
        },
        {
            columnHead: "Reason",
            path: "reason_of_adjustment",
            columnType: COLUMNTYPES.function,
                function: (data: any) => {
                    const index = varianceForm.items.findIndex(
                    (item: any) => item.uniform_item_id === data.uniform_item_id,
                    );

                    return editableReasonInput(data, index);
                },
        },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
                function: (data: any) => (
                    <Button label="View" onClick={() => handleView(data)} />
                ),
        },
    ];

    const editableInput = (data: any, index: number) => {
        if (!index || index < 0) {
            return money(data.adjustment);
        }
        return (
            <input
                className={inputClassName}
                type="number"
                value={data.adjustment ?? 0}
                onChange={(e) =>
                updateVarianceItem(index, "adjustment", e.target.value)
                }
            />
        );
    };

    const editableReasonInput = (data: any, index: number) => {
        if (!index || index < 0) {
            return data.reason_of_adjustment ?? "-";
        }
        return (
            <input
                className={textInputClassName}
                value={data.reason_of_adjustment ?? ""}
                onChange={(e) =>
                updateVarianceItem(index, "reason_of_adjustment", e.target.value)
                }
            />
        );
    };

    const totalPositiveVarianceCost = filteredVarianceItems.reduce(
        (total: number, item: any) => {
            const value = numberValue(item.total_variance_cost);
            return total + (value > 0 ? value : 0);
        },
        0,
    );
    
    const totalNegativeVarianceCost = filteredVarianceItems.reduce(
        (total: number, item: any) => {
            const value = numberValue(item.total_variance_cost);

            return total + (value < 0 ? value : 0);
        },
        0,
    );
  return (
    <>
      <Modal
        size="entireScreen"
        title={`Generate ${title}`}
        isShowing={modal.isShowing}
        loading={modal.loading}
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

                setShowFilter(false);
              }}
            />
            <SearchableDropDown
              label="Ending Inventory"
              name="ending_date"
              value={varianceForm.ending_date}
              options={physicalCounts.map((pc: any) => ({
                label: pc.ending_date,
                value: pc.ending_date,
              }))}
              onChange={(event: any) => {
                setVarianceForm((prev) => ({
                  ...prev,
                  ending_date: event.target.value,
                  items: [],
                }));
                setShowFilter(false);
              }}
            />
          </div>
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
        <div className="flex items-center justify-between mb-2 mt-4">
          <div className="font-semibold">Request Data</div>

          <div className="flex items-end gap-4">
            {showFilter && (
              <>
                <div className="w-80">
                  <SearchableDropDown
                    label="Special Filter"
                    name="special_filter"
                    value={specialFilter}
                    options={specialFilters}
                    onChange={(event: any) =>
                      setSpecialFilter(event.target.value)
                    }
                  />
                </div>

                <div className="w-80">
                  <Textfield
                    label="Search Item"
                    value={itemSearch}
                    onChange={(e: any) => setItemSearch(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="w-[140px]">
              <Button
                type="button"
                variant="success"
                label="Generate Data"
                onClick={loadPreview}
              />
            </div>
          </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
            <Table
            dataSet={filteredVarianceItems}
            columnSettings={columns}
            loading={modal.loading}
            fixed
            smallText
            />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">
            Showing {filteredVarianceItems.length}{" "}
            {filteredVarianceItems.length === 1 ? "item" : "items"}
          </span>

          <div>
            <span className="font-bold text-sm">
              Total Positive Variance Cost:
            </span>

            <span className="font-extrabold ml-2 mr-5 text-base text-green-500">
              {money(totalPositiveVarianceCost)}
            </span>

            <span className="font-bold text-sm">
              Total Negative Variance Cost:
            </span>

            <span className="font-extrabold ml-2 mr-5 text-base text-red-500">
              {money(totalNegativeVarianceCost)}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-x-2 mt-3">
          <div className="w-[120px]">
            <Button label="Submit" onClick={saveRecord} />
          </div>
        </div>
      </Modal>
      <VarianceReportViewItem modal={viewItemModal} formValue={selectedItem} />
    </>
  );
};

export default VarianceReportCreateForm;
