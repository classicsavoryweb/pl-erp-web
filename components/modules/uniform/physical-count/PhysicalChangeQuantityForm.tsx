"use client";

import { updateQuantity } from "@/api/uniform/physical-count";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";

import * as XLSX from "xlsx-js-style";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ChangeQuanityFormProps {
  modal: any;
  selected: any;
  onReload?: () => void;
}

const numberValue = (value: any) => Number(value || 0);

const money = (value: any) =>
  numberValue(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ChangeQuanityForm = ({
  modal,
  selected,
  onReload,
}: ChangeQuanityFormProps) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modal.isShowing && selected?.items) {
        setItems(selected.items);
        }
    }, [modal.isShowing, selected]);

    const filteredChangeQuantityItems = items.filter(
        (item: any) =>
        Number(item.should_be_inventory ?? 0).toFixed(2) !==
        Number(item.physical_count ?? 0).toFixed(2),
    );

    const saveChangeQuantity = async () => {


        if (!selected?.id) {
        toast.error("Physical count record not found.");
        return;
        }

        setLoading(true);

        try {
        await updateQuantity({
            physical_count_id: selected.id,

            items: filteredChangeQuantityItems.map((item: any) => ({
            item_no: item.item_no,

            physical_count: Number(item.physical_count || 0),
            })),
        });

        toast.success("All quantities updated successfully.");

        modal.onClose();

        onReload?.();
        } catch (error) {
        console.error(error);

        toast.error("Failed to update quantities.");
        } finally {
        setLoading(false);
        }
    };

    const exportChangeQuantityItems = () => {
        if (!filteredChangeQuantityItems.length) {
        toast.info("There are no items to export.");
        return;
        }
        const exportData = filteredChangeQuantityItems.map((item: any) => ({
            "Uniform Number": item.item_no,
            Description: item.description,
            UOM: item.uom,
            "Beginning Inventory": item.beginning_inventory,
            Purchases: item.total_purchases,
            ATD: item.atd,
            "Free Uniform": item.free_uniform,
            "Total Outgoing": item.total_outgoing,
            "Should Be": item.should_be_inventory,
            "Physical Count": item.physical_count,
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const shouldBeColumn = "I";
        const physicalCountColumn = "J";
        for (let row = 2; row <= exportData.length + 1; row++) {
            const shouldBe = worksheet[`${shouldBeColumn}${row}`]?.v;

            const physicalCount = worksheet[`${physicalCountColumn}${row}`]?.v;

            if (Number(shouldBe).toFixed(2) !== Number(physicalCount).toFixed(2)) {
                for (let col = 0; col < 10; col++) {
                    const cellAddress = XLSX.utils.encode_cell({
                        r: row - 1,
                        c: col,
                    });
                    if (worksheet[cellAddress]) {
                        worksheet[cellAddress].s = {
                        fill: {
                            fgColor: {
                            rgb: "FFF2CC",
                            },
                        },
                        font: {
                            bold: true,
                        },
                        };
                    }
                }
            }
        }
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Quantity");
        XLSX.writeFile(
        workbook,
        `UPDATED_QUANTITY_ITEMS-${moment().format("YYYY-MM-DD")}.xlsx`,
        );
    };

    const changeQuantityTableColumns = [
        {
        columnHead: "Item Name",
        path: "description",
        columnType: COLUMNTYPES.string,
        },
        {
        columnHead: "Should Be",
        path: "should_be_inventory",
        columnType: COLUMNTYPES.amount,
        },
        {
        columnHead: "Physical Count",
        path: "physical_count",
        columnType: COLUMNTYPES.amount,
        },
        {
        columnHead: "Quantity Difference",
        path: "standard_difference",
        columnType: COLUMNTYPES.function,
            function: (item: any) => {
                const shouldBe = numberValue(item.should_be_inventory);
                const physicalCount = numberValue(item.physical_count);
                const difference = physicalCount - shouldBe;
                return (
                <span className={difference < 0 ? "text-red-500" : "text-green-500"}>
                    {money(difference)}
                </span>
                );
            },
        },
    ];

  return (
    <Modal
      isShowing={modal.isShowing}
      title="Update Quantity"
      onClose={modal.onClose}
      size="md"
      loading={loading}
    >
      <div>
        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
          <Table
            dataSet={filteredChangeQuantityItems}
            columnSettings={changeQuantityTableColumns}
            smallText
            dataKey="description"
            fixed
          />
        </div>

        <div className="flex justify-between items-center text-sm mt-2">
          <div className="text-xs text-gray-400">
            Showing {filteredChangeQuantityItems.length}{" "}
            {filteredChangeQuantityItems.length === 1 ? "item" : "items"}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            label="Export"
            variant="success"
            onClick={exportChangeQuantityItems}
          />

          <Button
            type="button"
            label="Update"
            onClick={saveChangeQuantity}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChangeQuanityForm;
