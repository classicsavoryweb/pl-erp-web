"use client";
interface TitleInterface {
    title: string;
};

const PageTitle = ({
    title
}: TitleInterface) => {
    return (
        <>
            <title>{`${title} | Classic Savory ERP`}</title>
            <p className="text-[15px] font-semibold text-gray-500 pb-2">
                {title}
            </p>
        </>
    );
};

export default PageTitle