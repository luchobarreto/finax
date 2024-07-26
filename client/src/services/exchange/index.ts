import {Currency} from "../../types";
import {handleAxiosError} from "../../utils";
import axios from "axios";
import {EXCHANGE_API_URL} from "../../config";

interface ExchangeRateRequest {
    amount: number, currencyOne: Currency, currencyTwo: Currency
}

interface HistoricExchangeRateRequest {
    day: number,
    month: number,
    year: number,
    from: Currency,
    to: Currency,
}

export const getExchangeRate = async ({ amount, currencyOne, currencyTwo }: ExchangeRateRequest): Promise<number> => {
    try {
        const res = await axios({
            method: "GET",
            url: EXCHANGE_API_URL + "/latest",
            params: {
                amount,
                from: currencyOne,
                to: currencyTwo,
            }
        });
        return res.data.rates[currencyTwo];
    } catch (error) {
        return handleAxiosError(error);
    }
}

export const getHistoricExchangeRate = async ({ day, month, year, from, to }: HistoricExchangeRateRequest): Promise<number> => {
    try {
        const res = await axios({
            method: "GET",
            url: `${EXCHANGE_API_URL}/${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`,
            params: {
                from,
                to
            }
        });
        return res.data.rates[to] as number;
    } catch (error) {
        return handleAxiosError(error);
    }
}