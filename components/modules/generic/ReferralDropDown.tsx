"use cient";

import Dropdown from "@/components/common/Dropdown";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: any) => void;
    error?: string;
    value?: string;
    required?: boolean;
}

const ReferralDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required = false
}: SelectInterface) => {

    return (
        <Dropdown
            label={label}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            error={error}
            value={value}
            options={[
                {
                    label: "Absorbed",
                    value: "Absorbed"
                },
                {
                    label: "Flyers",
                    value: "Flyers"
                },
                {
                    label: "Former OJT",
                    value: "Former OJT"
                },
                {
                    label: "Gmail",
                    value: "Gmail"
                },
                {
                    label: "Job Posting",
                    value: "Job Posting"
                },
                {
                    label: "Job Fair",
                    value: "Job Fair"
                },
                {
                    label: "Jobstreet",
                    value: "Jobstreet"
                },
                {
                    label: "Manila Bulletin",
                    value: "Manila Bulletin"
                },
                {
                    label: "PESO",
                    value: "PESO"
                },
                {
                    label: "Photoline",
                    value: "Photoline"
                },
                {
                    label: "Radio Ads",
                    value: "Radio Ads"
                },
                {
                    label: "Returnee",
                    value: "Returnee"
                },
                {
                    label: "Sun Star Cebu",
                    value: "Sun Star Cebu"
                },
                {
                    label: "Walk in",
                    value: "Walk in"
                },
                {
                    label: "Website",
                    value: "Website"
                },
                {
                    label: "Work Abroad",
                    value: "Work Abroad"
                },
                {
                    label: "Facebook Page",
                    value: "Facebook Page"
                },
                {
                    label: "Indeed",
                    value: "Indeed"
                },
                {
                    label: "Philjobnet",
                    value: "Philjobnet"
                },
            ]}
            required={required}
        />
    );
};

export default ReferralDropDown;