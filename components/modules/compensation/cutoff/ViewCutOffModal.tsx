import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Timeline from "../../generic/Timeline";
import moment from "moment";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import { useEffect, useState } from "react";
import { finalizeCutOff, initializeCutOff, reComputeIncentives } from "@/api/compensation/cut-off";
import { toast } from "react-toastify";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useModal } from "@/hooks/modal";
import GeneratePayrollModal from "./GeneratePayrollModal";

interface ModalInterface {
    modal: any;
    data: any;
}

const ViewCutOffModal = ({
    modal,
    data
}: ModalInterface) => {
    const [value, setValue] = useState<any>({});
    const generatePayrollModal = useModal();

    useEffect(() => {
        if (modal.isShowing) {
            setValue(data);
        }
    }, [modal.isShowing]);

    const actions = [
        {
            label: "Initialize",
            onClick: async () => {
                const isConfirmed = await confirm({
                    title: "Initialize Cutoff",
                    message: "Are you sure you want to initialize cutoff"
                });

                isConfirmed &&
                initializeCutOff(value.id)
                .then((resp) => {
                    if (!resp.error) {
                        setValue(resp.data.cut_off);
                        toast.success(resp.data.message);
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        },
        {
            label: "Generate Payroll",
            onClick: () => {
                generatePayrollModal.onOpen();      
            }
        },
        {
            label: "Compute Incentives",
            onClick: async () => {
                const isConfirmed = await confirm({
                    title: "Incentives",
                    message: "Are you sure you want to compute incentives?"
                }); 
                
                isConfirmed &&
                reComputeIncentives(value.id)
                .then((resp) => {
                    if (!resp.error) {
                        // setValue(resp.data.cut_off);
                        toast.success(resp.data.message);
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        },
        {
            label: "Finalize Cutoff",
            onClick: async () => {
                const isConfirmed = await confirm({
                    title: "Finalize Cutoff",
                    message: "Are you sure you want to finalize cutoff"
                });

                isConfirmed &&
                finalizeCutOff(value.id)
                .then((resp) => {
                    if (!resp.error) {
                        setValue(resp.data.cut_off);
                        toast.success(resp.data.message);
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });             
            }
        },
    ];

    const filteredActions =
        data.part == 1
            ? actions
            : actions.filter((_, index) => index !== 2)

    return (
        <>
        <Modal
            size="lg"
            isShowing = {modal.isShowing}
            onClose = {() => {
                modal.onClose();
            }}
            title="Cutoff Details"
        >
            <Grid cols={2}>
                <Textfield
                    disabled
                    label="Cutoff"
                    value={data.cut_off}
                />

                <Textfield
                    disabled
                    label="Pay Date"
                    value={data.pay_date}
                />
            </Grid>

            { data.initializations &&
                <>
                    <div className="flex items-center justify-between mt-5">
                        <p>Initialization History</p>
                        <div>
                            <DropDownButtons
                                actions={filteredActions}
                            />
                        </div>
                    </div>

                    <div className="max-h-[500px] overflow-hidden overflow-y-auto">
                        <Timeline
                            data={
                                value.initializations &&
                                JSON.parse(value.initializations)
                                    .flatMap((item: any) => {
                                        const result: any[] = [];

                                        if (item.initialized_at) {
                                            result.push({
                                                timeline_title: moment(item.initialized_at).format("MMM. DD, YYYY hh:mm A"),
                                                description: `Initialized by ${item.initialized_by}`
                                            });
                                        }

                                        if (item.finalized_at) {
                                            result.push({
                                                timeline_title: moment(item.finalized_at).format("MMM. DD, YYYY hh:mm A"),
                                                description: `Finalized by ${item.finalized_by}`
                                            });
                                        }

                                        if (item.computed_at) {
                                            result.push({
                                                timeline_title: moment(item.computed_at).format("MMM. DD, YYYY hh:mm A"),
                                                description: `Incentive Computed by ${item.computed_by}`
                                            });
                                        }

                                        if (item.generated_at) {
                                            result.push({
                                                timeline_title: moment(item.initialized_at).format("MMM. DD, YYYY hh:mm A"),
                                                description: `Payroll Generated by ${item.initialized_by}`
                                            });
                                        }

                                        return result;
                                    })
                            }
                        />
                    </div>
                </>
            }
        </Modal>
        <GeneratePayrollModal
            modal={generatePayrollModal}
        />
        </>
    );
};

export default ViewCutOffModal;