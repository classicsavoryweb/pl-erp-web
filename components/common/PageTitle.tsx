"use client";
interface TitleInterface {
    title: string;
};

const PageTitle = ({
    title
}: TitleInterface) => {
    return (
        <>
            <p className="text-2xl font-semibold text-gray-500 pb-3">
                {title}
            </p>
        </>
    );
};

export default PageTitle