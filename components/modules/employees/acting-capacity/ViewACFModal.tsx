"use client";

import Modal from "@/components/common/Modal"
import { toast } from "react-toastify";
import { getACF } from "@/api/acting-capacity";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import EnglishACFPDF from "../../pdf/acting-capacity/EnglishACFPDF";
import TagalogACFPDF from "../../pdf/acting-capacity/TagalogACFPDF";
import { useState } from "react";

interface FormModalInterface {
    modal: any;
    id: string;
};

const ViewACFModal = ({
    modal,
    id,
}: FormModalInterface) => {

    const api = useApiCall();
    const [type, setType] = useState<String>("");

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);

            getACF(id).then((resp) => {
                if (!resp.error) {
                    setType(resp.data.type);
                    api.setData(resp.data.acting_capacity);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    return (
        <Modal
            loading={api.loading}
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
            }}
            title="Acting Capacity Appointment"
            size="xxl"
        >
            { type === "english"
                ?
                <EnglishACFPDF
                    data={api.data}
                />
                :
                <TagalogACFPDF
                    data={api.data}
                />
            }
        </Modal>
    );
};

export default ViewACFModal;