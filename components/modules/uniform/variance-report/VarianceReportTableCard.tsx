"use client";

import {
    exportVarianceDetails,
    exportVariances,
    getVariances,
} from "@/api/uniform/variance-report";
import VarianceReportViewForm from "./VarianceReportViewForm";
import VarianceReportViewItem from "./VarianceReportViewItem";
import {physicalCountDropdown} from "@/api/uniform/physical-count";
import ActionDropDown from "@/components/common/ActionDropDown";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
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
import { useState , useEffect, useContext} from "react";
import { toast } from "react-toastify";
import VarianceReportCancelForm from "./VarianceReportCancelForm";
import VarianceReportCreateForm from "./VarianceReportCreateForm";
interface TableCardProps {
    performPermission: string;
    createPermission?: string;
    exportPermission?: string;
    cancelPermission?: string;
    reviewPermission?: string;
    postPermission?: string;
}

const title = "Variance Report";

const today = () => new Date().toISOString().slice(0, 10);

const responseMessage = (resp: any) =>
    resp?.message ?? resp?.data?.message ?? "Unable to complete request.";

const getStatusBadge = (status: string): "success" | "warning" | "danger" | "default" => {
    switch (status) {
        case "Posted":
            return "success";
        case "Reviewed":
            return "warning";
        case "Cancelled":
            return "danger";
        default:
            return "default";
    }
};


const VarianceReportTableCard = ({
    performPermission,
    createPermission = performPermission,
    exportPermission = performPermission,
    cancelPermission = performPermission,
    reviewPermission = performPermission,
    postPermission = performPermission,
}: TableCardProps) => {
    const { permissions } = useContext(AuthContext);
    const canCreate = permissions.includes(createPermission);
    const api = useApiCall();
    const paginator = usePagination();
    const filter = useFilter();
    const formModal = useModal();
    const viewVarianceItemModal = useModal();
    const viewModal = useModal();
    const cancelModal = useModal();
    const [itemSearch, setItemSearch] = useState("");
    const [physicalCounts, setPhysicalCounts] = useState<any[]>([]);
    const [specialFilter, setSpecialFilter] = useState<string>("all");
    const [selected, setSelected] = useState<any>(null);
    const [modalType, setModalType] = useState<"View" | "Review" | "Post">("View");

    const [varianceForm, setVarianceForm] = useState({
        begin_date: today(),
        ending_date: today(),
        remarks: "",
        items: [] as any[],
    });

    const fetchRecords = () => {
        api.setLoading(true);

        getVariances({ page: paginator.page, per_page: paginator.per_page, ...filter.filters })
            .then((resp: any) => {
                if (resp?.error) {
                    toast.error(responseMessage(resp));
                    return;
                }

                api.setDataSet(resp.data ?? []);
                paginator.setPage(resp.current_page ?? 1);
                paginator.setPaginationData(resp);
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    };

    useAsyncEffect(fetchRecords, [paginator.reload, api.reload, filter.reload]);

    const openCreate = () => {
        setVarianceForm({
            begin_date:  physicalCounts[0].begin_date,
            ending_date: physicalCounts[0].ending_date,
            remarks: "",
            items: [],
        });

        formModal.onOpen();
    };

    useEffect(() => {
        const loadPhysicalCounts = async () => {
            const response = await physicalCountDropdown();

            setPhysicalCounts(response);

             if (response.length > 0) {
            setVarianceForm((prev) => ({
                ...prev,
                begin_date: response[0].begin_date,
                items: [],
            }));
        }
        };

        loadPhysicalCounts();
    }, []);

    const downloadDetailedExport = async (record: any) => {
        const resp = await exportVarianceDetails(record.id);
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
        anchor.download = `VARIANCE-DETAILED-${record.variance_no}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };
    
    const actionsFor = (record: any) => [
        {
            label: "View",
            onClick: () => {
                setModalType('View');
                setSelected(record);
                viewModal.onOpen();
                setItemSearch("");
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

            onClick: () => {
                setModalType("Review");
                setSelected(record);
                viewModal.onOpen();
                 setItemSearch("");
            },
        },
        record.status === "Reviewed" && {
            label: "Post",
            permission: postPermission,
            onClick: () => {
                setModalType("Post");
                setSelected(record);
                viewModal.onOpen();
                 setItemSearch("");
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
    ].filter(Boolean) as any[];

    const columns = [
        { columnHead: "Variance No.", path: "variance_no", columnType: COLUMNTYPES.string },
        { columnHead : "Covered Date" , path : "" , columnType:COLUMNTYPES.function,
            function:(data : any) => {
                const begin_date = data.begin_date ? moment(data.begin_date).format("MM/DD/YYYY") : "-";
                const ending_date = data.ending_date ? moment(data.ending_date).format("MM/DD/YYYY") : "-";
                return `${begin_date} To ${ending_date}`;
            }
        
        },
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

    const filterColumns = [
        { columnHead: "Variance No.", path: "variance_no" },
        { columnHead: "Physical Count No.", path: "physical_count.physical_count_no" },
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

    return (
        <>
            <FilterCard
                columnSettings={filterColumns}
                filterHandler={filter}
                withStatus
                statusOption={statusOptions}
                hasDateRange
                dateLabel="Variance Date"
                defaultColumnSelected="variance_no"
                hasExport
                exportPermission={exportPermission}
                api={exportVariances}
                exportFileName={`VARIANCE-REPORT-${moment().format("YYYY-MM-DD")}.xls`}
                callBack={() => paginator.setPage(1)}
            />
            <Card>
                {canCreate && (
                    <div className="flex justify-end gap-x-3">
                        <DropDownButtons actions={[
                            {
                                label: `Generate ${title}`,
                                onClick: () => {
                                    openCreate();
                                    setItemSearch("");
                                }
                            }
                        ]}
                        />
                    </div>
                )}

                <Table
                    dataSet={api.dataSet}
                    columnSettings={columns}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
            <VarianceReportCreateForm
                modal={formModal}
                onCreated={api.triggerReload}
            />


            <VarianceReportViewForm
                modal={viewModal}
                modalType={modalType}
                title={title}
                selected={selected}
                specialFilter={specialFilter}
                setSpecialFilter ={setSpecialFilter}
                itemSearch = {itemSearch}
                setItemSearch = {setItemSearch}
                onReload={api.triggerReload}
            />
            <VarianceReportCancelForm
                modal={cancelModal}
                title={title}
                selected={selected}
                responseMessage={responseMessage}
                onSubmitCallback ={api.triggerReload}
            />
            <VarianceReportViewItem
                modal={viewVarianceItemModal}
                formValue ={selected}
            />
        </>
    );
};


export default VarianceReportTableCard;
