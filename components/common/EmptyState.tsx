import Image from "next/image";

const EmptyState = () => {
    return (
        <div className="w-full flex justify-center p-2">
            <Image
                src="/images/empty.svg"
                width={100}
                height={100}
                alt="empty folder image"
            />
        </div>
    );
};

export default EmptyState;