import moment from "moment";

export const getTenure = (dateHired: string, separationDate?:string) => {
    let date:any = "";
    
    if (
        separationDate !== null &&
        separationDate !== "" &&
        separationDate !== "1900-01-01"
    ) {
        date = moment(separationDate);
    } else {
        date = moment();
    }

    const hired = moment(dateHired);
  
    const years = date.diff(hired, 'years');
    hired.add(years, 'years');
  
    const months = date.diff(hired, 'months');
    hired.add(months, 'months');
  
    const days = date.diff(hired, 'days');
  
    return `${years} ${Number(years) > 1 ? "years" : "year"}, ${months} ${Number(months) > 1 ? "months" : "month"}, ${days} ${Number(days) > 1 ? "days" : "day"}`;
};