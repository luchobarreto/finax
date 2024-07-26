import React, {Fragment, useEffect, useState} from 'react';
import SelectInput from "../common/SelectInput";
import {currencyMultiOptions, OptionType} from "../../types/app";
import SelectOptionImage from "../common/SelectOptionImage";
import DatePickerInput from "../common/DatePickerInput";
import TransactionList from "./TransactionList";
import styled from "styled-components";
import {AccountData, Currency, TransactionType, UserData} from "../../types";

interface Props {
    user: UserData,
    accounts: AccountData[]
}

const transactionOptions: Array<OptionType> = [
    {
        label: "All",
        value: [TransactionType.DEPOSIT, TransactionType.TRANSFER]
    },
    {
        label: "Transfer",
        value: [TransactionType.TRANSFER],
    },
    {
        label: "Deposit",
        value: [TransactionType.DEPOSIT]
    }
];

const HistoryButtons = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    & > div {
        width: 140px;
        margin-top: auto;
    }
`

const TransactionHistory: React.FC<Props> = ({ user, accounts }) => {

    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [types, setTypes] = useState<TransactionType[]>([]);

    return (
        <Fragment>
            <HistoryButtons>
                <SelectInput
                    label={"Currency:"}
                    placeholder={"Select"}
                    isClearable={true}
                    options={currencyMultiOptions}
                    components={{ Option: SelectOptionImage }}
                    onChange={(e) => {
                        setCurrencies(e?.value);
                    }}
                />
                <SelectInput
                    label={"Type:"}
                    isClearable={true}
                    placeholder={"Select"}
                    options={transactionOptions}
                    onChange={(e) => {
                        setTypes(e?.value);
                    }}
                />
                <DatePickerInput
                    label={"Start Date:"}
                    onChange={(e) => {
                        console.log(e)
                        if(e !== null) {
                            setStartDate(new Date(e!.toString()));
                        } else {
                            setStartDate(null);
                        }
                    }}
                    value={startDate}
                />
                <DatePickerInput
                    label={"End Date:"}
                    onChange={(e) => {
                        if(e !== null) {
                            setEndDate(new Date(e!.toString()));
                        } else {
                            setEndDate(null);
                        }
                    }}
                    value={endDate}
                />
            </HistoryButtons>
            <TransactionList
                paddingTop={0}
                paddingBottom={0}
                height={"100%"}
                hasPagination={true}
                size={10}
                user={user}
                currencies={currencies}
                types={types}
                startDate={startDate}
                endDate={endDate}
                accounts={accounts}
            />
        </Fragment>
    )
}

export default TransactionHistory;