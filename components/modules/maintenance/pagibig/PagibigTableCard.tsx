"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { AuthContext } from "@/context/AuthProvider";
import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import FilterCard from "../../cards/FilterCard";
import confirm from "@/components/common/Confirm";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import EditPagibigForm from "./EditPagibigForm";
import { exportAllPagibig, getAllPagibig } from "@/api/maintenance/pagibig";

interface PagibigInterface {
    hasExport?: boolean;
    exportPermission?: string;
    unique_api?: (values: any) => any;
};

const PagibigTableCard = ({
    unique_api = exportAllPagibig,
    hasExport = true,
    exportPermission = "export_all_transactions_schedule_time",

}: PagibigInterface) => {
    const api = useApiCall();
    const editModal = useModal();
    const [data, setData] = useState({});
    const { permissions } = useContext(AuthContext);
    const paginator = usePagination();
    const filter = useFilter();

    const columnSettings = [
        {
            columnHead: "Employer Share",
            path: "employer_share",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Share",
            path: "employee_share",
            columnType: COLUMNTYPES.string
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    employer_share: data.employer_share,
                    employee_share: data.employee_share,
                });
            }
        },
    ];

    const formHandler = useFormik({
        initialValues: {},
        validateOnChange: false,
        onSubmit: async (values, { setSubmitting }) => {
            api.triggerReload();
            filter.onReload();
            filter.setFilters(values);
            setSubmitting(true);
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllPagibig({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching pagibig contributions");
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
    
                    a.href = downloadUrl;
                    a.download = `PAGIBIG-${moment().format('YYYY-MM-DD')}.xls`;
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
                <form onSubmit={formHandler.handleSubmit}>
                    <div className="flex justify-end gap-x-2">
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
                        <div className="w-[100px]">
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    formHandler.resetForm();
                                    exportHandler.resetForm();
                                    formHandler.submitForm();
                                }}
                                variant="secondary"
                            />    
                        </div>
                    </div>
                </form>
            </Card>

            <Card>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <EditPagibigForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />

        </>
    );
};

export default PagibigTableCard;