const Guest = ({
    children
}: {
    children : React.ReactNode;
}) => {
    return (
        <div
            className="h-screen w-full flex justify-center items-center dark:bg-neutral-800"
        >
            {children}
        </div>
    );
};

export default Guest;