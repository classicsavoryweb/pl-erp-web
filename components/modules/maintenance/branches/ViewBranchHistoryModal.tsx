"use client";

import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { getBranchActivities } from "@/api/branches";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import moment from "moment";

const FIELD_LABELS: Record<string, string> = {
    name: "Branch Name",
    branch_number: "Branch Number",
    status: "Status",
    travel_time: "Travel Time",
    device_name: "Device Name",
    short_name: "Short Name",
    type: "Type",
    address: "Address",
    location: "Location",
    date_open: "Date Opened",
    company: "Company",
    branch_email: "Branch Email",
    rate_code: "Rate Code",
    branch_head_employee_number: "Branch Head Employee Number",
    branch_head: "Branch Head",
    branch_head_date_appointed: "Branch OIC Date Appointed",
    group_head_employee_number: "Group Head Employee Number",
    group_head: "Group Head",
    kitchen_oic_employee_number: "Kitchen OIC Employee Number",
    kitchen_oic: "Kitchen OIC",
    kitchen_oic_date_appointed: "Kitchen OIC Date Appointed",
    kitchen_oic_2_employee_number: "Kitchen OIC 2 Employee Number",
    kitchen_oic_2: "Kitchen OIC 2",
    kitchen_oic_2_date_appointed: "Kitchen OIC 2 Date Appointed",
    mancom_employee_number: "Mancom Employee Number",
    mancom: "Mancom",
    expense_debit: "Expense Debit",
    expense_credit: "Expense Credit",
    advance_debit: "Advance Debit",
    advance_credit: "Advance Credit",
    ho_13th_debit: "HO 13th Debit",
    ho_13th_debit_1: "HO 13th Debit 1",
    ho_13th_credit: "HO 13th Credit",
    branch_ho_13th_debit: "Branch HO 13th Debit",
    branch_ho_13th_debit_1: "Branch HO 13th Debit 1",
    branch_ho_13th_credit: "Branch HO 13th Credit",
    branch_ho_stat_debit: "Branch HO Stat Debit",
    branch_ho_stat_credit: "Branch HO Stat Credit",
};

const HIDDEN_CHANGE_KEYS = new Set([
    "branch_head_employee_number",
    "group_head_employee_number",
    "kitchen_oic_employee_number",
    "kitchen_oic_2_employee_number",
    "mancom_employee_number",
]);

const ACCOUNT_CHANGE_KEYS = new Set([
    "expense_debit",
    "expense_credit",
    "advance_debit",
    "advance_credit",
    "ho_13th_debit",
    "ho_13th_debit_1",
    "ho_13th_credit",
    "branch_ho_13th_debit",
    "branch_ho_13th_debit_1",
    "branch_ho_13th_credit",
    "branch_ho_stat_debit",
    "branch_ho_stat_credit",
]);

const OIC_NAME_TO_DATE_KEY: Record<string, string> = {
    branch_head: "branch_head_date_appointed",
    kitchen_oic: "kitchen_oic_date_appointed",
    kitchen_oic_2: "kitchen_oic_2_date_appointed",
};

const OIC_DATE_TO_NAME_KEY = Object.entries(OIC_NAME_TO_DATE_KEY).reduce<Record<string, string>>(
    (acc, [nameKey, dateKey]) => {
        acc[dateKey] = nameKey;
        return acc;
    },
    {}
);

const formatDateAppointed = (value: any) => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    const parsed = moment(value);
    if (!parsed.isValid()) {
        return String(value);
    }

    return parsed.format("M/D/YYYY");
};

const normalizeValue = (value: any, key?: string, accountNames?: Record<string, string>) => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    if (key && ACCOUNT_CHANGE_KEYS.has(key)) {
        const accountName = accountNames?.[String(value)];
        if (accountName) {
            return accountName;
        }
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
};

const getCauserName = (activity: any) =>
    activity?.causer?.proper_full_name
    || activity?.causer?.full_name
    || activity?.causer?.email
    || "-";

