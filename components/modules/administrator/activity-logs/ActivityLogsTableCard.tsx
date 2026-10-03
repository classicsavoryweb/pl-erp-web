    "use client";

    import Card from "@/components/common/Card";
    import Table from "@/components/common/Table";
    import { COLUMNTYPES } from "@/constants/column";
    import { useApiCall } from "@/hooks/api-call";
    import { useAsyncEffect } from "@/hooks/async-effect";
    import usePagination from "@/hooks/pagination";
    import { toast } from "react-toastify";
    import { getAllActivityLogs } from "@/api/activity-logs";
    import { useState } from "react";
    import { useModal } from "@/hooks/modal";
    import Modal from "@/components/common/Modal";
    import Grid from "@/components/common/Grid";
    import FilterCard from "@/components/modules/cards/FilterCard";
    import { useFilter } from "@/hooks/use-filter";

    const ActivityLogsTableCard = () => {
        const api = useApiCall();
        const paginator = usePagination(10);
        const [data, setData] = useState<any>({});
        const modal = useModal();
        const filter = useFilter();

        useAsyncEffect(() => {
            api.setLoading(true);
            getAllActivityLogs({
                page: paginator.page,
                per_page: paginator.per_page,
                ...filter.filters
            })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching api and permissions");
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

        const columnSettings = [
            {
                columnHead: "Log Name",
                path: "log_name",
                columnType: COLUMNTYPES.string
            },
            {
                columnHead: "Description",
                path: "description",
                columnType: COLUMNTYPES.string
            },
            {
                columnHead: "Created By",
                path: "causer.full_name",
                columnType: COLUMNTYPES.string
            },
            {
                columnHead: "Created At",
                path: "created_at",
                columnType: COLUMNTYPES.timestamp
            },
        ];

        const actions = [
            {
                label: "View",
                onClick: (data: any) => {
                    setData(data);
                    modal.onOpen();
                }
            }
        ];

        return (
            <>
                <FilterCard 
                    columnSettings = {[
                        {
                            columnHead:"Log Name",
                            path:"log_name",
                            columnType:COLUMNTYPES.string
                        },
                        {
                            columnHead:"Description",
                            path:"description",
                            columnType:COLUMNTYPES.string
                        },
                        {
                            columnHead:"Created By",
                            path:"causer.full_name",
                            columnType:COLUMNTYPES.string
                        },
                        
                    ]}
                    filterHandler = {filter}
                    defaultColumnSelected="log_name"
                    callBack={ () =>paginator.setPage}
                />
                <Card>
                    <Table
                        dataSet={api.dataSet}
                        columnSettings={columnSettings}
                        loading={api.loading}
                        paginator={paginator}
                        withActions
                        actions={actions}
                    />
                </Card>

                <Modal
                    isShowing={modal.isShowing}
                    onClose={modal.onClose}
                    title="Properties"
                    size="xl"
                >    
                    <Grid cols={2}>
                        { data.properties?.old &&
                            <div className="mt-2">
                                <p className="font-semibold text-xs">Old:</p>
                                {Object.entries(data.properties.old).map(([key, value]) => (
                                <div className="text-[11px]" key={key}>
                                    <p>{key} : {String(value)}</p>
                                </div>))}
                            </div>
                        }
                        { data.properties?.attributes &&
                            <div className="mt-2">
                                <p className="font-semibold text-xs">Changes:</p>
                                {Object.entries(data.properties.attributes).map(([key, value]) => (
                                <div className="text-[11px]" key={key}>
                                    <p>{key} : {String(value)}</p>
                                </div>))}
                            </div>
                        }
                    </Grid>
                </Modal>
            </>
        );
    };

    export default ActivityLogsTableCard;