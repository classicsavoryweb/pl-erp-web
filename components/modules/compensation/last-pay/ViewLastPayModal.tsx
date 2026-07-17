import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { formatNumber } from "@/helper/amount";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { getInitialLastPay } from "@/api/compensation/last-pay";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    data: any
}

const ViewLastPayModal = ({
    modal,
    data
}: ModalInterface
) => {
    const deductionColumnSettings = [
        {
            columnHead: "Type",
            path: "deduction.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
    ];

    const governmentDeduction = [
        {
            columnHead: "Type",
            path: "deduction.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Balance",
            path: "balance",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
    ];

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Last Pay Record"
            onClose={() => {
                modal.onClose();
            }}
            size="md"
        >
            <Textfield
                label="Employee"
                value={data.employee?.full_name}
                disabled
            />
            <Grid cols={2}>
                <Textfield
                    label="Year"
                    type="number"
                    name="year"
                    value={data.year}
                    disabled
                />
                <Textfield
                    label="Payroll"
                    name="payroll_hold"
                    value={ formatNumber(data.payroll_hold)}
                    disabled
                />
                <Textfield
                    label="13th Month"
                    value={ formatNumber(data["thirteenth_month"])}
                    disabled
                />
                <Textfield
                    label="Tax Refund"
                    name="tax_refund"
                    value={formatNumber(data.tax_refund)}
                    disabled
                />
                <Textfield
                    label="Sales Incentives"
                    name="sales"
                    value={formatNumber(data.sales)}
                    disabled
                />
                <Textfield
                    label="Incentives"
                    name="incentives"
                    disabled
                    value={formatNumber(data.incentives)}
                />
                <Textfield
                    label="SL/VL"
                    name="sl_vl"
                    value={formatNumber(data.sl_vl)}
                    disabled
                />
                <Textfield
                    label="Meal Allowance"
                    value={formatNumber(data.meal)}
                    disabled
                />
            </Grid>

            { data.additional_fields &&
                <p className="mt-3">Additional Fields</p>
            }
            <Grid cols={2}>
                { data.additional_fields && data.additional_fields.map((item: any, key: number) => {
                    return (
                        <Textfield
                            key={key}
                            label={item.transaction_type.description}
                            value={formatNumber(item.amount)}
                            disabled
                        />
                    );
                })
                }
            </Grid>
            <p className="mt-3">Company Deductions</p>
            <Table
                dataSet={data.deductions}
                columnSettings={deductionColumnSettings}
                smallText
            />
            <Textfield
                label="Total Deductions"
                onChange={() => {}}
                value={formatNumber(data.total_deductions)}
                disabled
            />
            <p className="mt-3">SSS/Pagibig Loans</p>
            <Table
                dataSet={data.employee?.government_deductions}
                columnSettings={governmentDeduction}
                smallText
            />
            <Textfield
                label="Last Pay"
                onChange={() => {}}
                value={formatNumber(data.last_pay)}
                disabled
            />
        </Modal>
    );
};

export default ViewLastPayModal;
