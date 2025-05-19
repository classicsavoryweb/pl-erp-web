"use client";
import { getEmployeeTrainings } from "@/api/employee";
import Button from "@/components/common/Button";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { EmployeeContext } from "@/context/EmployeeProvider";
import ActionDropDown from "@/components/common/ActionDropDown";
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
            path: "training.title",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Speaker",
            path: "training.speaker",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Venue",
            path: "training.venue",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Score",
            path: "score",
            columnType: COLUMNTYPES.string
        },
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
                    <Button
                        label="Add"
                        onClick={() => {
                            setAction("add");
                            modal.onOpen();
                        }}
                    />
                </div>
            </div>
            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                paginator={paginator}
            />
        </>
    );
};

export default EmployeeTraingingHistory;