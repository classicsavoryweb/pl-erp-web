"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useModal } from "@/hooks/modal";
import { toast } from "react-toastify";
import Grid from "@/components/common/Grid";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import Dropdown from "@/components/common/Dropdown";
import DateRangeConfirmModal from "./DateRangeConfirmModal";
import { getAllEntries, exportAllEntries} from "@/api/compensation/entries";
import moment from "moment";
import BranchDropDown from "../../generic/BranchDropDown";
import CutOffDropDown from "../../generic/CutOffDropDown";
import { useBranchStore } from "@/stores/useBranchStore";
interface FilterInterface {
    hasExport?: boolean;
    exportPermission?: string;
    unique_api?: (values: any) => any;
    title?: string;
    showTag?: boolean;
};

const EntriesTableCard = ({
    unique_api = exportAllEntries,
    hasExport = true,
    exportPermission = "export_all_compensation_entries",
    title = "Entries",
    showTag = true,
}: FilterInterface) => {
    const paginator = usePagination(20);
    const api = useApiCall();
    const { permissions } = useContext(AuthContext);
    const dateRangeConfirmModal = useModal();
    const { branches, getBranches } = useBranchStore();

    useAsyncEffect(() => {
        getBranches();
    }, []);

    const branchShortNameMap = useMemo(() => {
        const map = new Map<string, string>();
        branches.forEach((branch: any) => {
            if (branch?.branch_number && branch?.short_name) {
                map.set(branch.branch_number, branch.short_name);
            }
        });
        return map;
    }, [branches]);

    const getCutoffFromDocumentNo = (documentNo?: string) => {
        if (!documentNo) return "-";
        const candidate = documentNo.includes("|")
            ? documentNo.split("|").slice(1).join("|")
            : documentNo;

        const matches = candidate.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/g);
        if (!matches || matches.length < 2) return "-";

        const parseDate = (value: string) => {
            const parsed = moment(value, ["YYYY-MM-DD", "MM/DD/YYYY"], true);
            return parsed.isValid() ? parsed : null;
        };

        const start = parseDate(matches[0]);
        const end = parseDate(matches[1]);
        if (!start || !end) return "-";

        const monthLabels = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        const formatLabel = (dateValue: moment.Moment) => {
            return `${monthLabels[dateValue.month()]} ${dateValue.date()}`;
        };

        return `${formatLabel(start)} - ${formatLabel(end)}`;
    };

    const getBranchFromDocumentNo = (
        documentNo?: string,
        branchShortName?: string,
        branchName?: string,
        branchNumber?: string
    ) => {
        if (branchShortName) return branchShortName;

        if (branchNumber && branchShortNameMap.has(branchNumber)) {
            return branchShortNameMap.get(branchNumber) || branchNumber;
        }

        return branchName || branchNumber || "-";
    };

    const getTagFromDocumentNo = (documentNo?: string) => {
        if (!documentNo || !documentNo.includes("|")) return "-";
        const prefix = documentNo.split("|")[0].trim();
        return prefix || "-";
    };

    const columnSettings = [
        {
            columnHead: "Cutoff",
            path: "document_no",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return getCutoffFromDocumentNo(data?.document_no);
            },
            filterable: false
        },
        {
            columnHead: "Branch",
            path: "branch.name",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return getBranchFromDocumentNo(
                    data?.document_no,
                    data?.branch?.short_name,
                    data?.branch?.name,
                    data?.branch_number
                );
            }
        },
        ...(showTag ? [{
            columnHead: "Tag",
            path: "document_no",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return getTagFromDocumentNo(data?.document_no);
            },
            filterable: false
        }] : []),
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
                if (data.is_block_payment === 0) return 'No';
                if (data.is_block_payment === 1) return 'Yes';
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
            branch_id: "",
            branch_number: "",
            selected_cutoff: "",
            cutoff_start: "",
            cutoff_end: "",
            action: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            key_word: Yup.string(),
            column_type: Yup.string().when('key_word', (keyWord, schema) => 
                String(keyWord) !== ""
                    ? schema.required('Column type is required')
                    : schema.notRequired()
            ),
            branch_id: Yup.string(),
            branch_number: Yup.string(),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            api.triggerReload();
            setSubmitting(true);
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);

        getAllEntries({
            page: paginator.page,
            per_page: paginator.per_page,
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
            key_word: '',
            column_type: '',
        },
        validateOnChange: false,
        onSubmit: async (values) => {
            const isConfirm = await confirm({
                title: "Export",
                message: "Are you sure you want to export?"
            });
            
            if (isConfirm) {
                unique_api && unique_api(values).then((resp: any) => {
                    const blob = new Blob([resp.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');

                    const now = new Date();
                    const monthName = now.toLocaleString('default', { month: 'long' });
                    const day = String(now.getDate()).padStart(2, '0');
                    const year = now.getFullYear();
    
                    a.href = downloadUrl;
                    a.download = `ENTRIES-${monthName.toUpperCase()}-${day}-${year}.xls`;
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
                            options={columnSettings.filter((column: any) => column.filterable !== false).map((column:any) => {
                                return {
                                    label: column.columnHead,
                                    value: column.path
                                }
                            })}
                        />
                        <Textfield
                            name="key_word"
                            label="Keyword"
                            placeholder="enter keyword"
                            value={formHandler.values.key_word}
                            onChange={formHandler.handleChange}
                        />
                        <BranchDropDown
                            placeholder="select branch"
                            label="Branch"
                            name="branch_id"
                            value={formHandler.values.branch_id}
                            onChange={(e) => {
                                formHandler.handleChange(e);
                                formHandler.setFieldValue("branch_number", e.target.obj?.branch_number || "");
                            }}
                            error={formHandler.errors.branch_id}
                        />
                        <CutOffDropDown
                            value={formHandler.values.selected_cutoff}
                            onChange={(e) => {
                                formHandler.setFieldValue("selected_cutoff", e.target.value);
                                formHandler.setFieldValue("cutoff_start", e.target.obj?.start_time || "");
                                formHandler.setFieldValue("cutoff_end", e.target.obj?.end_time || "");
                            }}
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
                                label="Generate"
                                onClick={() => {
                                    formHandler.setFieldValue("action", "generate");
                                    dateRangeConfirmModal.onOpen();
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
                        {(exportPermission === "" || permissions.includes(exportPermission)) &&
                            <>
                                { hasExport &&
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
                modal={dateRangeConfirmModal}
            />
        </>
    );
};

export default EntriesTableCard;
