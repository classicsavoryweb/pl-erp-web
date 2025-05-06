import Image from "next/image";

const EmptyState = () => {
    return (
        <div className="w-full flex justify-center p-5">
            <Image
                src="/images/empty.svg"
                width={120}
                height={120}
                alt="empty folder image"
            />
        </div>
    );
};

export default EmptyState;