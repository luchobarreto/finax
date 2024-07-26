import {ExchangeData, ExchangeRequest, Page, PageRequest} from "../../types";
import axios from "axios";
import {API_URL} from "../../config";
import {handleAxiosError} from "../../utils";

export const exchangeHistory = async ({ page, size }: PageRequest): Promise<Page<ExchangeData>> => {
    try {
        const exchanges = await axios({
            method: "GET",
            url: API_URL + "/exchange/history?page=" + page + "&size=" + size,
            withCredentials: true
        });
        return exchanges.data as Page<ExchangeData>;
    } catch (error) {
        return handleAxiosError(error);
    }
}

export const exchangeCurrencies = async ({ fromAccountNumber, toAccountNumber, fromCurrency, toCurrency, amount }: ExchangeRequest): Promise<ExchangeData> => {
    try {
        const res = await axios({
            url: API_URL + "/exchange",
            method: "POST",
            data: {
                fromAccountNumber,
                toAccountNumber,
                fromCurrency,
                toCurrency,
                amount
            },
            withCredentials: true
        });
        return res.data as ExchangeData;
    } catch (error) {
        return handleAxiosError(error);
    }
}