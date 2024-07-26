import {Currency} from "../types";

export const formatNumber = (num: number, currencyCode: Currency): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
    }).format(num);
}