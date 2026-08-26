"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import confirm from "@/components/common/Confirm";
import usePagination from "@/hooks/pagination";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import * as Yup from "yup";
import Grid from "@/components/common/Grid";
import BranchDropDown from "../../generic/BranchDropDown";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { getCurrentCutoff } from "@/helper/cutoff";
import CutOffDropDown from "../../generic/CutOffDropDown";
import Accordion from "@/components/common/Accordion";
import { deleteTravelOvertime, exportAllTravelOvertimes, getAllTravelOvertimes } from "@/api/transactions/travel-overtime";
import { useState } from "react";
import CreateTravelOvertimeModal from "./CreateTravelOvertimeModal";
import EditTravelOvertimeModal from "./EditTravelOvertimeModal";
import ImportTravelTimeModal from "./ImportTravelTimeModal";

const TravelOvertimeTableCard = () => {
    const api = useApiCall();
    const [data, setData] = useState<any>({});
    const importModal = useModal();
    const createModal = useModal();
    const editModal = useModal();
    const paginator = usePagination(10);
    const filter = useFilter();

    const tableAction = [
        {
            label: "Edit",
            onClick: (data: any) => {
                setData(data);
                editModal.onOpen();
            }
        },
        {
            label: "Delete",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Travel Overtime",
                    message: "Are you sure you want to delete?"
                });

                if (isConfirmed) {
                    try {
                        const resp = await deleteTravelOvertime(data.id);

                        if (!resp.error) {
                            toast.success(resp.data.message);
                            api.triggerReload();
                        } else {
                            toast.error(resp.data.message);
                        }
                    } catch {
                        toast.error("Error encountered");
                    }
                }
            }
        }
    ]

    const columnSettings = [
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Number",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Current Branch",
            path: "employee.current_branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Current Position",
            path: "employee.current_position.description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Travel Time",
            path: "travel_time",
            columnType: COLUMNTYPES.timekeeping
        },
    ];

    const globalActionSettings = [
        {
            label: "Create Travel Overtime",
            onClick: () => {
                createModal.onOpen();
            }
        },
        {
            label: "Import Travel Overtime",
            onClick: () => {
                importModal.onOpen();
            }
        },
    ];

    const formHandler = useFormik({
        initialValues: {
            key_word: "",
            column_type: "employee.full_name",
            branch_id: "",
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
            paginator.setPage(1);
            api.triggerReload();
            filter.onReload();
            filter.setFilters(values);
            setSubmitting(true);
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllTravelOvertimes({
            page: paginator.page,
            per_page: paginator.per_page,
            ...formHandler.values 
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching overtime");
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
                exportAllTravelOvertimes(values).then((resp: any) => {
                    const blob = new Blob([resp.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
    
                    a.href = downloadUrl;
                    a.download = `TRAVEl-OVERTIME-${moment().format('YYYY-MM-DD')}.xls`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            }
        }
    });

    return (
        <>
            <Accordion
                title="Filters"
                isExpanded
            >
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
                        <BranchDropDown
                            placeholder="select branch"
                            label="Branch"
                            name="branch_id"
                            value={formHandler.values.branch_id}
                            onChange={formHandler.handleChange}
                            error={formHandler.errors.branch_id}
                        />
                        <CutOffDropDown
                            value={formHandler.values.selected_cutoff}
                            onChange={(e) => {
                                formHandler.setFieldValue("selected_cutoff", e.target.value);
                                formHandler.setFieldValue("cutoff", e.target.obj || null);
                            }}
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
                                onClick={() => {
                                    exportHandler.setValues(prev => ({
                                        ...prev,
                                        ...formHandler.values
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
                                    // exportHandler.resetForm();
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
                    <DropDownButtons
                        actions={globalActionSettings}
                    />
                </div>
                <Table
                    withActions
                    actions={tableAction}
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
            <CreateTravelOvertimeModal
                modal={createModal}
                callBack={api.triggerReload}
            />
            <EditTravelOvertimeModal
                modal={editModal}
                callBack={api.triggerReload}
                data={data}
            />
            <ImportTravelTimeModal
                modal={importModal}
            />
        </>
    );
};

export default TravelOvertimeTableCard;