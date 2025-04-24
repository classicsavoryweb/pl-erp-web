"use client";
interface TitleInterface {
    title: string;
};

const PageTitle = ({
    title
}: TitleInterface) => {
    return (
        <>
            <p className="text-xl font-semibold text-gray-500 py-3">
                {title}
            </p>
        </>
    );
};

export default PageTitle