const getChanges = (activity: any, accountNames?: Record<string, string>) => {
    if (activity?.event === "created") {
        return "Branch record created.";
    }

    const attributes = activity?.properties?.attributes ?? {};
    const oldValues = activity?.properties?.old ?? {};
    const changedKeys = Object.keys(attributes).filter((key) => {
        if (key === "updated_at" || HIDDEN_CHANGE_KEYS.has(key)) {
            return false;
        }

        const oldDisplayValue = normalizeValue(oldValues[key], key, accountNames);
        const newDisplayValue = normalizeValue(attributes[key], key, accountNames);

        return oldDisplayValue !== newDisplayValue;
    });

    const filteredChangedKeys = changedKeys.filter((key) => {
        const linkedNameKey = OIC_DATE_TO_NAME_KEY[key];
        if (!linkedNameKey) {
            return true;
        }

        return !changedKeys.includes(linkedNameKey);
    });

    if (filteredChangedKeys.length === 0) {
        return "-";
    }

    return (
        <div className="whitespace-pre-line">
            {filteredChangedKeys.map((key) => {
                const label = FIELD_LABELS[key] ?? key.replace(/_/g, " ");
                const oldDisplay = normalizeValue(oldValues[key], key, accountNames);
                const newDisplay = normalizeValue(attributes[key], key, accountNames);

                if (OIC_NAME_TO_DATE_KEY[key]) {
                    const dateKey = OIC_NAME_TO_DATE_KEY[key];
                    const oldDate = formatDateAppointed(oldValues[dateKey]);
                    const newDate = formatDateAppointed(attributes[dateKey]);
                    const hasOldValue = !!(oldValues[key] || oldValues[dateKey]);
                    const hasNewValue = !!(attributes[key] || attributes[dateKey]);

                    if (!hasOldValue && hasNewValue) {
                        return (
                            <div key={key}>
                                {label}: {newDisplay} (Date Appointed: {newDate})
                            </div>
                        );
                    }

                    if (hasOldValue && !hasNewValue) {
                        return (
                            <div key={key}>
                                {label}: {oldDisplay} (Date Appointed: {oldDate})
                            </div>
                        );
                    }

                    return (
                        <div key={key}>
                            {label}: {oldDisplay} (Date Appointed: {oldDate}) -&gt; {newDisplay} (Date Appointed: {newDate})
                        </div>
                    );
                }

                return (
                    <div key={key}>
                        {label}: {oldDisplay} -&gt; {newDisplay}
                    </div>
                );
            })}
        </div>
    );
};

const ViewBranchHistoryModal = ({
    modal,
    branchId,
}: {
    modal: any;
    branchId?: number | null;
}) => {
    const api = useApiCall();
    const accountNames = api.data?.account_names ?? {};

    useAsyncEffect(() => {
        if (!modal.isShowing || !branchId) {
            return;
        }

        api.setLoading(true);
        getBranchActivities(branchId)
            .then((resp) => {
                if (!resp.error) {
                    api.setData(resp.data);
                    api.setDataSet(resp.data.activities ?? []);
                } else {
                    api.setData({});
                    api.setDataSet([]);
                }
            })
            .finally(() => {
                api.setLoading(false);
            });
    }, [modal.isShowing, branchId]);

    const columnSettings = [
        {
            columnHead: "Date Modified",
            path: "created_at",
            columnType: COLUMNTYPES.function,
            function: (row: any) => row?.created_at
                ? moment(row.created_at).format("MMMM DD, YYYY h:mm A")
                : "-",
        },
        {
            columnHead: "Modified By",
            path: "causer",
            columnType: COLUMNTYPES.function,
            function: (row: any) => getCauserName(row),
        },
        {
            columnHead: "Action",
            path: "event",
            columnType: COLUMNTYPES.function,
            function: (row: any) => row?.event ? String(row.event).toUpperCase() : "-",
        },
        {
            columnHead: "Changes",
            path: "properties",
            columnType: COLUMNTYPES.function,
            function: (row: any) => getChanges(row, accountNames),
        },
    ];

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Branch History"
            onClose={modal.onClose}
            size="lg"
        >
            <Textfield
                label="Branch"
                value={api.data?.branch?.name ?? ""}
                disabled
            />
            <Textfield
                label="Branch Number"
                value={api.data?.branch?.branch_number ?? ""}
                disabled
            />
            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                smallText
            />
        </Modal>
    );
};

export default ViewBranchHistoryModal;
