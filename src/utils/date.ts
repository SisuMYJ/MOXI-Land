import { format } from 'date-fns';
export const todayKey = () => format(new Date(), 'yyyy-MM-dd');
export const daySeed = () => Number(format(new Date(), 'yyyyMMdd'));
