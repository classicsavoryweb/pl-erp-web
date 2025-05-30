import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { editMinutesOfTardiness, getTardinessDetails } from "@/api/reports/reports-tardiness";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";
import Grid from "@/components/common/Grid";
import TextArea from "@/components/common/TextArea";

interface FormModalInterface {
    modal: any;
    id: number;
};

const TardinessDetailsModal = ({
    modal,
    id
}: FormModalInterface) => {
    const api = useApiCall();

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);

            getTardinessDetails(id).then((resp) => {
                if (!resp.error) {
                    api.setData(resp.data);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            })
        }
    }, [modal.isShowing]);
    
    return (
        <Modal
            isShowing={modal.isShowing}
            title="Tardiness Details"
            onClose={() => {
                modal.onClose();
            }}
            loading={api.loading}
            size="md"
        >

            { api.data.reason && 
                <div
                    className="pb-2"
                >
                    <p
                        className="font-semibold"
                    >
                        Reason for Voiding:
                    </p>
                    <p>
                        {api.data.reason}
                    </p>
                </div>
            }
            <p
                className="font-semibold"
            >
                Minutes Late:
            </p>
            { api.data.tardiness_minutes  && api.data.tardiness_minutes.map((minutes: any, idx: number) => {
                return (
                    <div
                        className="
                            flex
                            gap-x-2
                        "
                        key={idx}
                    >
                        <p>{minutes.late_date} : </p>
                        <p>{minutes.late_minutes} mins</p>
                    </div>
                );
            })
            }
            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end">
                <div>
                    <Button
                        label="Close"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                        }}
                    />
                </div>              
            </div>
        </Modal>
    );
};

export default TardinessDetailsModal;