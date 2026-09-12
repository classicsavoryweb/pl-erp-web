"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import TextArea from "@/components/common/TextArea";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";

interface ChangeUnitPriceProps{
    modal:any;
    items:any[];
    onExport:()=>void;
    onUpdate:()=>void;
}

const ChangeUnitPriceForm = ({
    modal,
    items,
    onExport,
    onUpdate
}:ChangeUnitPriceProps) =>{

     const filteredChangePriceItems = items.filter(
        (item) =>
            Number(item.old_price ?? 0).toFixed(2) !==
            Number(item.new_price ?? 0).toFixed(2)
    );

    const changePriceTableColumn = [
        {columnHead : "Item Name" , path: "description" , columnType:COLUMNTYPES.string},
        {columnHead : "Old Standard Price" , path: "old_price" , columnType:COLUMNTYPES.amount},
        {columnHead : "New Standard Price" , path: "new_price" , columnType:COLUMNTYPES.amount},
        {columnHead : "Price Difference" , path: "standard_difference", columnType:COLUMNTYPES.function,
            function:(item: any) => {
                const standard_difference = item.standard_difference;
                return <span className="text-red-600">{standard_difference}</span>
                
            }
        },

    ]

    return (
        <Modal
                    isShowing={modal.isShowing}
                    title="Update Price"
                    onClose={modal.onClose}
                    size="md"
                >
                    <div>
                        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                            <Table
                                dataSet={filteredChangePriceItems}
                                columnSettings={changePriceTableColumn}
                                smallText
                                dataKey="description"
                                fixed
                            />
                        </div>

                        <div className="flex justify-between items-center text-sm mt-2">
                            <div className="text-xs text-gray-400">
                                Showing {filteredChangePriceItems.length}{" "}
                                {filteredChangePriceItems.length === 1 ? "item" : "items"}
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

export default ChangeUnitPriceForm;