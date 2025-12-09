
interface TimelineInterface {
    data: {
        timeline_title: string;
        description: string;
    }[];
};

const Timeline = ({
    data
}: TimelineInterface) => {
    return (
        <div className="relative w-full">
            { data && data.map((data, key:number) => {
                    return (
                        <div key={key} className="flex flex-col">
                            <div className="flex items-center">
                                <div className="w-[15px] h-[15px] rounded-full bg-red-500"></div>
                                <p className="ml-5 text-[13px]">{data.timeline_title}</p>
                            </div>
                            <div className="flex items-center">
                                <div className="min-h-[25px] w-[3px] bg-gray-300 ml-[6px] mt-[-2.5px]"></div>
                                <p className="ml-6.5 text-xs">{data.description}</p>
                            </div>
                        </div>
                    );
                })

            }
        </div>
    )
};

export default Timeline;