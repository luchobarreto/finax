import {Currency} from "./enums";

export interface ExchangeData {
    id: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    amount: number,
    totalAmount: number,
    exchangeRate: number,
    fee: number,
    exchangeTime: string,
    fromAccountNumber: number,
    toAccountNumber: number,
}

export interface ExchangeRequest {
    fromAccountNumber: number,
    toAccountNumber: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    amount: number
}