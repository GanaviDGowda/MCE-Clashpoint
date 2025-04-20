import { format } from 'date-fns';

/**
 * Format the date as per the required format
 * Example: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
 */
export const formatDate = (date, formatString = 'yyyy-MM-dd') => {
  return format(date, formatString);
};
