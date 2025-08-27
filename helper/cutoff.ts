import moment from 'moment';

export function getCurrentCutoff(): { start_time: string; end_time: string; range: string; } {
    const now = moment();
    const dayOfMonth = now.date();
    let startTime: moment.Moment;
    let endTime: moment.Moment;

    if (dayOfMonth >= 1 && dayOfMonth <= 15) {
        startTime = now.clone().subtract(1, 'month').startOf('month').add(25, 'days').startOf('day');
        endTime = now.clone().startOf('month').add(9, 'days').endOf('day');
    } else {
        startTime = now.clone().startOf('month').add(10, 'days').startOf('day');
        endTime = now.clone().startOf('month').add(24, 'days').endOf('day');
    }

    const range = `${startTime.format('MM-DD')}-${endTime.format('MM-DD')}`;

    return {
        start_time: startTime.format('MM-DD'),
        end_time: endTime.format('MM-DD'),
        range: range
    };
}