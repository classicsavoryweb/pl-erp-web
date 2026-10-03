"use client";

import {
    createPhysicalCount,
    exportPhysicalCountDetails,
    exportPhysicalCounts,
    getPhysicalCounts,
    previewPhysicalCount,
    updateQuantity
} from "@/api/uniform/physical-count";
import PhysicalCountViewForm from "./PhysicalCountViewForm";
import PhysicalCountCancelForm from "./PhysicalCountCancelForm";
import ActionDropDown from "@/components/common/ActionDropDown";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";;
import Table from "@/components/common/Table";
import FilterCard from "@/components/modules/cards/FilterCard";
import { COLUMNTYPES } from "@/constants/column";
import { AuthContext } from "@/context/AuthProvider";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import PasswordForm from "./PasswordForm";
import ChangeQuanityForm from "./PhysicalChangeQuantityForm";
import PhysicalCountCreateForm from "./PhyiscalCountCreateForm";

interface TableCardProps {
    performPermission: string;
    createPermission?: string;
    exportPermission?: string;
    cancelPermission?: string;
    updateQuantityPermission?: string;
    reviewPermission?: string;
    postPermission?: string;
}

const title = "Physical Count";

const responseMessage = (resp: any) =>
    resp?.message ?? resp?.data?.message ?? "Unable to complete request.";

const getStatusBadge = (status: string): "success" | "warning" | "danger" | "purpose" |"default" => {
    switch (status) {
        case "Posted":
            return "success";
        case "Reviewed":
            return "warning";
        case "Cancelled":
            return "danger";
        case "Updated":
            return "purpose";
        default:
            return "default";
    }
};

