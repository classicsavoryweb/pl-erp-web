"use client";

import Modal from "@/components/common/Modal"
import { toast } from "react-toastify";
import { getACF } from "@/api/acting-capacity";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import EnglishACFPDF from "../../pdf/acting-capacity/EnglishACFPDF";
import TagalogACFPDF from "../../pdf/acting-capacity/TagalogACFPDF";
import { useState } from "react";
import EnglishPromotionPDF from "../../pdf/acting-capacity/EnglishPromotionPDF";
import TagalogPromotionPDF from "../../pdf/acting-capacity/TagalogPromotionPDF";

interface FormModalInterface {
    modal: any;
    id: string;
};

const ViewConfirmationDocumentModal = ({
    modal,
    id,
}: FormModalInterface) => {

    const api = useApiCall();
    const [type, setType] = useState<String>("");
    const [recommended, setRecommended] = useState<boolean>(false);

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);

            getACF(id).then((resp) => {
                if (!resp.error) {
                    setType(resp.data.type);
                    setRecommended(resp.data.with_recommendation);
                    api.setData(resp.data);
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
            title="Promotion Confirmation Documents"
            size="xxl"
        >
            { type === "english"
                ?
                <EnglishPromotionPDF
                    data={api.data}
                    withRecommendation={recommended}
                />
                :
                <TagalogPromotionPDF
                    data={api.data}
                />
            }
        </Modal>
    );
};

export default ViewConfirmationDocumentModal;