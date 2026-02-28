"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Grid from "@/components/common/Grid";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import Dropdown from "@/components/common/Dropdown";
import { getAllEntries, exportAllEntries } from "@/api/compensation/entries";
import { useModal } from "@/hooks/modal";
import DateRangeConfirmModal from "./DateRangeConfirmModal";

interface FilterInterface {
    hasExport?: boolean;
    exportPermission?: string;
    unique_api?: (values: any) => any;
    title?: string;
}

const EntriesFinalTableCard = ({
    unique_api = exportAllEntries,
    hasExport = true,
    exportPermission = "export_all_compensation_entries",
    title = "Entries",
}: FilterInterface) => {
    const paginator = usePagination(20);
    const api = useApiCall();
    const { permissions } = useContext(AuthContext);
    const generateModal = useModal();
    const canGenerate = permissions.includes("perform_compensation_entries");

    const columnSettings = [
        {
            columnHead: "Branch",
            path: "branch.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Vendor No.",
            path: "vendor_no",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Account No.",
            path: "account_no",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Balance Type",
            path: "balance_type",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Block Payment",
            path: "is_block_payment",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.is_block_payment === 0) return "No";
                if (data.is_block_payment === 1) return "Yes";
                return data.is_block_payment;
            }
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.string
        },
    ];

    const formHandler = useFormik({
        initialValues: {
            key_word: "",
            column_type: "branch.name",
            action: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            key_word: Yup.string(),
            column_type: Yup.string().when("key_word", (keyWord, schema) =>
                String(keyWord) !== ""
                    ? schema.required("Column type is required")
                    : schema.notRequired()
            ),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            api.triggerReload();
            setSubmitting(true);
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);

        getAllEntries({
            page: paginator.page,
            per_page: paginator.per_page,
            include_non_payroll: true,
            ...formHandler.values
        }).then((resp) => {
            if (!resp.error) {
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            } else {
                toast.error("Error fetching entries");
            }
        }).finally(() => {
            api.setLoading(false);
        });
    }, [paginator.reload, api.reload]);

    const exportHandler = useFormik({
        initialValues: {
            key_word: "",
            column_type: "",
        },
        validateOnChange: false,
        onSubmit: async (values) => {
            const isConfirm = await confirm({
                title: "Export",
                message: "Are you sure you want to export?"
            });

            if (isConfirm) {
                const payload = {
                    ...values,
                    include_non_payroll: true
                };
                unique_api && unique_api(payload).then((resp: any) => {
                    if (resp?.error) {
                        const message = resp?.data?.message || resp?.message || "Error exporting entries";
                        toast.error(message);
                        return;
                    }

                    const fileData = resp?.data ?? resp;
                    if (!fileData) {
                        toast.error("Error exporting entries");
                        return;
                    }

                    const blob = new Blob([fileData], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");

                    const now = new Date();
                    const monthName = now.toLocaleString("default", { month: "long" });
                    const day = String(now.getDate()).padStart(2, "0");
                    const year = now.getFullYear();

                    a.href = downloadUrl;
                    a.download = `FINAL-ENTRIES-${monthName.toUpperCase()}-${day}-${year}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            }
        }
    });

    return (
        <>
            <Card>
                <p className=" font-semibold text-red-800 dark:text-red-500">Filters</p>
                <form onSubmit={formHandler.handleSubmit}>
                    <Grid cols={4}>
                        <Dropdown
                            placeholder="select column"
                            label="Column"
                            name="column_type"
                            value={formHandler.values.column_type}
                            error={formHandler.errors.column_type}
                            onChange={formHandler.handleChange}
                            options={columnSettings.map((column: any) => {
                                return {
                                    label: column.columnHead,
                                    value: column.path
                                };
                            })}
                        />
                        <Textfield
                            name="key_word"
                            label="Keyword"
                            placeholder="enter keyword"
                            value={formHandler.values.key_word}
                            onChange={formHandler.handleChange}
                        />
                    </Grid>
                    <div className="flex justify-end gap-x-2">
                        <div className="w-[100px]">
                            <Button
                                label="Search"
                                onClick={() => {
                                    formHandler.setFieldValue("action", "search");
                                    formHandler.submitForm();
                                    paginator.setPage(1);
                                    api.triggerReload();
                                }}
                            />
                        </div>
                        <div className="w-[100px]">
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    formHandler.resetForm();
                                    exportHandler.resetForm();
                                    api.triggerReload();
                                }}
                                variant="secondary"
                            />
                        </div>
                        {canGenerate &&
                            <div className="w-[120px]">
                                <Button
                                    label="Generate"
                                    type="button"
                                    onClick={() => {
                                        generateModal.onOpen();
                                    }}
                                />
                            </div>
                        }
                        {(exportPermission === "" || permissions.includes(exportPermission)) &&
                            <>
                                {hasExport &&
                                    <div className="w-[100px]">
                                        <Button
                                            label="Export"
                                            type="button"
                                            onClick={() => {
                                                exportHandler.setValues(prev => ({
                                                    ...prev,
                                                    ...formHandler.values
                                                }));

                                                exportHandler.submitForm();
                                            }}
                                            variant="success"
                                        />
                                    </div>
                                }
                            </>
                        }
                    </div>
                </form>
            </Card>
            <Card>
                <p className=" font-semibold text-red-800 dark:text-red-500">{title}</p>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
            <DateRangeConfirmModal
                modal={generateModal}
                sendToApsys={true}
            />

        </>
    );
};

export default EntriesFinalTableCard;
