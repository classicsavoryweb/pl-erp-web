"use client";

import { useState } from "react";
import Card from "./Card";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';

interface AccordionInterface {
    title: string;
    children: React.ReactNode;
};

const Accordion = ({
    title,
    children
}: AccordionInterface) => {

    const [toggle, setToggle] = useState<boolean>(false);

    return (
        <div
            className="w-full my-1"
        >
            <Card>
                <div
                    className={`w-full flex justify-between items-center hover:cursor-pointer ${toggle ? "text-red-800" : ""}`}
                    onClick={() => setToggle(prev => !prev)}
                >
                    <p
                        className={`${toggle ? "font-semibold" : ""}`}
                    >
                        {title}
                    </p>

                    { toggle
                        ?
                        <ExpandLessOutlinedIcon
                            style={{ width: '20px', height: '20px' }}
                        />
                        :
                        <ExpandMoreOutlinedIcon
                            style={{ width: '20px', height: '20px' }}
                        />
                    }
                </div>
                { toggle &&
                    <div className="w-full">
                        {children}
                    </div>
                }
            </Card>
        </div>
    );
};

export default Accordion;