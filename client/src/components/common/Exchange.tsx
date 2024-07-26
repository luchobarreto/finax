import React from "react";
import {ExchangeData, UserData} from "../../types";
import styled from "styled-components";
import {currencyColors} from "../../types/app";
import {MdCurrencyExchange} from "react-icons/md";
import moment from "moment";
import {formatNumber} from "../../utils";

interface Props {
    data: ExchangeData,
    user: UserData
}

interface ExchangeImageProps {
    fromCurrency: string,
    toCurrency: string,
}

const ExchangeContainer= styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 0.7rem;
    align-items: center;
    border-bottom: solid 1px #363942;
    padding-bottom: 0.8rem;
    height: 59px;
    width: 100%;
`;

const ExchangeImage = styled.div<ExchangeImageProps>`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background: linear-gradient(149.826deg, ${({ fromCurrency, toCurrency }) => `${fromCurrency} 0%, ${toCurrency} 100%`});
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
`

const ExchangeInfo = styled.div` 
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: start;
    justify-content: center;

    & > p {
        font-size: 0.9rem;
    }

    & > span {
        font-size: 0.8rem;
        text-transform: capitalize;
        font-weight: 500;
        color: #7A808B;
    }
`;

const ExchangeAmount = styled.div` 
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-left: auto;
    align-items: end;
    justify-content: center;

    & > p {
        font-size: 0.9rem;
    }

    & > span {
        font-size: 0.8rem;
        text-transform: capitalize;
        font-weight: 500;
        color: #7A808B;
    }
`

const Exchange: React.FC<Props> = ({ data, user }) => {
    return (
        <ExchangeContainer>
            <ExchangeImage fromCurrency={currencyColors[data.fromCurrency]} toCurrency={currencyColors[data.toCurrency]}>
                <MdCurrencyExchange/>
            </ExchangeImage>
            <ExchangeInfo>
                <p>{data.fromCurrency} to {data.toCurrency}</p>
                <span>{moment(data.exchangeTime).fromNow()}</span>
            </ExchangeInfo>
            <ExchangeAmount>
                <p>+{formatNumber(data.totalAmount, data.toCurrency)}</p>
                <span>-{formatNumber(data.amount, data.fromCurrency)}</span>
            </ExchangeAmount>
        </ExchangeContainer>
    )
}

export default Exchange;