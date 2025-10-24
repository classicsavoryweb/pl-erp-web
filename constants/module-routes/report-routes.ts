interface SubLink {
    name: string;
    pathname: string;
    permission: string;
    break?: boolean;
    isDropDown?: boolean;
    subLinks?: SubLink[];
}

interface BaseRoute {
    name: string;
    icon: string;
    type: "link" | "dropdown";
    permission: string;
}

interface LinkRoute extends BaseRoute {
    type: "link";
    pathname: string;
}

export interface DropdownRoute extends BaseRoute {
    basepath: string;
    type: "dropdown";
    subLinks: SubLink[];
}

export type Route = LinkRoute | DropdownRoute;

export const reportRoutes: Route[] = [
    {
        name: "Reports",
        icon: "InsertChartOutlined",
        type: "dropdown",
        permission: "view_reports_module",
        basepath: "/reports",
        subLinks: [
            {
                name: "Pag-ibig",
                pathname: "/reports/pagibig",
                permission: "view_reports_pagibig"
            },
            {
                name: "SSS",
                pathname: "/reports/sss",
                permission: "view_reports_sss"
            },
            {
                name: "Philhealth",
                pathname: "/reports/philhealth",
                permission: "view_reports_philhealth"
            },
        ]
    }
];