"use client";
import { getEmployeeBranchhes } from "@/api/employee";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const EmployeeBranchHistory = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();
    const paginator = usePagination(5);
    const [data, setData] = useState<any>({});
    const modal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getEmployeeBranchhes(String(employeeNumber),{
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching branches");
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
            columnHead: "Branch",
            path: "branch.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Date assigned",
            path: "date_assigned",
            columnType: COLUMNTYPES.string
        },
    ];

    // const tableActions = [
    //     {
    //         label: "View",
    //         onClick: (data: any) => {
    //             modal.onOpen();
    //             setData(data);
    //         }
    //     },
    // ];
    
    return (
        <>
            <Modal
                isShowing={modal.isShowing}
                onClose={modal.onClose}
                title="Properties"
                size="xl"
            >    
                { data.properties?.old &&
                    <div>
                        <p>Old Data:</p>
                        <pre className="text-[12px]">
                            {JSON.stringify(data.properties?.old, null, 2)}
                        </pre>
                    </div>
                }
                { data.properties?.attributes &&
                    <div>
                        <p>{data.properties?.old ? "New Data" : "Data:"}</p>
                        <pre className="text-[12px]">
                            {JSON.stringify(data.properties?.attributes, null, 2)}
                        </pre>
                    </div>

                }
            </Modal>

            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                paginator={paginator}
                // withActions
                // actions={tableActions}
            />
        </>
    );
};

export default EmployeeBranchHistory;