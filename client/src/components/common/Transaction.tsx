import React from "react";
import styled from "styled-components";
import {TransactionData, UserData} from "../../types";
import moment from "moment";
import DefaultProfilePicture from "../../assets/images/default_profile.png";
import {formatNumber} from "../../utils";

interface Props {
    data: TransactionData,
    user: UserData
}

const TransactionContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 0.7rem;
    align-items: center;
    border-bottom: solid 1px #363942;
    padding-bottom: 0.8rem;
    height: 59px;
    width: 100%;
    & > img {
        width: 45px;
        height: 45px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 0.5rem;
    }
`;

const TransactionSender = styled.div`
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

const TransactionInfo = styled.div`
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

const Transaction: React.FC<Props> = ({ data, user }) => {
    return (
        <TransactionContainer>
            <img src={data.senderProfilePictureUrl || DefaultProfilePicture} />
            <TransactionSender>
                <p>{data.senderName}</p>
                <span>{data.reason || data.transactionType.toLowerCase()}</span>
            </TransactionSender>
            <TransactionInfo>
                <p>{data.transactionType === "DEPOSIT" ? "+" : data.senderId === user.id ? "-" : "+"}{formatNumber(data.amount, data.currency)}</p>
                <span>{moment(data.transactionDate).fromNow()}</span>
            </TransactionInfo>
        </TransactionContainer>
    );
};

export default Transaction;