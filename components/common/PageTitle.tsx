"use client";
interface TitleInterface {
    title: string;
};

import Head from 'next/head';

const PageTitle = ({
    title
}: TitleInterface) => {
    return (
        <>
            <p className="text-xl font-semibold text-gray-500">
                {title}
            </p>
        </>
    );
};

export default PageTitle