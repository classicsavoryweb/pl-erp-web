"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";

interface ChangeQuanityForm{
    modal:any;
    items:any[];
    onExport:()=>void;
    onUpdate:()=>void;
}

const  ChangeQuanityForm= ({
    modal,
    items,
    onExport,
    onUpdate
}:ChangeQuanityForm) =>{

    console.log(items);

     const filteredChangeQuantityItems = items.filter(
        (item) =>
            Number(item.should_be_inventory ?? 0).toFixed(2) !==
            Number(item.physical_count ?? 0).toFixed(2)
    );

    const changePriceTableColumn = [
        {columnHead : "Item Name" , path: "description" , columnType:COLUMNTYPES.string},
        {columnHead : "Should Be" , path: "should_be_inventory" , columnType:COLUMNTYPES.amount},
        {columnHead : "Physical Count" , path: "physical_count" , columnType:COLUMNTYPES.amount},
        {columnHead : "Quantity Difference" , path: "standard_difference", columnType:COLUMNTYPES.function,
            function:(item: any) => {
                const should_be_inventory = item.should_be_inventory;
                const physical_count = item.physical_count;
                const totaldiff = physical_count - should_be_inventory ;
                return <span className= {totaldiff < 0 ? "text-red-500" : "text-green-500"}>{totaldiff}</span>
                
            }
        },

    ]

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Update Quantity"
            onClose={modal.onClose}
            size="md"
        >
            <div>
                <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                    <Table
                        dataSet={filteredChangeQuantityItems}
                        columnSettings={changePriceTableColumn}
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
                        variant= "success"
                        onClick={onExport}
                    />

                    <Button
                        type="button"
                        label="Update"
                        onClick={onUpdate}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default ChangeQuanityForm;