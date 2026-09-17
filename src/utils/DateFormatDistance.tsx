import { differenceInDays, format } from 'date-fns';

export const DateFormatDistance = (date: Date | string) =>{
    if(!date) return null

    const targetDate = new Date(date)
    const days = differenceInDays(new Date(),targetDate)

    if(days <= 2){
        if(days === 0) return 'Today';
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return format(targetDate, 'MMM d');
}