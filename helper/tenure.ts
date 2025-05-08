import moment from "moment";

export const getTenure = (dateHired: string) => {
    const now = moment();
    const hired = moment(dateHired);
  
    const years = now.diff(hired, 'years');
    hired.add(years, 'years');
  
    const months = now.diff(hired, 'months');
    hired.add(months, 'months');
  
    const days = now.diff(hired, 'days');
  
    return `${years} years, ${months} months, ${days} days`;
};