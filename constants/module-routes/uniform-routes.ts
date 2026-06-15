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

export const uniformRoutes: Route[] = [
    {
        name: "Uniform",
        icon: "CheckroomOutlined",
        type: "dropdown",
        permission: "view_uniform_module",
        basepath: "/uniform",
        subLinks: [
            {
                name: "Item Masterlist",
                pathname: "/uniform/item-masterlist",
                permission: "view_uniform_item_masterlist"
            },
            {
                name: "Request and Issuance",
                pathname: "/uniform/request-and-issuance",
                permission: "view_uniform_request_and_issuance"
            },
        ]
    }
];