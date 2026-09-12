"use cient";

import Accordion from "@/components/common/Accordion"
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import PositionDropDown from "../generic/PositionDropDown";
import BranchDropDown from "../generic/BranchDropDown";
import EmploymentStatusDropdown from "../generic/EmploymentStatusDropDown";
import EmployeeTypeDropDown from "../generic/EmployeeTypeDropDown";
import confirm from "@/components/common/Confirm";
import { ReactNode, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useModal } from "@/hooks/modal";
import Modal from "@/components/common/Modal";
import Checkbox from "@/components/common/Checkbox";
import moment from "moment";
import FilterBranchDropDown from "../generic/FilterBranchDropDown";
import AgencyDropDown from "../generic/AgencyDropDown";
import { toast } from "react-toastify";
import RateCodeDropDown from "../generic/RateCodeDropDown";

interface FilterInterface {
    hasDateRange?: boolean;
    withStatus?: boolean;
    withEmployeeStatus?: boolean;
    withHolidayType?: boolean;
    columnSettings?: any;
    filterHandler: any;
    withBranch?: boolean;
    withFilterBranch?: boolean;
    withPosition?: boolean;
    withEmploymentStatus?: boolean;
    withEmployeeType?: boolean;
    withRateCode?: boolean;
    isExpanded?: boolean,
    defaultColumnSelected?: string;
    dateLabel?: string;
    hasExport?: boolean;
    api?: (values: any) => any;
    exportFileName?: string;
    statusOption?: {label: string, value: string}[];
    holidayTypeOption?: {label: string, value: string}[];
    exportPermission?: string;
    callBack?: () => void;
    withMonth?: boolean;
    withYear?: boolean;
    withExportOptions?: boolean;
    exportOptions?: {label: string, value: string, checked?: boolean}[];
    columnSort?: boolean;
    filterValues?: any;
    triggerSort?: boolean;
    children?: ReactNode;
};
const FilterCard = ({
    isExpanded = false,
    hasDateRange = false,
    columnSettings,
    filterHandler,
    withStatus = false,
    withEmployeeStatus = false,
    withHolidayType = false,
    withBranch = false,
    withFilterBranch = false,
    withPosition = false,
    withEmploymentStatus = false,
    withEmployeeType = false,
    withRateCode = false,
    defaultColumnSelected = "",
    dateLabel = "Date",
    hasExport = false,
    api,
    exportFileName = "export.xls",
    statusOption = [
        {
            label: "Active",
            value: "active"
        },
        {
            label: "Inactive",
            value: "inactive"
        }
    ],
    holidayTypeOption = [
        {
            label: "Legal Holiday",
            value: "LH"
        },
        {
            label: "Special Holiday",
            value: "SH"
        }
    ],
    exportPermission = "",
    callBack,
    withMonth = false,
    withYear = false,
    withExportOptions = false,
    exportOptions,
    columnSort = false,
    filterValues,
    children,
}: FilterInterface) => {

    const optionModal = useModal();
    const { permissions } = useContext(AuthContext);
    const formHandler = useFormik({
        initialValues: {
            key_word: '',
            column_type: defaultColumnSelected,
            date_from: '',
            date_to: '',
            status: "",
            employee_status: "",
            holiday_type: "",
            branch_id: "",
            position_id: "",
            employee_status_id: "",
            type: "",
            agency_id: "",
            rate_code: "",
            year: moment().year(),
            month: "",
            sortColumn: "",
            sort: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            key_word: Yup.string(),
            column_type: Yup.string().when('key_word', (keyWord, schema) => 
                String(keyWord) !== ""
                    ? schema.required('Column type is required')
                    : schema.notRequired()
            ),
            date_from: Yup.string(),
            date_to: Yup.string().when('date_from', (dateFrom, schema) => 
                String(dateFrom) !== ""
                    ? schema.required('Date to is required')
                    : schema.notRequired()
            ),
            status: Yup.string(),
            employee_status: Yup.string(),
            holiday_type: Yup.string()
        }),
        onSubmit: (values) => {
            callBack && callBack();
            filterHandler.setFilters(values);
            filterHandler.onReload();
        }
    });

    const exportHandler = useFormik({
        initialValues: {
            key_word: '',
            column_type: defaultColumnSelected,
            date_from: '',
            date_to: '',
            status: "",
            employee_status: "",
            holiday_type: "",
            branch_id: "",
            position_id: "",
            employee_status_id: "",
            type: "",
            agency_id: "",
            rate_code: "",
            sortColumn: "",
            sort: "",
            fields: [],
        },
        validateOnChange: false,
        onSubmit: async (values) => {
            const isConfirm = await confirm({
                title: "Export",
                message: "Are you sure you want to export?"
            });
            
            if (isConfirm) {
                api && api(values).then((resp: any) => {
                    const payload = resp?.data ?? resp;
                    const isBlob = payload instanceof Blob;
                    const isArrayBuffer = payload && payload.byteLength !== undefined;
                    if (!resp || resp.error || (!isBlob && !isArrayBuffer)) {
                        toast.error(
                            resp?.data?.message || resp?.message || "Export failed. Please try again."
                        );
                        return;
                    }

                    const blob = isBlob ? payload : new Blob([payload], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
    
                    a.href = downloadUrl;
                    a.download = exportFileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });

                if (withExportOptions) {
                    exportHandler.resetForm();
                    optionModal.onClose();
                }
                
            }
        }
    });

    useEffect(() => {
        if (optionModal.isShowing && exportOptions) {
            const currentFields = exportHandler.values.fields || [];

            const newOptions = exportOptions.filter(option => 
                option.checked &&
                !currentFields.some((field:any) => field.value === option.value)
            );

            if (newOptions.length > 0) {
                exportHandler.setFieldValue("fields", [
                    ...currentFields,
                    ...newOptions
                ]);
            }
        }
    }, [optionModal.isShowing, exportOptions]);

    useEffect(() => {
        if (columnSort) {
            formHandler.setValues((prev => ({
                ...prev,
                sortColumn: filterValues.sortColumn,
                sort: filterValues.sort
            })));

            if (filterValues.submit) {
                formHandler.submitForm();
            }
        }
    }, [filterValues]);
    const selectedFields = exportHandler.values.fields || []; 
    const normalOptions = exportOptions?.filter(o => o.value !== "check_all") || []; 
    const allSelected = normalOptions.length > 0 && selectedFields.length === normalOptions.length;

    return (
        <>
        <div className="w-full">
            <Accordion
                title="Filters"
                isExpanded={isExpanded}
            >
                <form className="pt-5" onSubmit={formHandler.handleSubmit}>
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

                        { withPosition &&
                            <PositionDropDown
                                placeholder="select position"
                                label="Position"
                                name="position_id"
                                value={formHandler.values.position_id}
                                onChange={formHandler.handleChange}
                            />
                        }

                        { withBranch &&
                            <BranchDropDown
                                placeholder="select branch"
                                label="Branch"
                                name="branch_id"
                                value={formHandler.values.branch_id}
                                onChange={formHandler.handleChange}
                            />
                        }
                        { withFilterBranch &&
                            <FilterBranchDropDown
                                placeholder="select branch"
                                label="Branch"
                                name="branch_id"
                                value={formHandler.values.branch_id}
                                onChange={formHandler.handleChange}
                            />
                        }
                        { withStatus &&
                            <Dropdown
                                placeholder="select status"
                                label="Status"
                                name="status"
                                value={formHandler.values.status}
                                onChange={formHandler.handleChange}
                                options={statusOption}
                            />
                        }
                        { withRateCode &&
                            <RateCodeDropDown
                                placeholder="select rate code"
                                label="Rate Code"
                                name="rate_code"
                                value={formHandler.values.rate_code}
                                onChange={formHandler.handleChange}
                            />
                        }
                        { withEmployeeStatus &&
                            <Dropdown
                                placeholder="select employee status"
                                label="Employee Status"
                                name="employee_status"
                                value={formHandler.values.employee_status}
                                onChange={formHandler.handleChange}
                                options={[
                                    {
                                        label: "Active",
                                        value: "active"
                                    },
                                    {
                                        label: "Inactive",
                                        value: "inactive"
                                    }
                                ]}
                            />
                        }
                        { withHolidayType &&
                            <Dropdown
                                placeholder="select holiday type"
                                label="Holiday Type"
                                name="holiday_type"
                                value={formHandler.values.holiday_type}
                                onChange={formHandler.handleChange}
                                options={holidayTypeOption}
                            />
                        }
                        { withEmploymentStatus &&
                            <EmploymentStatusDropdown
                                placeholder="select employment status"
                                label="Employment Status"
                                name="employee_status_id"
                                value={formHandler.values.employee_status_id}
                                onChange={formHandler.handleChange}
                                type={
                                    formHandler.values.status === "active" || formHandler.values.status === "inactive"
                                    ? formHandler.values.status
                                    : undefined
                                }
                            />
                        }
                        { hasDateRange &&
                        <>
                            <Textfield
                                name="date_from"
                                label={`${dateLabel} From`}
                                type="date"
                                value={formHandler.values.date_from}
                                onChange={formHandler.handleChange}
                            />
                            <Textfield
                                name="date_to"
                                label={`${dateLabel} To`}
                                type="date"
                                value={formHandler.values.date_to}
                                error={formHandler.errors.date_to}
                                onChange={formHandler.handleChange}
                            />
                        </>
                        }
                        { withEmployeeType &&
                        <>
                            <EmployeeTypeDropDown
                                placeholder="select employment type"
                                label="Employment Type"
                                name="type"
                                value={formHandler.values.type}
                                onChange={(e) => {
                                    formHandler.handleChange(e);
                                    if (e.target.value !== "Agency") {
                                        formHandler.setFieldValue("agency_id", "");
                                    }
                                }}
                            />
                            { formHandler.values.type === "Agency" &&
                            <AgencyDropDown
                                label="Agency"
                                name="agency_id"
                                placeholder="select agency"
                                onChange={formHandler.handleChange}
                                value={formHandler.values.agency_id}
                                error={formHandler.errors.agency_id}
                            />
                            }
                        </>
                        }
                        { withMonth &&
                            <Dropdown
                                placeholder="select month"
                                label="Month"
                                name="month"
                                value={formHandler.values.month}
                                onChange={formHandler.handleChange}
                                options={[
                                    { label: "January", value: "01" },
                                    { label: "February", value: "02" },
                                    { label: "March", value: "03" },
                                    { label: "April", value: "04" },
                                    { label: "May", value: "05" },
                                    { label: "June", value: "06" },
                                    { label: "July", value: "07" },
                                    { label: "August", value: "08" },
                                    { label: "September", value: "09" },
                                    { label: "October", value: "10" },
                                    { label: "November", value: "11" },
                                    { label: "December", value: "12" },
                                ]}
                            />
                        }
                        { withYear &&
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
                        }
                    </Grid>
                    <div className="flex justify-between gap-x-2">
                        <div>{children}</div>
                        <div className="flex gap-x-1">
                            <div>
                                <Button
                                    type="submit"
                                    label="Search"
                                    onClick={() => {}}
                                    isIcon
                                    iconType="search"
                                />    
                            </div>
                            
                            { (exportPermission === "" || permissions.includes(exportPermission)) &&
                                <>
                                    { hasExport &&
                                        <div>
                                            <Button
                                                label="Export"
                                                type="button"
                                                onClick={() => {
                                                    exportHandler.setValues(prev => ({
                                                        ...prev,
                                                        ...formHandler.values
                                                    }));

                                                    if (!withExportOptions) {
                                                        exportHandler.submitForm();
                                                    } else {
                                                        optionModal.onOpen();
                                                    }
                                                }}
                                                variant="success"
                                                isIcon
                                                iconType="export"
                                            />    
                                        </div>
                                    }
                                </>
                            }
                            <div>
                                <Button
                                    label="Reset"
                                    type="button"
                                    onClick={() => {
                                        formHandler.resetForm();
                                        exportHandler.resetForm();
                                        formHandler.submitForm();
                                    }}
                                    variant="secondary"
                                    isIcon
                                    iconType="reset"
                                />    
                            </div>
                        </div>
                    </div>
                </form>
            </Accordion>
        </div>
        {
            withExportOptions &&
            <Modal
                title="Export Options"
                isShowing={optionModal.isShowing}
                onClose={optionModal.onClose}
                size="lg"
            >
               <div className="pb-2 flex justify-between items-center">
                    <p className="text-xs font-semibold">
                        Employee Details
                    </p>

                    <Checkbox
                        label="Select All"
                        value="check_all"
                        checked={allSelected}
                        onChange={(e) => {
                            if (e.target.checked) {
                                exportHandler.setFieldValue("fields", [...normalOptions]);
                            } else {
                                exportHandler.setFieldValue("fields", []);
                            }
                        }}
                    />
                </div>
                <Grid cols={3}>
                    { exportOptions && exportOptions.map((option, key) => {
                        return (
                            <div className="py-1" key={key}>
                                <Checkbox
                                    label={option.label}
                                    value={option}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            exportHandler.setFieldValue("fields", [
                                                ...exportHandler.values.fields,
                                                option
                                            ]);
                                        } else {
                                            exportHandler.setFieldValue(
                                                "fields",
                                                exportHandler.values.fields.filter(
                                                    (field: any) => field.value !== option.value
                                                )
                                            );
                                        }
                                    }}
                                    checked={selectedFields.some(
                                        (field: any) => field.value === option.value
                                    )}
                                />
                            </div>
                        );
                    })
                    }
                </Grid>
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                optionModal.onClose();
                                exportHandler.resetForm();
                            }}
                        />
                    </div>     
                    <div>
                        <Button
                            type="button"
                            label="Submit"
                            onClick={() => {
                                exportHandler.submitForm();
                            }}
                        />         
                    </div>
                </div>
            </Modal>
        }
        </>
    );
};

export default FilterCard;
