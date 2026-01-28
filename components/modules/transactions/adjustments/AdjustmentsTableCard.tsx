"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import DropDownButtons from "@/components/common/DropDownButtons";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import Badge from "@/components/common/Badge";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import { useFilter } from "@/hooks/use-filter";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Grid from "@/components/common/Grid";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { getCurrentCutoff } from "@/helper/cutoff";
import CutOffDropDown from "../../generic/CutOffDropDown";
import ActionDropDown from "@/components/common/ActionDropDown";
import { approveAdjustments, getAdjustment, getAllAdjustments, unapproveAdjustments, voidAdjustments } from "@/api/transactions/adjustments";
import CreateAdjustmentsModal from "./CreateAdjustmentsModal";
import { useState } from "react";
import ViewAdjustmentModal from "./ViewAdjustmentModal";

const AdjustmentsTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(20);
    const createAdjustments = useModal();
    const viewAdjustments = useModal();
    const filter = useFilter();
    const [id, setId] = useState<number|string>(0);
    const statusOption = [
        {
            label: "Approved",
            value: "Approved"
        },
        {
            label: "Adjusted",
            value: "Adjusted"
        },
        {
            label: "Voided",
            value: "Voided"
        },
    ];

    const columnSettings = [
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Biometric Number",
            path: "employee.biometric_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Position",
            path: "employee.current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Cancelled RD",
            path: "cancelled_rd",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Taxable Amount",
            path: "taxable_amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                let status: "default" | "success" | "danger" | "warning" = "default" ;

                switch (data.status) {
                    case "Approved":
                        status = "success";
                        break;
                    case "Adjusted":
                        status = "success";
                        break;
                    case "Voided":
                        status = "warning";
                        break;
                    case "Unapproved":
                        status = "danger";
                        break;
                    case "Reflected":
                        status = "success";
                        break;
                    default:
                        status = "default";
                        break;
                };
                return <Badge
                    label={data.status}
                    status={status}
                />
            }
        },
        {
            columnHead: "Action",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let actions = [
                    tableActions[0],
                    tableActions[1],
                ];

                if (data.status === "Approved") {
                    actions = [
                        tableActions[2],
                        tableActions[3]
                    ];
                }

                if (data.status === "Adjusted") {
                    actions = [
                        tableActions[3]
                    ];
                }

                if (data.status === "Unapproved" || data.status === "Voided" || data.status === "Reflected" ) {
                    return "—";
                }
                
                return (
                    <ActionDropDown
                        data={data}
                        actions={actions}
                    />
                );
            }
        }
    ];

    const tableActions = [
        {
            label: "Approve",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Approve Adjustments",
                    message: "Are you sure you want to approve this adjustments?",
                });

                isConfirmed &&
                approveAdjustments(data.id).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            },
            permission: "approve_transactions_adjustments"
        },
        {
            label: "Unapprove",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Unapprove Adjustments",
                    message: "Are you sure you want to unapprove this adjustments?",
                });

                isConfirmed &&
                unapproveAdjustments(data.id).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            },
            permission: "unapprove_transactions_adjustments"
        },
        {
            label: "Void",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Void Adjustments",
                    message: "Are you sure you want to void this adjustments?",
                });

                isConfirmed &&
                voidAdjustments(data.id).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        api.triggerReload();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            },
            permission: "unapprove_transactions_adjustments"
        },
        {
            label: "View",
            onClick: async (data: any) => { 
                setId(data.id);
                viewAdjustments.onOpen();
            },
        },
    ];

    const globalActionSettings = [
        {
            label: "Create Adjustments",
            onClick: () => {
                createAdjustments.onOpen();
            }
        },
    ];

    const formHandler = useFormik({
        initialValues: {
            key_word: "",
            column_type: "employee.full_name",
            status: "",
            cutoff: {
                ...getCurrentCutoff()
            },
            selected_cutoff: getCurrentCutoff().range,
            year: moment().year(),
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
        getAllAdjustments({
            page: paginator.page,
            per_page: paginator.per_page,
            ...formHandler.values 
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching adjustments");
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
                        <CutOffDropDown
                            value={formHandler.values.selected_cutoff}
                            onChange={(e) => {
                                formHandler.setFieldValue("selected_cutoff", e.target.value);
                                formHandler.setFieldValue("cutoff", e.target.obj || null);
                            }}
                        />
                        <Dropdown
                            placeholder="select year"
                            label="Year"
                            name="year"
                            value={String(formHandler.values.year)}
                            onChange={formHandler.handleChange}
                            options={Array.from({ length: 100 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return { label: year.toString(), value: year.toString() };
                            })}
                        />
                        <Dropdown
                            placeholder="select status"
                            label="Status"
                            name="status"
                            value={formHandler.values.status}
                            onChange={formHandler.handleChange}
                            options={statusOption}
                        />
                    </Grid>
                    <div className="flex justify-end gap-x-2">
                        <div className="w-[100px]">
                            <Button
                                type="submit"
                                label="Search"
                                onClick={() => {}}
                                callBack={() => {
                                paginator.setPage(1);
                                }}
                            />    
                        </div>
                        <div className="w-[100px]">
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    formHandler.resetForm();
                                    formHandler.submitForm();
                                }}
                                variant="secondary"
                            />    
                        </div>
                    </div>
                </form>
            </Card>
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={globalActionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <CreateAdjustmentsModal
                modal={createAdjustments}
                callBack={() => {
                    api.triggerReload();
                }}
            />

            <ViewAdjustmentModal
                modal={viewAdjustments}
                id={id}
            />
        </>
    );
};

export default AdjustmentsTableCard;