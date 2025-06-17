"use client";
interface TitleInterface {
    title: string;
};

const PageTitle = ({
    title
}: TitleInterface) => {
    return (
        <>
            <p className="text-lg font-semibold text-gray-500 pb-2">
                {title}
            </p>
        </>
    );
};

export default PageTitle