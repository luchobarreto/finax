import React, {Fragment, useEffect, useState} from "react";
import styled from "styled-components";
import {AccountData, Currency} from "../../types";
import {formatNumber} from "../../utils";
import {MoonLoader} from "react-spinners";

import { MdInbox } from "react-icons/md";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { IoInformationCircleOutline } from "react-icons/io5";

import {currencyColors} from "../../types/app";
import Modal from "../layout/Modal";
import Input from "./Input";
import {Tooltip} from "react-tooltip";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FaRegCopy } from "react-icons/fa";
import Button from "./Button";
import {toast} from "react-toastify";

interface Props {
    accounts: Array<AccountData>
};

interface StyleCurrencyProps {
    currencyCode: Currency
}

const CardContainer = styled.div<StyleCurrencyProps>`
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    background: linear-gradient(130deg, #25272D 0%, ${({ currencyCode }) => currencyColors[currencyCode]} 100%);
    height: 200px;
    padding: 1.7rem;

    &:hover {
        transform: scale(1.01);
        box-shadow: 0 0 20px 1px rgba(255, 255, 255, 0.08);
    }
`

const CardHeader = styled.div<StyleCurrencyProps>`
    width: 100%;
    display: flex;
    flex-direction: row;
    
    & > div:first-child {
        width: 40px;
        height: 40px;
        background: ${({ currencyCode }) => currencyColors[currencyCode]};
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
    }
`

const CurrencySelector = styled.div`
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    user-select: none; 
    -webkit-user-select: none;
    -moz-user-select: none; 
    -ms-user-select: none; 
    
    & > svg {
        font-size: 1.4rem;
        cursor: pointer;

        & > path {
            color: rgba(255, 255, 255, 0.73);
        }
    }
`

const CardFooter = styled.div`
    display: flex;
    flex-direction: row;
    margin: auto 0 0 0;
    
    & > div {
        & > span {
            color: rgba(255, 255, 255, 0.76);
            font-size: 0.9rem;
            margin-bottom: 0.2rem;
        }

        & > h4 {
            font-size: 2rem;
            font-weight: 500;
        }
    }
    
    & > svg {
        margin: auto 0 0 auto;
        font-size: 2rem;
        cursor: pointer;
    }
`

const LoaderContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Card: React.FC<Props> = ({ accounts }) => {

    const [activeAccount, setActiveAccount] = useState<AccountData | undefined>(undefined);
    const [currency, setCurrency] = useState<Currency>(Currency.USD);
    const findAccount = (currencyToFind: Currency): AccountData | undefined => accounts.find((a) => a.currency === currencyToFind.toString());
    const [showModal ,setShowModal] = useState<boolean>(false);
    const previousCurrency = (): void => {
        const currencyList = Object.values(Currency);
        const currentCurrencyIndex = currencyList.indexOf(currency);
        if(currentCurrencyIndex === 0) {
            setCurrency(currencyList[currencyList.length - 1]);
        } else {
            setCurrency(currencyList[currentCurrencyIndex - 1]);
        }
    }

    const nextCurrency = (): void => {
        const currencyList = Object.values(Currency);
        const currentCurrencyIndex = currencyList.indexOf(currency);
        if(currentCurrencyIndex === currencyList.length - 1) {
            setCurrency(currencyList[0]);
        } else {
            setCurrency(currencyList[currentCurrencyIndex + 1]);
        }
    }

    useEffect(() => {
        setActiveAccount(findAccount(currency));
    }, [currency, accounts]);

    return (
        <Fragment>
            {activeAccount && (
                <Modal title={"Account Data"} isOpen={showModal} closeOnClick={() => setShowModal(false)}>
                    <Input label={"Account Number:"} value={activeAccount.accountNumber} disabled={true}/>
                    <CopyToClipboard text={`${activeAccount.accountNumber}`} onCopy={() => toast.success("Account Number copied to clipboard")}>
                        <Button>
                            <FaRegCopy/> Copy to Clipboard
                        </Button>
                    </CopyToClipboard>
                </Modal>
            )}
            <CardContainer currencyCode={currency}>
                {activeAccount ? (
                    <Fragment>
                        <CardHeader currencyCode={currency}>
                            <div>
                                <MdInbox/>
                            </div>
                            <CurrencySelector>
                                <RiArrowLeftSLine onClick={previousCurrency}/>
                                {currency}
                                <RiArrowRightSLine onClick={nextCurrency}/>
                            </CurrencySelector>
                        </CardHeader>
                        <CardFooter>
                            <div>
                                <span>Balance</span>
                                <h4>{formatNumber(activeAccount.balance, currency)}</h4>
                            </div>
                            <Tooltip id={"account-number-tooltip"}>
                                Account Data
                            </Tooltip>
                            <IoInformationCircleOutline onClick={() => setShowModal(true)} data-tooltip-id={"account-number-tooltip"}/>
                        </CardFooter>
                    </Fragment>
                ) : <LoaderContainer><MoonLoader color={"#fff"} size={30}/></LoaderContainer> }
            </CardContainer>
        </Fragment>
    )
};

export default Card;