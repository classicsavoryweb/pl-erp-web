import SearchableDropDown from "@/components/common/SearchableDropDown";

interface DropDownInterface {
    value: string;
    onChange: (e: any) => void;
    required?: boolean;
    error?: string;
    disabled?: boolean;
};
const CutOffDropDown = ({
    value,
    onChange,
    required = false,
    error,
    disabled = false
}: DropDownInterface) => {
    return (
        <SearchableDropDown
            placeholder="select cutoff"
            label="Cut Off"
            name="cutoff"
            value={String(value)}
            onChange={onChange}
            required={required}
            error={error}
            disabled={disabled}
            options={[
                { label: "Dec. 26 - Jan. 10", value: "12-26-01-10", obj: { start_time: "12-26", end_time: "01-10" } },
                { label: "Jan. 11 - Jan. 25", value: "01-11-01-25", obj: { start_time: "01-11", end_time: "01-25" } },
                { label: "Jan. 26 - Feb. 10", value: "01-26-02-10", obj: { start_time: "01-26", end_time: "02-10" } },
                { label: "Feb. 11 - Feb. 25", value: "02-11-02-25", obj: { start_time: "02-11", end_time: "02-25" } },
                { label: "Feb. 26 - Mar. 10", value: "02-26-03-10", obj: { start_time: "02-26", end_time: "03-10" } },
                { label: "Mar. 11 - Mar. 25", value: "03-11-03-25", obj: { start_time: "03-11", end_time: "03-25" } },
                { label: "Mar. 26 - Apr. 10", value: "03-26-04-10", obj: { start_time: "03-26", end_time: "04-10" } },
                { label: "Apr. 11 - Apr. 25", value: "04-11-04-25", obj: { start_time: "04-11", end_time: "04-25" } },
                { label: "Apr. 26 - May 10", value: "04-26-05-10", obj: { start_time: "04-26", end_time: "05-10" } },
                { label: "May 11 - May 25", value: "05-11-05-25", obj: { start_time: "05-11", end_time: "05-25" } },
                { label: "May 26 - Jun. 10", value: "05-26-06-10", obj: { start_time: "05-26", end_time: "06-10" } },
                { label: "Jun. 11 - Jun. 25", value: "06-11-06-25", obj: { start_time: "06-11", end_time: "06-25" } },
                { label: "Jun. 26 - Jul. 10", value: "06-26-07-10", obj: { start_time: "06-26", end_time: "07-10" } },
                { label: "Jul. 11 - Jul. 25", value: "07-11-07-25", obj: { start_time: "07-11", end_time: "07-25" } },
                { label: "Jul. 26 - Aug. 10", value: "07-26-08-10", obj: { start_time: "07-26", end_time: "08-10" } },
                { label: "Aug. 11 - Aug. 25", value: "08-11-08-25", obj: { start_time: "08-11", end_time: "08-25" } },
                { label: "Aug. 26 - Sep. 10", value: "08-26-09-10", obj: { start_time: "08-26", end_time: "09-10" } },
                { label: "Sep. 11 - Sep. 25", value: "09-11-09-25", obj: { start_time: "09-11", end_time: "09-25" } },
                { label: "Sep. 26 - Oct. 10", value: "09-26-10-10", obj: { start_time: "09-26", end_time: "10-10" } },
                { label: "Oct. 11 - Oct. 25", value: "10-11-10-25", obj: { start_time: "10-11", end_time: "10-25" } },
                { label: "Oct. 26 - Nov. 10", value: "10-26-11-10", obj: { start_time: "10-26", end_time: "11-10" } },
                { label: "Nov. 11 - Nov. 25", value: "11-11-11-25", obj: { start_time: "11-11", end_time: "11-25" } },
                { label: "Nov. 26 - Dec. 10", value: "11-26-12-10", obj: { start_time: "11-26", end_time: "12-10" } },
                { label: "Dec. 11 - Dec. 25", value: "12-11-12-25", obj: { start_time: "12-11", end_time: "12-25" } },
                { label: "Dec. 26 - Jan. 10", value: "12-26-01-10", obj: { start_time: "12-26", end_time: "01-10" } }, // wrap again
            ]}
        />
    );
};

export default CutOffDropDown;