const PhysicalCountTableCard = ({
    performPermission,
    createPermission = performPermission,
    exportPermission = performPermission,
    cancelPermission = performPermission,
    updateQuantityPermission = performPermission,
    reviewPermission = performPermission,
    postPermission = performPermission,
}: TableCardProps) => {
    const { permissions } = useContext(AuthContext);
    const canCreate = permissions.includes(createPermission);
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const formModal = useModal();
    const viewModal = useModal();
    const passwordModal = useModal();
    const cancelModal = useModal();
    const changeQuantityModal = useModal();
    const [selected, setSelected] = useState<any>(null);
    const [modalType, setModalType] = useState<"View" | "Review" | "Post">("View");
    const [physicalCounts, setPhysicalCounts] = useState<any[]>([]);
    const [password , setPassword] = useState("");
    const fetchRecords = () => {
        api.setLoading(true);

        getPhysicalCounts({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
            .then((resp: any) => {
                if (resp?.error) {
                    toast.error(responseMessage(resp));
                    return;
                }

                api.setDataSet(resp.data ?? []);
                setPhysicalCounts(resp.data ?? []);
                paginator.setPage(resp.current_page ?? 1);
                paginator.setPaginationData(resp);
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    };

    useAsyncEffect(fetchRecords, [paginator.reload, api.reload, filter.reload]);

    const openCreate = () => {
        formModal.onOpen();
    };

    const downloadDetailedExport = async (record: any) => {
        const resp = await exportPhysicalCountDetails(record.id);
        const payload = resp?.data ?? resp;
        const isBlob = payload instanceof Blob;
        const isArrayBuffer = payload && payload.byteLength !== undefined;

        if (!resp || resp.error || (!isBlob && !isArrayBuffer)) {
            toast.error(resp?.data?.message || resp?.message || "Export failed. Please try again.");
            return;
        }

        const blob = isBlob ? payload : new Blob([payload], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = downloadUrl;
        anchor.download = `PHYSICAL-COUNT-DETAILED-${record.physical_count_no}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };

    const actionsFor = (record: any) => [
        {
            label: "View",
            onClick: () => {
                setModalType("View");
                setSelected(record);
                viewModal.onOpen();
            },
        },
        {
            label: "Detailed Export",
            permission: exportPermission,
            onClick: () => downloadDetailedExport(record),
        },
        record.status === "Unposted" && {
            label: "Review",
            permission: reviewPermission,
            onClick: () =>{
                setModalType("Review");
                setSelected(record);
                viewModal.onOpen();
            },
        },
        record.status === "Reviewed" && {
            label: "Post",
            permission: postPermission,
             onClick: () =>{
                setModalType("Post");
                setSelected(record);
                viewModal.onOpen();
            },
        },
        ["Unposted", "Reviewed"].includes(record.status) && {
            label: "Cancel",
            permission: cancelPermission,
            onClick: () => {
                setSelected(record);
                cancelModal.onOpen();
            },
        },
        record.status === "Posted" && {
            label : "Update to Masterlist",
            permission: updateQuantityPermission,
            onClick: () => {
                setSelected(record);
                passwordModal.onOpen();
            }

        }
    ].filter(Boolean) as any[];

    const columns = [
        { columnHead: "Physical Count No.", path: "physical_count_no", columnType: COLUMNTYPES.string },
        {
        columnHead: "Covered Date" , path: "" , columnType:COLUMNTYPES.function,
            function:(data: any) => {
                const begin_date = data.begin_date ? moment(data.begin_date).format("MM/DD/YYYY") : "-";
                const end_date = data.ending_date ? moment(data.ending_date).format("MM/DD/YYYY") : "-";
                return `${begin_date} To ${end_date}`
            }
        },
        {columnHead: "Ending Inventory Date" , path: "" ,columnType:COLUMNTYPES.function,
            function:(data: any) => {
                const ending_inventory_date = data.ending_date ? moment(data.ending_date).format("MM/DD/YYYY") : "";
                return `${ending_inventory_date}`
            }
        },
        { columnHead: "Counted By", path: "counted_by", columnType: COLUMNTYPES.string },

       {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (record: any) => (
                <Badge
                    status={getStatusBadge(record.status)}
                    label={record.status}
                />
            ),
        },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
            function: (record: any) => <ActionDropDown data={record} actions={actionsFor(record)} />,
        },
    ];

    const beginDateOptions = Array.from(
        new Map(
            physicalCounts
                .filter((pc: any) => pc.status !== "Cancelled" && pc.ending_date)
                .map((pc: any) => [pc.ending_date, pc])
        ).values()
    )
        .sort((a: any, b: any) => new Date(b.ending_date).getTime() - new Date(a.ending_date).getTime())
        .map((pc: any) => ({
            label: moment(pc.ending_date).format("MM/DD/YYYY"),
            value: moment(pc.ending_date).format("YYYY-MM-DD"),
        }));

    const filterColumns = [
        { columnHead: "Physical Count No.", path: "physical_count_no" },
        { columnHead: "Counted By", path: "counted_by" },
        { columnHead: "Status", path: "status" },
        { columnHead: "Prepared By", path: "prepared_by" },
        { columnHead: "Reviewed By", path: "reviewed_by" },
        { columnHead: "Posted By", path: "posted_by" },
        { columnHead: "Cancelled By", path: "cancelled_by" },
    ];

    const statusOptions = [
        { label: "Unposted", value: "Unposted" },
        { label: "Reviewed", value: "Reviewed" },
        { label: "Posted", value: "Posted" },
        { label: "Cancelled", value: "Cancelled" },
    ];

   const confirmPassword = () => {
        if (password !== process.env.NEXT_PUBLIC_WEIGHTED_AVERAGE_PASSWORD) {
            toast.error("Invalid password");
            return;
        }
        if (!selected?.items || selected.items.length === 0) {
            toast.error("No items found.");
            return;
        }
        passwordModal.onClose();
        setPassword("");
        changeQuantityModal.onOpen();
    };

    return (
        <>
            <FilterCard
                columnSettings={filterColumns}
                filterHandler={filter}
                withStatus
                statusOption={statusOptions}
                hasDateRange
                dateLabel="Physical Count Date"
                defaultColumnSelected="physical_count_no"
                hasExport
                exportPermission={exportPermission}
                api={exportPhysicalCounts}
                exportFileName={`PHYSICAL-COUNT-${moment().format("YYYY-MM-DD")}.xls`}
                callBack={() => paginator.setPage(1)}
            />
            <Card>
                {canCreate && (
                    <div className="flex justify-end gap-x-3">
                        <DropDownButtons actions={[{ label: `Generate ${title}`, onClick: openCreate }]} />
                    </div>
                )}
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columns}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
            <PhysicalCountCreateForm
                modal={formModal}
                beginDateOptions={beginDateOptions}
                onCreated={api.triggerReload}
            />
            <PhysicalCountViewForm
                modal={viewModal}
                modalType={modalType}
                title={title}
                selected={selected}  
                onReload={api.triggerReload}
            />
            <PhysicalCountCancelForm
                modal={cancelModal}
                title={title}
                selected = {selected}
                responseMessage = {responseMessage}
                onSubmitCallback={api.triggerReload}
            />
           <PasswordForm
                modal={passwordModal}
                password={password}
                setPassword={setPassword}
                onConfirm={confirmPassword}
            />
            <ChangeQuanityForm
                modal={changeQuantityModal}
                selected={selected}
                onReload={api.triggerReload}
            />
        </>
    );
};


export default PhysicalCountTableCard;