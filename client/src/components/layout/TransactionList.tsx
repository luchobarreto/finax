import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Currency, Page, ResponseError, TransactionData, TransactionType, UserData} from "../../types";
import {Link} from "react-router-dom";
import {getTransactionHistory} from "../../services/api";
import Transaction from "../common/Transaction";
import {DefaultListProps} from "../../types/app";
import {toast} from "react-toastify";
import {MoonLoader} from "react-spinners";
import { IoIosArrowBack, IoIosArrowForward  } from "react-icons/io";

interface Props extends DefaultListProps {
    currencies?: Currency[],
    types?: TransactionType[],
    startDate?: Date | null | undefined,
    endDate?: Date | null | undefined
}

const TransactionListContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1.5rem 0 1rem 0;
`;

const TransactionListHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0.7rem;
    
    & > h5 {
        font-size: 1rem;
        font-weight: 500;
    }
    
    & > a {
        color: #787D89;
    }
`;

const TransactionBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    height: 100%;
    overflow-y: auto;
    
    @media (max-height: 950px) {
        height: calc(100% - 21px  - 69px - 23px - 1.4rem);
    }
`

const NoItemsMessage = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #787D89;
    font-size: 0.9rem;
`

const PaginationContainer = styled.div`
    display: flex;
    width: 100%;
    & > button {
        border: none;
        outline: none;
        height: 100%;
        background: transparent;
        color: #fff;
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    & > button:first-child {
        margin-left: auto;
        margin-right: 0.5rem;
    }
    & > button:last-child {
        margin-right: auto;
        margin-left: 0.5rem;
    }
`;

const SpinnerContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const TransactionList: React.FC<Props> = ({ accounts, currencies, types, endDate, startDate, height, paddingTop, paddingBottom, overflowY, hasPagination, size, title, seeAllButton, user }) => {

    const [data, setData] = useState<Page<TransactionData>>();
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isAccountFirstUpdate = useRef(true);

    const getHistory = async () => {
        setIsLoading(true);
        try {
            const res = await getTransactionHistory({ page, size, currencies, types, endDate, startDate });
            setData(res as Page<TransactionData>);
        } catch (e) {
            if (e instanceof ResponseError) {
                toast.error(e.message);
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if(data) {
            setIsLastPage(data.last)
        }
    }, [data]);

    useEffect(() => {
        if(!isLoading) {
            getHistory();
        }
    }, [page]);

    useLayoutEffect(() => {
        if(!isAccountFirstUpdate.current && !isLoading) {
            getHistory();
            setPage(0);
        } else {
            isAccountFirstUpdate.current = false;
        }
    }, [currencies, types, endDate, startDate, accounts]);

    return (
        <TransactionListContainer style={{ height, paddingTop, paddingBottom }}>
            <TransactionListHeader>
                {title && <h5>{title}</h5>}
                {seeAllButton && (
                    <Link to={"/transactions"}>See All</Link>
                )}
            </TransactionListHeader>
            <TransactionBody style={{ overflowY: overflowY || "auto" }}>
                {!isLoading ? (
                        user && data && (
                            data.content.length === 0 ?
                                    <NoItemsMessage>
                                        You don't have any transactions yet
                                    </NoItemsMessage>
                                :
                                    data.content.map((item, i) => (
                                        <Transaction data={item} user={user}/>
                                    ))
                        )
                    ) : <SpinnerContainer><MoonLoader size={30} color={"#fff"}/></SpinnerContainer>
                }
            </TransactionBody>
            {hasPagination && (
                <PaginationContainer>
                    <button onClick={() => {
                        if(!isLoading && page > 0) {
                            setPage(page - 1);
                        }
                    }}>
                        <IoIosArrowBack/>
                    </button>
                    <span>{isLoading ? <MoonLoader size={15} color={"#fff"}/> : page + 1}</span>
                    <button onClick={() => {
                        if(!isLoading && !isLastPage) {
                            setPage(page + 1);
                        }
                    }}>
                        <IoIosArrowForward/>
                    </button>
                </PaginationContainer>
            )}
        </TransactionListContainer>
    );
}

export default TransactionList;