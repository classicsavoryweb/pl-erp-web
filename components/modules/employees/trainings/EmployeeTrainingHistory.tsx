"use client";
import { exportEmployeeTrainings, getEmployeeTrainings } from "@/api/employee";
import confirm from "@/components/common/Confirm";
import DropDownButtons from "@/components/common/DropDownButtons";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { EmployeeContext } from "@/context/EmployeeProvider";
import EmployeeTrainingForm from "./EmployeeTrainingForm";

const EmployeeTraingingHistory = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();
    const paginator = usePagination(5);
    const [data, setData] = useState<any>({});
    const modal = useModal();
    const [action, setAction] = useState<"add" | "edit">("add");
    const { triggerReload, employee } = useContext(EmployeeContext);

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeTrainings(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching positions");
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
    }, [paginator.reload, api.reload]);

    const columnSettings = [
        {
            columnHead: "Title",
            path: "training_title",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Speaker",
            path: "speaker",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Venue",
            path: "venue",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Score",
            path: "score",
            columnType: COLUMNTYPES.string
        },
    ];
    
    const actionSettings = [
        {
            label: "Edit",
            onClick: (data:any) => {
                setAction("edit");
                setData({
                    id: data.id,
                    training_title : data.training_title,
                    speaker : data.speaker,
                    venue : data.venue,
                    batch : data.batch,
                    others : data.others,
                    date : data.date,
                    option : data.option,
                    covered_date : data.covered_date,
                    score : data.score,
                });
                modal.onOpen();
            }
        }
    ];

    return (
        <>
            <EmployeeTrainingForm
                modal={modal}
                onSubmitCallback={() => {
                    api.triggerReload();
                    modal.onClose();
                    triggerReload();
                }}
                action={action}
                data={data}
            />
            <div className="flex justify-end">
                <div>
                    <DropDownButtons
                        actions={[
                            {
                                label: "Add",
                                onClick: () => {
                                    setAction("add");
                                    modal.onOpen();
                                }
                            },
                            {
                                label: "Export",
                                onClick: async () => {
                                    const isConfirmed = await confirm({
                                        title: "Export",
                                        message: "Are you sure you want to export?"
                                    });

                                    if (isConfirmed) {
                                        exportEmployeeTrainings(String(employeeNumber))
                                        .then((resp) => {
                                            const blob = new Blob([resp.data], {
                                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                            });
                                            const downloadUrl = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');

                                            a.href = downloadUrl;
                                            a.download = `${employeeNumber}-EMPLOYEE-TRAININGS-${moment().format("YYYY-MM-DD")}.xls`;
                                            document.body.appendChild(a);
                                            a.click();
                                            a.remove();
                                        });
                                    }
                                }
                            },
                        ]}
                    />
                </div>
            </div>
            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                paginator={paginator}
                withActions
                actions={actionSettings}
            />
        </>
    );
};

export default EmployeeTraingingHistory;
