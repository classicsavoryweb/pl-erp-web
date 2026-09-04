"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import DropDownButtons from "@/components/common/DropDownButtons";
import Textfield from "@/components/common/Textfield";
import Dropdown from "@/components/common/Dropdown";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { useRef, useState } from "react";
import {
    getMyCustodianInfo,
    getTransactionTypes,
    getDepartmentFundTransactions,
    addDepartmentFundTransaction,
    getPostedReplenishments,
} from "@/api/petty-cash/department-fund";

const formatAmount = (value: any) =>
    value != null && value !== ""
        ? Number(value).toLocaleString("en-PH", { style: "currency", currency: "PHP" })
        : "—";

const DepartmentFundCard = () => {
    const api = useApiCall();
    const paginator = usePagination();
    const transactionModal = useModal();

    const [custodianInfo, setCustodianInfo] = useState<any>(null);
    const [custodianLoading, setCustodianLoading] = useState(true);
    const [custodianReload, setCustodianReload] = useState(0);
    const [transactionTypes, setTransactionTypes] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState<any>(null);
    const [postedReplenishments, setPostedReplenishments] = useState<any[]>([]);
    const [selectedReplenishment, setSelectedReplenishment] = useState<any>(null);
    const isSubmittingTransactionRef = useRef(false);

    const isReplenishmentType = selectedType?.name === "Replenishment";

    useAsyncEffect(() => {
        setCustodianLoading(true);
        Promise.all([getMyCustodianInfo(), getTransactionTypes()])
            .then(([custResp, typesResp]) => {
                if (!custResp.error) {
                    setCustodianInfo(custResp.data);
                } else {
                    setCustodianInfo(null);
                }
                if (!typesResp.error) {
                    setTransactionTypes(typesResp.data.types ?? []);
                }
            })
            .catch(() => toast.error("Error loading data"))
            .finally(() => setCustodianLoading(false));
    }, [custodianReload]);

    useAsyncEffect(() => {
        if (!custodianInfo) return;
        api.setLoading(true);
        getDepartmentFundTransactions({ page: paginator.page, per_page: paginator.per_page })
            .then((resp) => {
                if (!resp.error) {
                    const mapped = resp.data.data.map((t: any) => ({
                        ...t,
                        transaction_type_name: t.transaction_type?.name ?? "—",
                    }));
                    api.setDataSet(mapped);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                } else {
                    toast.error("Error fetching transactions");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    }, [custodianInfo, paginator.reload, api.reload]);

    const formHandler = useFormik({
        initialValues: {
            transaction_type_id: "" as string | number,
            report_id: "",
            cash_fund: "",
            reason: "",
        },
        validateOnChange: false,
        validate: (values) => {
            const errors: any = {};
            if (!values.transaction_type_id) {
                errors.transaction_type_id = "Transaction type is required.";
            }
            if (!values.reason.trim()) {
                errors.reason = isReplenishmentType ? "Remarks is required." : "Reason is required.";
            }
            if (isReplenishmentType) {
                if (!values.report_id) {
                    errors.report_id = "Replenishment ID is required.";
                }
            } else {
                if (selectedType?.cash_fund_required) {
                    if (!values.cash_fund) {
                        errors.cash_fund = "Cash fund amount is required.";
                    } else if (selectedType?.allow_negative) {
                        if (Number(values.cash_fund) === 0) {
                            errors.cash_fund = "Cash fund amount cannot be zero.";
                        }
                    } else if (Number(values.cash_fund) <= 0) {
                        errors.cash_fund = "Cash fund must be greater than 0.";
                    }
                }
                if (selectedType?.report_id_required && !values.report_id.trim()) {
                    errors.report_id = "Report ID is required.";
                }
            }
            return errors;
        },
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            if (isSubmittingTransactionRef.current) return;
            isSubmittingTransactionRef.current = true;

            try {
                const isConfirmed = await confirm({
                    title: "Add Transaction",
                    message: "Are you sure you want to add this transaction?",
                });

                if (!isConfirmed) return;

                setSubmitting(true);
                await addDepartmentFundTransaction({
                    transaction_type_id: values.transaction_type_id,
                    report_id: values.report_id || null,
                    cash_fund: isReplenishmentType ? null : values.cash_fund || null,
                    reason: values.reason,
                })
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Transaction added successfully");
                            resetForm();
                            setSelectedType(null);
                            setSelectedReplenishment(null);
                            transactionModal.onClose();
                            api.triggerReload();
                            setCustodianReload((n) => n + 1);
                        } else {
                            toast.error(resp.data.message || "Error adding transaction");
                        }
                    })
                    .catch(() => toast.error("Error encountered"));
            } finally {
                setSubmitting(false);
                isSubmittingTransactionRef.current = false;
            }
        },
    });

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        formHandler.setFieldValue("transaction_type_id", id);
        formHandler.setFieldValue("report_id", "");
        formHandler.setFieldValue("cash_fund", "");
        setSelectedReplenishment(null);
        const found = transactionTypes.find((t) => String(t.id) === String(id));
        setSelectedType(found ?? null);

        if (found?.name === "Replenishment") {
            getPostedReplenishments()
                .then((resp) => {
                    if (!resp.error) {
                        setPostedReplenishments(resp.data.replenishments ?? []);
                    } else {
                        toast.error(resp.data?.message || "Error loading posted replenishments");
                    }
                })
                .catch(() => toast.error("Error encountered"));
        }
    };

    const handleReplenishmentIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const replenishmentId = e.target.value;
        formHandler.setFieldValue("report_id", replenishmentId);
        const found = postedReplenishments.find((r) => r.replenishment_id === replenishmentId);
        setSelectedReplenishment(found ?? null);
    };

    const handleModalClose = () => {
        transactionModal.onClose();
        formHandler.resetForm();
        setSelectedType(null);
        setSelectedReplenishment(null);
    };

    const columnSettings = [
        { columnHead: "Date Added", path: "created_at", columnType: COLUMNTYPES.timestamp },
        { columnHead: "Transaction Type", path: "transaction_type_name", columnType: COLUMNTYPES.string },
        { columnHead: "Cash Fund", path: "cash_fund", columnType: COLUMNTYPES.amount },
        { columnHead: "Reason", path: "reason", columnType: COLUMNTYPES.string },
        { columnHead: "Report ID", path: "report_id", columnType: COLUMNTYPES.string },
    ];

    if (custodianLoading) {
        return (
            <Card>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Loading...</p>
            </Card>
        );
    }

    if (!custodianInfo) {
        return (
            <Card>
                <div className="py-8 text-center">
                    <p className="text-lg font-semibold text-red-500">Access Denied</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                        You are not registered as an active petty cash custodian.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <div className="grid grid-cols-12 items-center mb-3 text-sm">
                    <div className="col-span-4" />
                    <div className="col-span-3">
                        <p className="font-semibold text-gray-500">Total Cash Fund</p>
                        <p>{Number(custodianInfo.total_cash_fund).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</p>
                    </div>
                    <div className="col-span-3">
                        <p className="font-semibold text-gray-500">Remaining Cash Fund</p>
                        <p>{Number(custodianInfo.remaining_cash_fund).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</p>
                    </div>
                    <div className="col-span-2 flex justify-end">
                        <DropDownButtons
                            actions={[
                                {
                                    label: "Add Transaction",
                                    onClick: () => transactionModal.onOpen(),
                                },
                            ]}
                        />
                    </div>
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <Card>
                <p className="font-semibold text-sm text-gray-500 mb-1">Branches</p>
                <p className="text-sm">{custodianInfo.branches?.map((b: any) => b.name).join(", ") || "—"}</p>
            </Card>

            <Modal
                isShowing={transactionModal.isShowing}
                title="Add Transaction"
                onClose={handleModalClose}
                size="md"
            >
                <form onSubmit={formHandler.handleSubmit}>
                    <Dropdown
                        label="Transaction Type"
                        placeholder="select type"
                        name="transaction_type_id"
                        value={String(formHandler.values.transaction_type_id)}
                        onChange={handleTypeChange}
                        required
                        error={(formHandler.errors as any).transaction_type_id}
                        options={transactionTypes.map((t) => ({ label: t.name, value: t.id }))}
                    />

                    {isReplenishmentType && (
                        <>
                            <Dropdown
                                label="Report ID"
                                placeholder="select replenishment ID"
                                name="report_id"
                                value={formHandler.values.report_id}
                                onChange={handleReplenishmentIdChange}
                                required
                                error={(formHandler.errors as any).report_id}
                                options={postedReplenishments.map((r) => ({
                                    label: r.replenishment_id,
                                    value: r.replenishment_id,
                                }))}
                            />
                            {selectedReplenishment && (
                                <Textfield
                                    label="Total Replenishment Amount"
                                    name="total_replenishment_amount"
                                    value={formatAmount(selectedReplenishment.total_replenishment_amount)}
                                    disabled
                                    onChange={() => { }}
                                />
                            )}
                        </>
                    )}

                    {!isReplenishmentType && selectedType?.report_id_required && (
                        <Dropdown
                            label="Report ID"
                            placeholder="select report ID"
                            name="report_id"
                            value={formHandler.values.report_id}
                            onChange={formHandler.handleChange}
                            required
                            error={(formHandler.errors as any).report_id}
                            options={[]}
                        />
                    )}

                    {!isReplenishmentType && selectedType?.cash_fund_required && (
                        <Textfield
                            label="Cash Fund"
                            placeholder="enter amount"
                            name="cash_fund"
                            type="number"
                            value={formHandler.values.cash_fund}
                            onChange={formHandler.handleChange}
                            required
                            error={(formHandler.errors as any).cash_fund}
                        />
                    )}

                    <Textfield
                        label={isReplenishmentType ? "Remarks" : "Reason"}
                        placeholder={isReplenishmentType ? "enter remarks" : "enter reason"}
                        name="reason"
                        value={formHandler.values.reason}
                        onChange={formHandler.handleChange}
                        required
                        error={(formHandler.errors as any).reason}
                    />

                    <hr className="mt-6 pb-2 text-slate-300" />
                    <div className="flex justify-end gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={handleModalClose}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={formHandler.isSubmitting}
                            onClick={() => { }}
                        />
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default DepartmentFundCard;
