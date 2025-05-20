"use cient";

import Accordion from "@/components/common/Accordion"
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import ActiveInactiveDropDown from "../generic/ActiveInactiveDropDown";
import * as Yup from "yup";

interface FilterInterface {
    hasDateRange?: boolean;
    withStatus?: boolean;
    columnSettings?: any;
    filterHandler: any;
};
const FilterCard = ({
    hasDateRange = false,
    columnSettings,
    filterHandler,
    withStatus = false
}: FilterInterface) => {

    const formHandler = useFormik({
        initialValues: {
            key_word: '',
            column_type: '',
            date_from: '',
            date_to: '',
            status: ""
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
            status: Yup.string()
        }),
        onSubmit: (values) => {
            filterHandler.setFilters(values);
            filterHandler.onReload();
        }
    });

    return (
        <div className="w-[550px]">
            <Accordion
                title="Filters"
            >
                <form className="pt-5" onSubmit={formHandler.handleSubmit}>
                    <Grid cols={2}>
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

                    { hasDateRange &&
                        <Grid
                            cols={2}
                        >
                            <Textfield
                                name="date_from"
                                label="Date From"
                                type="date"
                                value={formHandler.values.date_from}
                                onChange={formHandler.handleChange}
                            />
                            <Textfield
                                name="date_to"
                                label="Date To"
                                type="date"
                                value={formHandler.values.date_to}
                                error={formHandler.errors.date_to}
                                onChange={formHandler.handleChange}
                            />
                        </Grid>
                    }
                    { withStatus &&
                        <Grid cols={2}>
                            <ActiveInactiveDropDown
                                placeholder="select status"
                                label="Status"
                                name="status"
                                value={formHandler.values.status}
                                onChange={formHandler.handleChange}
                            />
                        </Grid>
                    }
                    <div className="flex justify-end gap-x-2">
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
                        <div className="w-[100px]">
                            <Button
                                type="submit"
                                label="Search"
                                onClick={() => {}}
                            />    
                        </div>
                    </div>
                </form>
            </Accordion>
        </div>
    );
};

export default FilterCard;