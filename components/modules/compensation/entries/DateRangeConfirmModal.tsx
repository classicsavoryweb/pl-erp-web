import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useState, useEffect } from "react";

interface DateRangeConfirmModalProps {
    modal: any;
    onConfirm: (dates: { payDate: string, dateFrom: string, dateTo: string }) => void;
}

const DateRangeConfirmModal = ({
     modal,
     onConfirm
}: DateRangeConfirmModalProps) => {
    const [payDate, setPayDate] = useState<string>("");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");

    const resetForm = () => {
        setPayDate("");
        setDateFrom("");
        setDateTo("");
    };

    const handleConfirm = () => {
        onConfirm({ payDate, dateFrom, dateTo });
        modal.onClose();
        resetForm();
    };

    const handleClose = () => {
        modal.onClose();
        resetForm();
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Generate Entries"
            onClose={handleClose}
            size="md"
        >
            <Textfield
                label="Pay Date"
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
            />
            <Textfield
                label="Date From"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
            />
            <Textfield
                label="Date To"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
                <Button 
                    label="Cancel" 
                    variant="secondary" 
                    onClick={handleClose} 
                />
                <Button 
                    label="Confirm" 
                    onClick={handleConfirm} 
                />
            </div>
        </Modal>
    );
};

export default DateRangeConfirmModal;
