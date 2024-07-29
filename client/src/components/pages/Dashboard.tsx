import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import Container from "../layout/Container";
import SidebarMenu from "../layout/SidebarMenu";
import {currencyColors, currencyOptions, DefaultPageProps} from "../../types/app";
import Section from "../common/Section";
import Card from "../common/Card";
import {AccountData, Currency, DepositData, ResponseError, TransactionData} from "../../types";
import {deposit, getTransactionHistory, getUserAccounts} from "../../services/api/";
import {toast} from "react-toastify";
import Button from "../common/Button";
import Modal from "../layout/Modal";
import Input from "../common/Input";
import {Controller, useForm} from "react-hook-form";
import SelectInput from "../common/SelectInput";
import SelectOptionImage from "../common/SelectOptionImage";
import InputError from "../common/InputError";
import TransactionList from "../layout/TransactionList";
import ExchangeList from "../layout/ExchangeList";
import styled from "styled-components";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import moment from "moment";
import HorizontalSectionContainer from "../common/HorizontalSectionContainer";
import numeral from "numeral";
import {formatNumber} from "../../utils";
import {getExchangeRate, getHistoricExchangeRate} from "../../services/exchange";
import {MoonLoader} from "react-spinners";

interface GraphBarProps {
    background: string;
    height: string;
    isIncome: boolean;
}

interface CurrencyIconProps {
    color: string;
}

interface CurrencyValue {
    pastValue: number,
    currentValue: number,
    currency: Currency
}

interface CurrencyHeaderProps {
    textColor: string;
}

const MonthSelector = styled.div`
    display: flex;
    width: fit-content;
    margin-right: auto;
    & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 5.6rem;
        text-align: center;
    }
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
    
`

const IncomeGraph = styled.div`
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: 5px;
    margin-bottom: 0.25rem;
`

const ExpenseGraph = styled.div`
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 5px;
    margin-top: 0.25rem;
`

const GraphsCounters = styled.div`
    height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    padding-right: 1.5rem;
    justify-content: space-between;

    & > span {
        color: #a6adbd;
    }
`

const GraphBar = styled.div<GraphBarProps>`
    width: 100%;
    height: 100%;
    background: #27272D;
    border-radius: ${({ isIncome }) => isIncome ? '5px 5px 0 0' : '0 0 5px 5px'};
    display: flex;
    flex-direction: column;
    justify-content: ${({ isIncome }) => isIncome ? 'flex-end' : 'flex-start'};
    
    & > div {
        height: ${({ height }) => height};
        border-radius: ${({ isIncome }) => isIncome ? '5px 5px 0 0' : '0 0 5px 5px'};
        background: ${({ background }) => background};
    }
`

const Graphs = styled.div`
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    padding-right: 0.5rem;
`

const GraphsContainer = styled.div`
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`

const GraphIndicators = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    justify-content: space-around;
    padding-right: 0.5rem;
`

const GraphIndicator = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1rem;
    
    & > div {
        width: 15px;
        height: 10px;
        border-radius: 3px;
        margin-right: 1rem;
    }
    
    & > p {
        color: #7A808B;
        & > span {
            color: #fff;
            margin-left: 1rem;
        }
    }
`

const CurrenciesContainer = styled.div`
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
`

const CurrencyGraph = styled.div`
    width: calc(50% - 5px);
    background: #27272D;
    padding: 1rem;
    border-radius: 10px;
    height: fit-content;

    & > div:last-child {
        display: flex;
        flex-direction: column;
        margin-top: 1rem;
        font-size: 0.85rem;

        & > span {
            color: #b8c0cf;
            & > b {
                font-weight: 500;
                color: #b8c0cf;
            }
        }
    }
`

const LoadingContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const CurrencyIcon = styled.div<CurrencyIconProps>`
    height: 50px;
    width: 50px;
    background: ${({ color }) => color};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
`

const CurrencyGraphHeader = styled.div<CurrencyHeaderProps>`
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: right;
    & > div > span {
        font-size: 1rem;
    }
    & h2, span {
        color: ${({ textColor }) => textColor};
    }
`

const getMonthDays = (month: number): number => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), month + 1, 1);
    nextMonth.setDate(nextMonth.getDate() - 1);
    return nextMonth.getDate();
}

