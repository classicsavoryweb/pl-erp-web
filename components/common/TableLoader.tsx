const TableLoader = () => {
    return (
        <div className="flex justify-center items-center p-2">
            <div className="flex flex-row gap-2">
                <div className="w-[14px] h-[14px] rounded-full bg-blue-950  animate-bounce"></div>
                <div className="w-[14px] h-[14px] rounded-full bg-blue-950  animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-[14px] h-[14px] rounded-full bg-blue-950  animate-bounce [animation-delay:-.5s]"></div>
            </div>
        </div>
    )
};

export default TableLoader;