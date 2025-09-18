import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Timeline from "../../generic/Timeline";
import moment from "moment";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import { useEffect, useState } from "react";
import { initializeCutOff } from "@/api/compensation/cut-off";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    data: any;
}

const ViewCutOffModal = ({
    modal,
    data
}: ModalInterface) => {
    const [value, setValue] = useState<any>({});

    useEffect(() => {
        if (modal.isShowing) {
            setValue(data);
        }
    }, [modal.isShowing]);

    return (
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
                            <Button
                                label="Initialize"
                                onClick={async () => {
                                    const isConfirmed = await confirm({
                                        title: "Initialize Cutoff",
                                        message: "Are you sure you want to initialize cutoff"
                                    })

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
                                }}
                            />
                        </div>
                    </div>
                    <Timeline
                        data={value.initializations && JSON.parse(value.initializations).map((item:any) => {
                            return {
                                timeline_title: moment(item.initialized_at).format("MMM. DD, YYYY hh:mm A"),
                                description: `Initialized by ${item.initialized_by}`
                            };
                        })}
                    />
                </>
            }
        </Modal>
    );
};

export default ViewCutOffModal;