const Dashboard: React.FC<DefaultPageProps> = ({ user, isUserLoading}) => {

    const {
        control,
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm<DepositData>();

    const [accounts, setAccounts] = useState<Array<AccountData>>([]);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isDepositLoading, setIsDepositLoading] = useState(false);
    const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth());
    const [income, setIncome] = useState<number[]>([]);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [expenses, setExpenses] = useState<number[]>([]);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [maxIncome, setMaxIncome] = useState(0);
    const [maxExpense, setMaxExpense] = useState(0);
    const [currenciesValues, setCurrenciesValues] = useState<CurrencyValue[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const hasMounted = useRef(false);

    const onSubmit = async ({ amount, currency }: DepositData) => {
        setIsDepositLoading(true);
        const account: AccountData = accounts.find(a => a.currency === currency)!;
        try {
            await deposit({ amount, currency, accountNumber: account.accountNumber});
            await getAccountsData();
            await getMonthlyData(getMonthDays(activeMonth));
            toast.success("Successful deposit!");
        } catch (e) {
            if(e instanceof ResponseError) {
                toast.error(e.message);
            }
        }
        reset();
        setIsDepositModalOpen(false);
        setIsDepositLoading(false);
    }

    const getAccountsData = async () => {
        try {
            const accountsData = await getUserAccounts();
            setAccounts(accountsData);
        } catch (e) {
            if (e instanceof ResponseError) {
                toast.error(e.message);
            }
        }

    }

    const getMonthlyData = async (days: number) => {
        setIsLoading(true);
        try {
            const startDate = new Date(new Date().getFullYear(), activeMonth, 1);
            const endDate = new Date(new Date().getFullYear(), activeMonth, days);
            const res = await getTransactionHistory({
                page: 0,
                size: days,
                startDate,
                endDate
            });
            const data = res.content as TransactionData[];

            const tempIncome = Array.from({ length: days }, () => 0);
            const tempExpense = Array.from({ length: days }, () => 0);

            let tempTotalIncome = 0;
            let tempTotalExpense = 0;

            let tempMaxIncome = 0;
            let tempMaxExpense = 0;

            if(currenciesValues.length === 0) {
                await getCurrenciesValues();
            }
            const currencies = Object.values(Currency).reduce((acc, currency) => {
                acc[currency] = null;
                return acc;
            }, {} as Record<Currency, number | null>);

            for (const c of Object.keys(currencies)) {
                if(c === Currency.USD) {
                    currencies[c] = 1;
                } else {
                    currencies[c] = await getExchangeRate({
                        amount: 1,
                        currencyOne: Currency.USD,
                        currencyTwo: c as Currency
                    })
                }
            }

            data.forEach(transaction => {
                const day = new Date(transaction.transactionDate).getDate();
                const exchangeRate = currencies[transaction.currency]!;
                const amount = transaction.amount * exchangeRate;
                if (transaction.senderId === user?.id && transaction.transactionType === "TRANSFER") {
                    tempExpense[day - 1] += amount;
                    tempTotalExpense += amount;
                    if(amount > tempMaxExpense) tempMaxExpense = amount;
                } else {
                    tempIncome[day - 1] += amount;
                    tempTotalIncome += amount;
                    if(amount > tempMaxIncome) tempMaxIncome = amount;
                }
            });

            setTotalIncome(tempTotalIncome);
            setTotalExpense(tempTotalExpense);
            setIncome(tempIncome);
            setExpenses(tempExpense);
            setMaxIncome(tempMaxIncome);
            setMaxExpense(tempMaxExpense);
        } catch (err) {
            if (err instanceof ResponseError) {
                toast.error(err.message);
            }
        }
        setIsLoading(false);
    }

    const getCurrenciesValues = async () => {
        try {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            const tempCurrenciesValues = [];
            const currencies = Object.values(Currency);
            currencies.splice(currencies.indexOf(Currency.USD), 1);
            for(let i = 0; i < currencies.length; i++) {
                const c = currencies[i];
                const currencyValue: CurrencyValue = {
                    pastValue: 0,
                    currentValue: 0,
                    currency: c
                }
                currencyValue.pastValue = await getHistoricExchangeRate({
                    day: lastWeek.getDate(),
                    month: lastWeek.getMonth() + 1,
                    year: lastWeek.getFullYear(),
                    from: Currency.USD,
                    to: c
                })
                currencyValue.currentValue = await getHistoricExchangeRate({
                    day: today.getDate(),
                    month: today.getMonth() + 1,
                    year: today.getFullYear(),
                    from: Currency.USD,
                    to: c
                })
                tempCurrenciesValues.push(currencyValue)
            }
            setCurrenciesValues(tempCurrenciesValues)
        } catch (err) {
            if(err instanceof ResponseError) {
                toast.error(err.message);
            }
        }
    }

    useLayoutEffect(() => {
        if(hasMounted.current && user?.id) {
            getMonthlyData(getMonthDays(activeMonth));
        } else {
            hasMounted.current = true;
        }
    }, [activeMonth]);

    useEffect(() => {
        (async () => {
            if (user?.id) {
                await getAccountsData();
                await getCurrenciesValues();
                await getMonthlyData(getMonthDays(new Date().getMonth()));
            }
        })()
    }, [user]);


    return (
        <Container>
            <Modal title={"Deposit"} isOpen={isDepositModalOpen} closeOnClick={() => setIsDepositModalOpen(false)}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input label={"Amount:"} type={"number"} placeholder={"123456.78"} step={"any"} {...register("amount", { required: true })} />
                    {errors.amount && <InputError>Amount is required</InputError>}
                    <Controller
                        defaultValue={currencyOptions[0].value as Currency}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <SelectInput
                                label={"Currency:"}
                                options={currencyOptions}
                                components={{ Option: SelectOptionImage }}
                                onChange={(e) => onChange(e!.value)}
                                onBlur={onBlur}
                                value={currencyOptions.find(option => option.value === value)}
                            />
                        )}
                        name={"currency"}
                        control={control}
                    />
                    <Button isLoading={isDepositLoading} secondaryColor={true}>Deposit</Button>
                </form>
            </Modal>
            <SidebarMenu user={user} isUserLoading={isUserLoading} />
            <Section title={"My Balance"} width={420}>
                <Card accounts={accounts}/>
                <Button onClick={() => setIsDepositModalOpen(true)} secondaryColor={true}>Deposit</Button>
                <TransactionList overflowY={"hidden"} height={265} hasPagination={false} size={3} title={"Recent Transactions"} seeAllButton={true} user={user}/>
                <ExchangeList paddingBottom={0} overflowY={"hidden"} height={250} hasPagination={false} size={3} title={"Recent Exchanges"} user={user} seeAllButton={true}/>
            </Section>
            <HorizontalSectionContainer>
                <Section title={"Monthly Income & Expenses"} width={600} flex={1}>
                    {!isLoading ? (
                        <Graphs>
                            <GraphsCounters>
                                <span>${numeral(maxIncome).format("0.[0]a")}</span>
                                <span>${numeral(0).format("0.[0]a")}</span>
                                <span>${numeral(maxExpense).format("0.[0]a")}</span>
                            </GraphsCounters>
                            <GraphsContainer>
                                <IncomeGraph>
                                    {income.map((i: number) => {
                                        return (
                                            <GraphBar height={`${(i / maxIncome)*100}%`} isIncome={true} background={"#00D37E"}>
                                                <div></div>
                                            </GraphBar>
                                        )
                                    })}
                                </IncomeGraph>
                                <ExpenseGraph>
                                    {expenses.map((i: number) => {
                                        return (
                                            <GraphBar height={`${(i / maxExpense)*100}%`} isIncome={false} background={"#474C57"}>
                                                <div></div>
                                            </GraphBar>
                                        )
                                    })}
                                </ExpenseGraph>
                            </GraphsContainer>
                        </Graphs>
                    ) : <LoadingContainer><MoonLoader size={40} color={"#fff"}/></LoadingContainer>}
                    <GraphIndicators>
                        <MonthSelector>
                            <button onClick={() => {
                                if(activeMonth > 0 && !isLoading) setActiveMonth(activeMonth - 1);
                            }}>
                                <IoIosArrowBack/>
                            </button>
                            <div>{isLoading ? <MoonLoader size={15} color={"#fff"}/> : moment(new Date().setMonth(activeMonth)).format("MMMM")}</div>
                            <button onClick={() => {
                                if(activeMonth < 11 && !isLoading) setActiveMonth(activeMonth + 1);
                            }}>
                                <IoIosArrowForward/>
                            </button>
                        </MonthSelector>
                        <GraphIndicator style={{
                            paddingRight: "1rem",
                            borderRight: "1px solid #7A808B"
                        }}>
                            <div style={{ background: "#00D37C"}}></div> <p>Income<span>{totalIncome ? `$${numeral(totalIncome).format("0.0[0]a")}` : "-"}</span></p>
                        </GraphIndicator>
                        <GraphIndicator>
                            <div style={{ background: "#474B58"}}></div> <p>Expense<span>{totalExpense ? `$${numeral(totalExpense).format("0.0[0]a")}` : "-"}</span></p>
                        </GraphIndicator>
                    </GraphIndicators>
                </Section>
                <Section title={"Currencies"} flex={1} width={600} height={"fit-content"}>
                    {currenciesValues.length > 0 && (
                        <CurrenciesContainer>
                            {
                                currenciesValues.map(currencyValue => {
                                    const diff = currencyValue.currentValue - currencyValue.pastValue;
                                    const percentage = ((diff) / currencyValue.pastValue) * 100;
                                    return (
                                        <CurrencyGraph>
                                            <CurrencyGraphHeader textColor={diff > 0 ? "#7AFFC9" : diff === 0 ? "#fff" : "#FFA7A1"}>
                                                <CurrencyIcon color={currencyColors[currencyValue.currency]}>
                                                    {formatNumber(0, currencyValue.currency).split("0")[0]}
                                                </CurrencyIcon>
                                                <div>
                                                    <h2>{diff > 0 && "+"}{percentage.toFixed(2)}%</h2>
                                                    <span>{diff > 0 && "+"}{(diff).toFixed(2)}</span>
                                                </div>
                                            </CurrencyGraphHeader>
                                            <div>
                                                <span>Last Week Price <b>({currencyValue.currency}/{Currency.USD})</b>: {currencyValue.pastValue.toFixed(2)}</span>
                                                <span>Current Price <b>({currencyValue.currency}/{Currency.USD})</b>: {currencyValue.currentValue.toFixed(2)}</span>
                                            </div>
                                        </CurrencyGraph>
                                    )
                                })
                            }
                        </CurrenciesContainer>
                    )}
                </Section>
            </HorizontalSectionContainer>
        </Container>
    );
}

export default Dashboard;
