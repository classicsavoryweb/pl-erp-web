"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import Dropdown from "@/components/common/Dropdown"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeTrainingTitle } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import TrainingTitleDropDown from "../../generic/TrainingTitleDropDown";
import confirm from "@/components/common/Confirm";
import TextArea from "@/components/common/TextArea";
import SearchableDropDown from "@/components/common/SearchableDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getTrainingTitles } from "@/api/training-title";
import { useApiCall } from "@/hooks/api-call";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const EmployeeTrainingForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = addEmployeeTrainingTitle;
    const titleApi = useApiCall();
    const [training, setTraining] = useState<any>({});

    const formHandler = useFormik({
        initialValues: {
            id: "",
            training_title : "",
            speaker : "",
            venue : "",
            batch : "",
            others : "No",
            date : "",
            option : "",
            covered_date : "",
            score : "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            training_title: Yup.string().required("Training Title is required."),
            date: Yup.string().required("Date is required."),
            speaker : Yup.string().required("Speaker is required."),
            venue : Yup.string().required("Venue is required."),
            others : Yup.string().required("Date is required."),
            covered_date : Yup.string().required("Covered dates is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Trainings",
                message: "Are you sure you want to save?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                api(String(employeeNumber), values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        resetForm();
                        onSubmitCallback();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered")
                }).finally(() => {
                    setSubmitting(false);
                });
            }
        }
    });

    useAsyncEffect(() => {
        if (modal.isShowing) {
            titleApi.setLoading(true);
            getTrainingTitles({
                option: ""
            })
            .then((resp) => {
                if (!resp.error) {
                    const newDataset = resp.data.training_titles.map((training: any) => {
                        return {
                            label: training.title,
                            value: training
                        };
                    });
                    titleApi.setDataSet(newDataset);
                }
            })
            .finally(() => {
                titleApi.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    useEffect(() => {
        if (action === "edit" && modal.isShowing) {
            formHandler.setValues(data);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title={ action === "add" ? "Add Training Title" : "Edit Training Title"}
            size="md"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <Dropdown
                label="Others"
                required
                name="others"
                placeholder="select option"
                value={formHandler.values.others}
                options={[
                    {
                        label: "Yes",
                        value: "Yes"
                    },
                    {
                        label: "No",
                        value: "No"
                    },
                ]}
                onChange={(e) => {
                    formHandler.resetForm();
                    setTraining({});
                    formHandler.handleChange(e);
                }}
            />

            <SearchableDropDown
                label="Trainings"
                required
                name="others"
                placeholder="select option"
                value={training}
                loading={titleApi.loading}
                options={titleApi.dataSet}
                onChange={(e) => {
                    const value:any = e.target.value;
                    setTraining(value);
                    formHandler.setValues(prev => ({
                        ...prev,
                        training_title: value.title,
                        speaker: value.speaker,
                        venue: value.venue,
                        option: value.option
                    }));
                }}
            />
            <Textfield
                type="date"
                label="Date"
                name="date"
                value={formHandler.values.date || ""}
                error={formHandler.errors.date}
                onChange={formHandler.handleChange}
            />
            <Dropdown
                label="Option"
                required
                name="option"
                placeholder="select option"
                value={formHandler.values.option}
                options={[
                    {
                        label: "Internal",
                        value: "Internal"
                    },
                    {
                        label: "External",
                        value: "External"
                    },
                ]}
                onChange={formHandler.handleChange}
                disabled={formHandler.values.others === "No"}
            />
            <TextArea
                label="Title"
                name="training_title"
                value={formHandler.values.training_title || ""}
                error={formHandler.errors.training_title}
                onChange={formHandler.handleChange}
                disabled={formHandler.values.others === "No"}
            />
            <Textfield
                label="Speaker"
                name="speaker"
                placeholder="enter speaker"
                value={formHandler.values.speaker || ""}
                error={formHandler.errors.speaker}
                onChange={formHandler.handleChange}
            />
            <Textfield
                label="Venue"
                name="venue"
                placeholder="enter venue"
                value={formHandler.values.venue || ""}
                error={formHandler.errors.venue}
                onChange={formHandler.handleChange}
            />
            <TextArea
                label="Covered Dates"
                name="covered_date"
                placeholder="enter covered dates"
                value={formHandler.values.covered_date || ""}
                error={formHandler.errors.covered_date}
                onChange={formHandler.handleChange}
            />
            <Textfield
                label="Batch"
                name="batch"
                placeholder="enter batch"
                value={formHandler.values.batch || ""}
                error={formHandler.errors.batch || ""}
                onChange={formHandler.handleChange}
                disabled={formHandler.values.others === "Yes"}
            />
            <Textfield
                label="Score"
                name="score"
                placeholder="enter score"
                value={formHandler.values.score || ""}
                onChange={formHandler.handleChange}
            />
            <Button
                loading={formHandler.isSubmitting}
                onClick={() => {}}
                label="Submit"
                type="submit"
            />
        </form>
        </Modal>
    );
};

export default EmployeeTrainingForm;