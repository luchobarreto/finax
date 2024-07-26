import {DepositData, Page, PageRequest, TransactionData, TransactionHistoryRequest, TransferRequest} from "../../types";
import {handleAxiosError} from "../../utils";
import axios from "axios";
import {API_URL} from "../../config";
import moment from "moment";

export const deposit = async ({ amount, currency, accountNumber }: DepositData): Promise<TransactionData> => {
    try {
        const depositTransaction = await axios({
            method: "POST",
            url: API_URL + "/transaction/deposit/" + accountNumber,
            data: { amount, currency },
            withCredentials: true
        });
        return depositTransaction.data as TransactionData;
    } catch (error) {
        return handleAxiosError(error);
    }
}

export const getTransactionHistory = async ({ page, size, currencies, types, startDate, endDate }: TransactionHistoryRequest): Promise<Page<TransactionData>> => {
    try {
        const transactionHistory = await axios({
            method: "GET",
            url: API_URL + "/transaction/history",
            params: {
                page,
                size,
                currencies: currencies ? `${currencies}` : null,
                transactionTypes: types ? `${types}` : null,
                startDate: startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm:ss') : null,
                endDate: endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm:ss') : null,
            },
            withCredentials: true
        });
        return transactionHistory.data as Page<TransactionData>;
    } catch (error) {
        return handleAxiosError(error);
    }
}

export const transfer = async ({ amount, currency, toAccountNumber, reason, fromAccountNumber }: TransferRequest): Promise<TransactionData> => {
    try {
        const transferTransaction = await axios({
            method: "POST",
            url: API_URL + "/transaction/transfer",
            data: {
                amount, currency, toAccountNumber, reason, fromAccountNumber
            },
            withCredentials: true
        });

        return transferTransaction.data as TransactionData;
    } catch (error) {
        return handleAxiosError(error);
    }
}