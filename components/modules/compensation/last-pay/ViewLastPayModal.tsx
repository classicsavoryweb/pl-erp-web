import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Grid from "@/components/common/Grid";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { formatNumber } from "@/helper/amount";
import moment from "moment";

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
            columnHead: "Balance",
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

    const editLogColumnSettings = [
        {
            columnHead: "Date Edited",
            path: "created_at",
            columnType: COLUMNTYPES.function,
            function: (row: any) => row.created_at ? moment(row.created_at).format("MMMM DD, YYYY h:mm A") : "-"
        },
        {
            columnHead: "Edited By",
            path: "created_by",
            columnType: COLUMNTYPES.function,
            function: (row: any) => row?.causer?.proper_full_name || row?.causer?.full_name || row?.causer?.email || "-"
        }
    ];

    const activities = Array.isArray(data.activities) ? data.activities : [];
    const createdActivity = activities.find((item: any) => item.event === "created");
    const postedActivity = activities.find((item: any) => item.event === "posted")
        || activities.find((item: any) => item.event === "updated" && item?.properties?.attributes?.status === "Posted");
    const postedActivityId = postedActivity?.id;
    const editLogs = activities.filter((item: any) => item.event === "updated" && item.id !== postedActivityId);

    const getCauserName = (activity: any) => {
        return activity?.causer?.proper_full_name
            || activity?.causer?.full_name
            || activity?.causer?.email
            || "-";
    };

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

            <p className="mt-3">Company Deductions</p>
            <Table
                dataSet={data.deductions ?? []}
                columnSettings={deductionColumnSettings}
                smallText
            />
            <Textfield
                label="Total Deductions"
                onChange={() => {}}
                value={ formatNumber(data.total_deductions)}
                disabled
            />
            <p className="mt-3">SSS/Pagibig Loans</p>
            <Table
                dataSet={data.employee?.government_deductions ?? []}
                columnSettings={governmentDeduction}
                smallText
            />

            <Textfield
                label="Last Pay"
                onChange={() => {}}
                value={ formatNumber(data.last_pay)}
                disabled
            />

            <p className="mt-3">Record Log</p>
            <Grid cols={2}>
                <Textfield
                    label="Date Created"
                    value={
                        createdActivity?.created_at
                            ? moment(createdActivity.created_at).format("MMMM DD, YYYY")
                            : (data.created_at ? moment(data.created_at).format("MMMM DD, YYYY") : "-")
                    }
                    disabled
                />
                <Textfield
                    label="Created By"
                    value={getCauserName(createdActivity)}
                    disabled
                />
                <Textfield
                    label="Date Posted"
                    value={postedActivity?.created_at ? moment(postedActivity.created_at).format("MMMM DD, YYYY h:mm A") : "-"}
                    disabled
                />
                <Textfield
                    label="Posted By"
                    value={getCauserName(postedActivity)}
                    disabled
                />
            </Grid>

            <p className="mt-3">Edit History</p>
            <Table
                dataSet={editLogs}
                columnSettings={editLogColumnSettings}
                smallText
            />
        </Modal>
    );
};

export default ViewLastPayModal;
