"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import TextArea from "@/components/common/TextArea";

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
            <Textfield
                label="Additional Charge"
                name="additional_charge"
                type="number"
                value={chargeDraft.additional_charge}
                onChange={(event: any) => {
                    const additionalCharge = Number(event.target.value || 0);

                    setChargeDraft({
                        ...chargeDraft,
                        additional_charge: event.target.value,
                        new_standard_price:
                            Number(chargeDraft.original_new_standard_price || 0) + additionalCharge,
                        standard_difference:
                            Number(chargeDraft.original_standard_difference || 0) + additionalCharge,
                    });
                }}
            />
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