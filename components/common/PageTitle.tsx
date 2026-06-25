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
            <p className="text-[13.5px] font-semibold text-gray-500 pb-2 tracking-[.020rem] dark:text-slate-200">
                {title}
            </p>
        </>
    );
};

export default PageTitle