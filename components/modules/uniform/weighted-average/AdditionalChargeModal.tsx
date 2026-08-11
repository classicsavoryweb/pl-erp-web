"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import TextArea from "@/components/common/TextArea";
import {useState} from "react";

interface Props {
    modal:any;
    chargeDraft:any;
    setChargeDraft:any;
    onSave:()=>void;
}

const AdditionalChargeModal = ({
    modal,
    chargeDraft,
    setChargeDraft,
    onSave
}:Props)=>{
const [additionalChargeInput, setAdditionalChargeInput] = useState("");
const accountingFormat = (value: number | string | null | undefined) => {
    return Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

return (
    <Modal
        isShowing={modal.isShowing}
        title="Additional Charge"
        onClose={modal.onClose}
        size="md"
    >
        <div className="grid grid-cols-1 gap-3">
            <Textfield 
                label = "Item Description"
                name = "description"
                value = {chargeDraft.description}
                disabled
            />
        </div>
        <div className="grid grid-cols-3 gap-3">
            <Textfield 
                label = "New Standard Price"
                name = "description"
                value = {accountingFormat(chargeDraft.current_price)}
                disabled
            />
            <Textfield
                label="Final Standard Price"
                name="description"
                value={accountingFormat(chargeDraft.new_standard_price)}
                disabled
            />
                <Textfield 
                label = "Price Difference"
                name = "description"
                value = {accountingFormat(chargeDraft.standard_difference)}
                disabled
            />
        </div>
        <div className="grid grid-cols-1 gap-3">
            <div className="relative py-1">
                <p className="mb-[-2px]">
                    Additional Charge
                </p>

                <input
                    type="text"
                    name="additional_charge"
                    value={additionalChargeInput}
                    onFocus={() => {
                        setAdditionalChargeInput(
                            chargeDraft.additional_charge === "" ||
                            chargeDraft.additional_charge === null ||
                            chargeDraft.additional_charge === undefined
                                ? ""
                                : String(chargeDraft.additional_charge)
                        );
                    }}
                    onChange={(event) => {
                        const rawValue = event.target.value.replace(/,/g, "");
                        if (rawValue === "") {
                            setAdditionalChargeInput("");

                            setChargeDraft({
                                ...chargeDraft,
                                additional_charge: "",
                                new_standard_price:
                                    Number(
                                        chargeDraft.original_new_standard_price || 0
                                    ),
                                standard_difference:
                                    Number(
                                        chargeDraft.original_standard_difference || 0
                                    ),
                            });
                            return;
                        }
                        if (!/^\d*\.?\d*$/.test(rawValue)) {
                            return;
                        }
                        const additionalCharge = Number(rawValue);

                        if (Number.isNaN(additionalCharge)) {
                            return;
                        }
                        setAdditionalChargeInput(rawValue);
                        setChargeDraft({
                            ...chargeDraft,
                            additional_charge: additionalCharge,

                            new_standard_price:
                                Number(
                                    chargeDraft.original_new_standard_price || 0
                                ) + additionalCharge,

                            standard_difference:
                                Number(
                                    chargeDraft.original_standard_difference || 0
                                ) + additionalCharge,
                        });
                    }}
                    onBlur={() => {
                        const value = Number(chargeDraft.additional_charge || 0);

                        // If completely empty, KEEP IT EMPTY
                        if (chargeDraft.additional_charge === "") {
                            setAdditionalChargeInput("");
                            return;
                        }

                        setAdditionalChargeInput(
                            value.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })
                        );
                    }}
                    className="
                        w-full
                        h-[40px]
                        rounded-md
                        focus:outline-none
                        border-2
                        border-slate-300
                        focus:border-slate-400
                        p-2
                        text-white
                        cursor-text
                        dark:bg-neutral-800
                        dark:border-neutral-700
                    "
                />
            </div>
            <TextArea
                label="Reason"
                name="reason"
                value={chargeDraft.reason}
                onChange={(event: any) => setChargeDraft({
                    ...chargeDraft,
                    reason: event.target.value,
                })}
            />
        </div>
        <div>
            <div className="flex justify-end gap-x-2">
                <Button
                    label="Cancel"
                    variant="secondary"
                    onClick={modal.onClose}
                />
                <Button
                    label="Save"
                    onClick={onSave}
                />
            </div>
        </div>
    </Modal>
)

}

export default AdditionalChargeModal;