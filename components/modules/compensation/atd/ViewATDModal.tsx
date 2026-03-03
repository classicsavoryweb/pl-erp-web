"use client";

import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Checkbox from "@/components/common/Checkbox";
import TextArea from "@/components/common/TextArea";
import moment from "moment";
interface FormModalInterface {
    modal: any;
    data: any;
}

const ViewATDModal = ({
    modal,
    data
}: FormModalInterface) => {

    return (
        <Modal
            isShowing={modal.isShowing}
            title="View Deduction"
            onClose={() => {
                modal.onClose();
            }}
            loading={modal.loading}
            size="md"
        >
            <Textfield
                label="Employee"
                name="months"
                value={data.employee?.full_name}
                required
                disabled
            />
            <Textfield
                label="ATD Branch"
                name="months"
                value={data.branch?.name}
                required
                disabled
            />
            <Textfield
                label="Deduction Type"
                name="months"
                value={data.deduction?.description}
                required
                disabled
            />
            <Textfield
                label="Month(s)"
                name="months"
                type="number"
                value={data.months}
                required
                disabled
            />
            <Textfield
                label="Amount"
                placeholder="enter amount"
                name="amount"
                type="text"
                value={data.amount}
                disabled
            />
            <Textfield
                label="Start Date"
                placeholder="select start date"
                name="start_date"
                type="date"
                value={data.start_date}
                required
                disabled
            />
            <Textfield
                label="End Date"
                name="end_date"
                type="date"
                value={data.end_date}
                disabled
            />
            <Textfield
                label="Monthly Amortization"
                name="monthly_amortization"
                type="text"
                value={data.monthly_amortization}
                disabled
            />
            <Textfield
                label="Balance"
                name="balance"
                type="text"
                value={data.balance}
                disabled
            />
            <Checkbox
                label="Block Payment"
                checked={data.block_payment === "Yes"}
                value="block_payment"
                onChange={() => {}}
            />
            <Textfield
                label="Imported By"
                name="months"
                value={data.created_by}
                disabled
            />
            <Textfield
                label="Transaction Date"
                name="months"
                value={data.date_created ? moment(data.date_created).format("MMMM DD, YYYY") : ""}
                disabled
            />
            <Textfield
                label="Date Imported"
                name="months"
                value={moment(data.created_at).format("MMMM DD, YYYY HH:mm:ss A")}
                disabled
            />
            <TextArea
                label="Remarks"
                name="remarks"
                value={data.remarks ?? ""}
                disabled
            />
        </Modal>
    );
};

export default ViewATDModal;
