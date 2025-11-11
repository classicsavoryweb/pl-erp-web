"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { useModal } from "@/hooks/modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useFilter } from "@/hooks/use-filter";
import { getAllReportsBDOCashCard, exportAllReportsBDOCashCard, exportAllReportsBDOCashCardHistory} from "@/api/reports/reports-bdo-cash-card";
import DropDownButtons from "@/components/common/DropDownButtons";
import Grid from "@/components/common/Grid";
import Dropdown from "@/components/common/Dropdown";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";

const BDOCashCardTableCard = () => {
    
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const exportBDOCashCardHistoryModal = useModal();

    const columnSettings = [
        {
            columnHead: "Employee Number",
            path: "employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Name",
            path: "full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Cash Card",
            path: "latest_bank_details.bank_number",
            columnType: COLUMNTYPES.string
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
            column_type: "full_name",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            key_word: Yup.string(),
            column_type: Yup.string().when('key_word', (keyWord, schema) => 
                String(keyWord) !== ""
                    ? schema.required('Column type is required')
                    : schema.notRequired()
            ),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            api.triggerReload();
            filter.onReload();
            filter.setFilters(values);
            setSubmitting(true);
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllReportsBDOCashCard({
            page: paginator.page,
            per_page: paginator.per_page,
            ...formHandler.values 
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching bdo cash cards");
            } else {
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            api.setLoading(false);
        });
    }, [paginator.reload, api.reload, filter.reload]);

    const actionsSettings = [
        {
            initialValues: {
                key_word: '',
                column_type: '',
            },
            validateOnChange: false,
            label: "Export BDO Cash Card",
            onClick: async () => {
                const isConfirm = await confirm({
                    title: "Export BDO Cash Card",
                    message: "Are you sure you want to export?"
                });

                if (isConfirm) {
                    exportAllReportsBDOCashCard().then((resp: any) => {
                        const blob = new Blob([resp.data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        const downloadUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;

                        const now = new Date();
                        const monthName = now.toLocaleString('default', { month: 'long' });
                        const day = String(now.getDate()).padStart(2, '0');
                        const year = now.getFullYear();

                        a.download = `BDO-CASH-CARD-NO.-${monthName.toUpperCase()}-${day}-${year}.xls`;

                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                }
            }
        },
        {
            validateOnChange: false,
            label: "Export BDO Cash Card History",
            onClick: async () => {
                const isConfirm = await confirm({
                    title: "Export BDO Cash Card",
                    message: "Are you sure you want to export?"
                });

                if (isConfirm) {
                    exportAllReportsBDOCashCardHistory().then((resp: any) => {
                        const blob = new Blob([resp.data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        const downloadUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;

                        const now = new Date();
                        const monthName = now.toLocaleString('default', { month: 'long' });
                        const day = String(now.getDate()).padStart(2, '0');
                        const year = now.getFullYear();

                        a.download = `BDO-CASH-CARD-HISTORY-${monthName.toUpperCase()}-${day}-${year}.xls`;

                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                }
            }
        }
    ];

    return (
        <>
            <Card>
                <p className="text-sm font-semibold text-red-800">Filters</p>
                <form onSubmit={formHandler.handleSubmit}>
                    <Grid cols={4}>
                        <Dropdown
                            placeholder="select column"
                            label="Column"
                            name="column_type"
                            value={formHandler.values.column_type}
                            error={formHandler.errors.column_type}
                            onChange={formHandler.handleChange}
                            options={columnSettings.map((column:any) => {
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
                    </Grid>
                    <div className="flex justify-end gap-x-2">
                        <div className="w-[100px]">
                            <Button
                                label="Search"
                                onClick={() => {
                                    formHandler.setFieldValue("action", "search");
                                    formHandler.submitForm();
                                    api.triggerReload();
                                }}
                            />    
                        </div>
                        <div className="w-[100px]">
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    api.setDataSet([]);
                                    formHandler.submitForm();
                                    formHandler.resetForm();
                                }}
                                variant="secondary"
                            />    
                        </div>
                    </div>
                </form>
            </Card>
            <Card>
                <div className="flex justify-end">
                    <div>
                        <DropDownButtons
                            actions={actionsSettings}
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
        </>
    );
};

export default BDOCashCardTableCard;