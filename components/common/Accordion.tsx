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
                    className="w-full flex justify-between items-center hover:cursor-pointer"
                    onClick={() => setToggle(prev => !prev)}
                >
                    <p>{title}</p>

                    { toggle
                        ?
                        <ExpandLessOutlinedIcon
                            style={{ width: '25px', height: '25px' }}
                        />
                        :
                        <ExpandMoreOutlinedIcon
                            style={{ width: '25px', height: '25px' }}
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