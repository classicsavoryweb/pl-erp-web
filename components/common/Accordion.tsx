"use client";

import { useState } from "react";
import Card from "./Card";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';

interface AccordionInterface {
    title: string;
    children: React.ReactNode;
    isExpanded?: boolean;
};

const Accordion = ({
    title,
    children,
    isExpanded = false
}: AccordionInterface) => {

    const [toggle, setToggle] = useState<boolean>(isExpanded);

    return (
        <Card>
            <div
                className={`w-full flex justify-between items-center hover:cursor-pointer ${toggle ? "text-blue-950 dark:text-red-500" : ""}`}
                onClick={() => setToggle(prev => !prev)}
            >
                <p
                    className={`${toggle ? "font-semibold" : ""} dark:text-slate-200`}
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
    );
};

export default Accordion;