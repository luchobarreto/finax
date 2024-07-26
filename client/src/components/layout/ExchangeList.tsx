import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {DefaultListProps} from "../../types/app";
import styled from "styled-components";
import {ExchangeData, Page, ResponseError, TransactionData} from "../../types";
import {exchangeHistory} from "../../services/api";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import Exchange from "../common/Exchange";
import {MoonLoader} from "react-spinners";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

const ExchangeListContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1.5rem 0 1rem 0;
`;

const ExchangeListHeader = styled.div`
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

const ExchangeBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    height: 100%;
    align-items: center;
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

const SpinnerContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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

const ExchangeList: React.FC<DefaultListProps> = ({ accounts, height, paddingTop, paddingBottom, overflowY, size, hasPagination, seeAllButton, user, title }) => {

    const [data, setData] = useState<Page<ExchangeData>>();
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isAccountFirstUpdate = useRef(true);

    const getHistory = async () => {
        setIsLoading(true)
        try {
            const res = await exchangeHistory({ page, size });
            setData(res as Page<ExchangeData>);
        } catch (e) {
            if (e instanceof ResponseError) {
                toast.error(e.message);
            }
        }
        setIsLoading(false)
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
        } else {
            isAccountFirstUpdate.current = false;
        }
    }, [accounts]);

    useEffect(() => {
        getHistory();
    }, []);

    return (
        <ExchangeListContainer style={{ height, paddingTop, paddingBottom }}>
            <ExchangeListHeader>
                <h5>{title}</h5>
                {seeAllButton && (
                    <Link to={"/exchange"}>See All</Link>
                )}
            </ExchangeListHeader>
            <ExchangeBody style={{ overflowY: overflowY || "auto" }}>
                {!isLoading ? (
                    user && data && (
                        data.content.length === 0 ?
                                    <NoItemsMessage>
                                        You don't have any transactions yet
                                    </NoItemsMessage>
                                :
                                    data.content.map((item, i) => (
                                        <Exchange data={item} user={user}/>
                                    ))
                        )
                    ) : <SpinnerContainer><MoonLoader size={30} color={"#fff"}/></SpinnerContainer>
                }
            </ExchangeBody>
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
        </ExchangeListContainer>
    )
}

export default ExchangeList;