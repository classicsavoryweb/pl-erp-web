"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import Badge from "@/components/common/Badge";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useState } from "react";
import { getAllBir2316, exportAllBir2316 } from "@/api/reports/reports-bir-2316";
import { useModal } from "@/hooks/modal";
import Button from "@/components/common/Button";
import ActionDropDown from "@/components/common/ActionDropDown";
import ImportBir2316Modal from "./ImportBir2316Modal";
import ViewBir2316Modal from "./ViewBir2316Modal";
import { useFilter } from "@/hooks/use-filter";
import { useFormik } from "formik";
import Accordion from "@/components/common/Accordion";
import Grid from "@/components/common/Grid";
import Dropdown from "@/components/common/Dropdown";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import confirm from "@/components/common/Confirm";

const scheduleLabels: Record<string, string> = {
    schedule_1: "Schedule 1 (Taxable)",
    schedule_2: "Schedule 2 (Non-Taxable)",
};

const Bir2316TableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const importModal = useModal();
    const viewModal = useModal();
    const filter = useFilter();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const formHandler = useFormik({
        initialValues: {
            year: new Date().getFullYear(),
            schedule_type: "",
            employee: null as any,
            employee_id: "",
        },
        validateOnChange: false,
        onSubmit: async (values, { setSubmitting }) => {
            paginator.setPage(1);
            api.triggerReload();
            filter.onReload();
            filter.setFilters(values);
            setSubmitting(true);
        }
    });

    const exportHandler = useFormik({
        initialValues: {
            year: new Date().getFullYear(),
            schedule_type: "",
            employee_id: "",
        },
        validateOnChange: false,
        onSubmit: async (values, { setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Export",
                message: "Are you sure you want to export?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                exportAllBir2316(values)
                    .then((resp: any) => {
                        if (resp?.error) {
                            toast.error(resp?.data?.message ?? "Error exporting 2316 records");
                            return;
                        }

                        const fileData = resp?.data ?? resp;
                        const blob = new Blob([fileData], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        });
                        const downloadUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");

                        a.href = downloadUrl;
                        a.download = `BIR-2316-${values.year ?? "all"}.xlsx`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                    .catch(() => {
                        toast.error("Error encountered");
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
            }
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllBir2316({
            page: paginator.page,
            per_page: paginator.per_page,
            year: formHandler.values.year,
            schedule_type: formHandler.values.schedule_type,
            employee_id: formHandler.values.employee_id,
        })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching 2316 records");
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

    const columnSettings = [
        {
            columnHead: "Year",
            path: "year",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee",
            path: "employee",
            columnType: COLUMNTYPES.function,
            function: (data: any) => data.employee
                ? `${data.employee.last_name}, ${data.employee.first_name} ${data.employee.middle_name ?? ""}`
                : "-"
        },
        {
            columnHead: "Employee No.",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.function,
            function: (data: any) => data.employee?.employee_number ?? "-"
        },
        {
            columnHead: "Schedule",
            path: "schedule_type",
            columnType: COLUMNTYPES.function,
            function: (data: any) => scheduleLabels[data.schedule_type] ?? data.schedule_type ?? "-"
        },
        {
            columnHead: "Total Taxes Withheld",
            path: "total_taxes_withheld",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => (
                <Badge
                    status={data.status === "final" ? "success" : "warning"}
                    label={String(data.status).toUpperCase()}
                />
            )
        },
        {
            columnHead: "Action",
            path: "action",
            columnType: COLUMNTYPES.function,
            function: (data: any) => (
                <ActionDropDown
                    data={data}
                    direct
                    label="View"
                    actions={[
                        {
                            label: "View",
                            onClick: (row: any) => {
                                setSelectedId(row.id);
                                viewModal.onOpen();
                            }
                        }
                    ]}
                />
            )
        }
    ];

    return (
        <>
            <Accordion
                title="Filters"
            >
                <form onSubmit={formHandler.handleSubmit}>
                    <Grid cols={4}>
                        <Dropdown
                            placeholder="select year"
                            label="Year"
                            name="year"
                            value={String(formHandler.values.year)}
                            onChange={formHandler.handleChange}
                            options={Array.from(
                                { length: new Date().getFullYear() - 2017 + 1 },
                                (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return { label: year.toString(), value: year.toString() };
                                }
                            )}
                        />
                        <Dropdown
                            placeholder="select schedule"
                            label="Schedule"
                            name="schedule_type"
                            value={formHandler.values.schedule_type}
                            onChange={formHandler.handleChange}
                            options={[
                                { label: "Schedule 1 (Taxable)", value: "schedule_1" },
                                { label: "Schedule 2 (Non-Taxable)", value: "schedule_2" },
                            ]}
                        />
                        <SearchEmployeeDropDown
                            label="Employee"
                            placeholder="select employee"
                            name="employee_id"
                            onChange={(e) => {
                                const employee = e.target.value;
                                formHandler.setFieldValue("employee", employee);
                                formHandler.setFieldValue("employee_id", employee?.id ?? "");
                            }}
                            value={formHandler.values.employee}
                            status="all"
                        />
                    </Grid>
                    <div className="flex justify-end gap-x-1">
                        <div>
                            <Button
                                type="submit"
                                label="Search"
                                onClick={() => {}}
                                isIcon
                                iconType="search"
                            />
                        </div>
                        <div>
                            <Button
                                label="Export"
                                type="button"
                                loading={exportHandler.isSubmitting}
                                onClick={() => {
                                    exportHandler.setValues((prev) => ({
                                        ...prev,
                                        year: formHandler.values.year,
                                        schedule_type: formHandler.values.schedule_type,
                                        employee_id: formHandler.values.employee_id,
                                    }));
                                    exportHandler.submitForm();
                                }}
                                variant="success"
                                isIcon
                                iconType="export"
                            />
                        </div>
                        <div>
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    formHandler.resetForm();
                                    formHandler.submitForm();
                                }}
                                variant="secondary"
                                isIcon
                                iconType="reset"
                            />
                        </div>
                    </div>
                </form>
            </Accordion>
            <Card>
                <div className="flex justify-end gap-x-3">
                    <div className="w-[180px]">
                        <Button
                            label="Import 2316"
                            onClick={() => importModal.onOpen()}
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

            <ImportBir2316Modal
                modal={importModal}
                onSubmitCallback={api.triggerReload}
            />

            <ViewBir2316Modal
                modal={viewModal}
                id={selectedId}
                onSubmitCallback={api.triggerReload}
            />
        </>
    );
};

export default Bir2316TableCard;
