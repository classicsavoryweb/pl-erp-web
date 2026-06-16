
"use client";


import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import Badge from "@/components/common/Badge";
import { useState } from "react";
import { getAllRequestAndIssuance , exportAllRequestAndIssuance , updateRequestStatus} from "@/api/uniform/request-and-issuance";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import CancelRequestAndIssuance from "./UniformRequestAndIssuanceCancelForm"
import UniformRequestAndIssuanceForm from "./UniformRequestAndIssuanceForm";
import moment from "moment";
import DropDownButtons from "@/components/common/DropDownButtons";



const UniformSizesTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const viewModal = useModal();
    const cancelModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();


     useAsyncEffect(() => {
        api.setLoading(true);
        getAllRequestAndIssuance({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters,
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching uniform items");
            } else {
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);                       
            }                    
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        { columnHead: "Request Number", path: "request_number", columnType: COLUMNTYPES.string },
        { columnHead: "Date Requested", path: "date_requested", columnType: COLUMNTYPES.date },
        { columnHead: "Date Posted", path: "date_posted", columnType: COLUMNTYPES.date },
        { columnHead: "Full Name", path: "employee_name", columnType: COLUMNTYPES.string },
        { columnHead: "Issuance Type", path: "issuance_type", columnType: COLUMNTYPES.string },
        { columnHead: "Branch", path: "branch", columnType: COLUMNTYPES.string },
        { columnHead: "Position", path: "position", columnType: COLUMNTYPES.string },
        { columnHead: "Date Hired", path: "date_hired", columnType: COLUMNTYPES.date },
        { columnHead: "Total Amount", path: "total_amount", columnType: COLUMNTYPES.string },
        { columnHead: "Status", path: "status", columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                switch(data.status) {
                    case "Posted": 
                        status = "success";
                        break;
                    case "Cancelled":
                        status = "danger";
                        break;
                    case "Reviewing":
                        status = "warning";
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
        { columnHead: "Sent Email", path: "sent_email", columnType: COLUMNTYPES.string },
        { columnHead: "Payroll Entry", path: "payroll_entry", columnType: COLUMNTYPES.string },
        { columnHead: "Payroll Sent Date", path: "payroll_sent_date", columnType: COLUMNTYPES.string },
        
        
    ];

    const actionSettings = [
        {
            label: "Add Uniform Request",
            onClick: () => {
                createModal.onOpen();
            }
        },
    ];
    
   const tableActions = [
        {
            label: "View",
            onClick: (item: any) => {
                setData(item);
                viewModal.onOpen();
            },
        },
        {
            label: "Reviewing",
            hidden: (item: any) => item.status !== "Unposted",
            onClick: async (item: any) => {
                const isConfirmed = await confirm(
                    "Are you sure you want to mark this as Reviewing?"
                );

                if (!isConfirmed) return;

                await updateRequestStatus(item.id, "Reviewing");
                toast.success("Marked as Reviewing");
                api.triggerReload();
            },
        },
        {
            label: "Posted",
            hidden: (item: any) => item.status !== "Reviewing",
             onClick: async (item: any) => {
                if (!confirm("Are you sure you want to mark this as Posted?")) return;

                await updateRequestStatus(item.id, "Posted");
                toast.success("Marked As Posted");
                api.triggerReload();
            },
        },
        {
            hidden: (item: any) => !["Unposted", "Reviewing"].includes(item.status),
            label: "Cancel",
            onClick: (item: any) => {
                setData(item);
                cancelModal.onOpen();
            },
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Description",
                        path: "description",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Status",
                        path: "status",
                        columnType: COLUMNTYPES.status
                    },
                    
                ]}
                filterHandler={filter}
                exportFileName={`Sizes-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="description"
                 hasExport
                api={exportAllRequestAndIssuance}
                callBack={() => {
                paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={actionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}        
                />
            </Card>
             <UniformRequestAndIssuanceForm 
                modal = {createModal}
                mode = "create"
                onSubmitCallback={api.triggerReload}
            />
            <UniformRequestAndIssuanceForm 
                modal = {viewModal}
                mode = "view"
                formValue={data}
                onSubmitCallback={api.triggerReload}
            />
              <CancelRequestAndIssuance
                modal = {cancelModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default UniformSizesTableCard;
