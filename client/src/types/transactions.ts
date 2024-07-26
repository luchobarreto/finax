import {Currency, TransactionType} from "./enums";

export interface TransactionData {
    id: number,
    amount: number,
    currency: Currency,
    transactionType: TransactionType,
    transactionDate: string,
    reason?: string,
    senderAccountNumber: number,
    receiverAccountNumber: number,
    senderName: string,
    senderId: number,
    senderProfilePictureUrl?: string,
    receiverName: string,
    receiverId: number,
}

export interface DepositData {
    accountNumber: number;
    amount: number;
    currency: Currency
}

export interface TransferRequest {
    fromAccountNumber: number,
    toAccountNumber: number,
    amount: number,
    currency: Currency,
    reason?: string
}

export interface TransactionHistoryRequest {
    page: number,
    size: number,
    currencies?: Array<Currency> | null,
    types?: Array<TransactionType> | null,
    startDate?: Date | null,
    endDate?: Date | null,
}