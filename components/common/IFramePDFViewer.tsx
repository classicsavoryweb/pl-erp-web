import { useModal } from "@/hooks/modal";
import Button from "./Button";
import Modal from "./Modal";
import Image from "next/image";
import { getFileTypeFromBase64 } from "@/helper/file";

interface PDFViewerInterface {
    src: string;
    label: string;
}

const IFramePDFViewer = ({
    src,
    label
}: PDFViewerInterface) => {

    const modal = useModal();
    
    return (
        <div className="flex">
            <div>
                <Button
                    onClick={() => {
                        modal.onOpen();
                    }}
                    label="View"
                />
            </div>
            <Modal
                isShowing={modal.isShowing}
                onClose={modal.onClose}
                title={label}
                size="xxl"
            >
                <div className="w-full h-[85vh] overflow-auto">

                    { getFileTypeFromBase64(src) === "image"
                        ?
                        <img
                            src={src}
                            className="object-fit"
                            alt="preview"
                        />
                        :
                        <iframe
                            src={src}
                            className="origin-top-left"
                            style={{
                                width: '100%',
                                height: '100%',
                                transformOrigin: 'top left',
                            }}
                        />
                    }
                </div>
            </Modal>
        </div>
    );
};

export default IFramePDFViewer;