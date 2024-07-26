import React, {useCallback, useEffect, useState} from "react";
import Container from "../layout/Container";
import SidebarMenu from "../layout/SidebarMenu";
import {DefaultPageProps, OptionType} from "../../types/app";
import Section from "../common/Section";
import Card from "../common/Card";
import {AccountData, Currency, ResponseError} from "../../types";
import {exchangeCurrencies, getUserAccounts} from "../../services/api";
import {toast} from "react-toastify";
import styled from "styled-components";
import SelectInput from "../common/SelectInput";
import SelectOptionImage from "../common/SelectOptionImage";
import {HiOutlineSwitchVertical} from "react-icons/hi";
import {debounce} from "../../utils";
import {getExchangeRate} from "../../services/exchange";
import Button from "../common/Button";
import {SingleValue} from "react-select";
import ExchangeList from "../layout/ExchangeList";

const ExchangeForm = styled.form`
    width: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    margin-top: 1rem;
`

const ExchangeCurrency = styled.div`
    width: 100%;
    background: #363942;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 1rem 0;
    border-radius: 15px;
    padding: 0.7rem 1.5rem 0.7rem 0.5rem;
    
    & > div:first-child {
        margin-top: 0;
        width: 50%;
    }

    &:last-child {
        margin-bottom: 0;
    }
`

const ExchangeInput = styled.input`
    background: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    width: 40%;
    text-align: right;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`

const SwitchButton = styled.button`
    position: absolute;
    top: 50%;
    left: 50%;
    background: #00D37E;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 0;
    transform: translate(-50%, -50%);
    z-index: 1;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const updateIsDisabled = (array: OptionType[], searchValue: Currency): OptionType[] => {
    return array.map(item => ({
        ...item,
        isDisabled: item.value === searchValue
    }));
};

const Exchange: React.FC<DefaultPageProps> = ({ user, isUserLoading }) => {

    const [accounts, setAccounts] = useState<Array<AccountData>>([]);
    const [topCurrency, setTopCurrency] = useState<Currency>(Currency.USD);
    const [downCurrency, setDownCurrency] = useState<Currency>(Currency.EUR);
    const [topCurrencyAmount, setTopCurrencyAmount] = useState<number>(1);
    const [downCurrencyAmount, setDownCurrencyAmount] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(false);

    const [topCurrencyOptions, setTopCurrencyOptions] = useState<OptionType[]>([
        {label: "USD", value: Currency.USD, isDisabled: false},
        {label: "EUR", value: Currency.EUR, isDisabled: true},
        {label: "CAD", value: Currency.CAD, isDisabled: false},
        {label: "AUD", value: Currency.AUD, isDisabled: false},
        {label: "JPY", value: Currency.JPY, isDisabled: false},
    ]);

    const [downCurrencyOptions, setDownCurrencyOptions] = useState<OptionType[]>([
        {label: "USD", value: Currency.USD, isDisabled: true},
        {label: "EUR", value: Currency.EUR, isDisabled: false},
        {label: "CAD", value: Currency.CAD, isDisabled: false},
        {label: "AUD", value: Currency.AUD, isDisabled: false},
        {label: "JPY", value: Currency.JPY, isDisabled: false},
    ]);

    const handleSwitchClick = () => {
        const newTopCurrencyOptions = downCurrencyOptions;
        const newDownCurrencyOptions = topCurrencyOptions;

        const newTopCurrency = downCurrency;
        const newDownCurrency = topCurrency;

        const newTopAmount = downCurrencyAmount;
        const newDownAmount = topCurrencyAmount;

        setTopCurrencyOptions(newTopCurrencyOptions);
        setDownCurrencyOptions(newDownCurrencyOptions);
        setTopCurrency(newTopCurrency);
        setDownCurrency(newDownCurrency);
        setTopCurrencyAmount(newTopAmount);
        setDownCurrencyAmount(newDownAmount);
    };

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

    const exchange = async () => {
        setIsLoading(true);
        try {
            await exchangeCurrencies({
                fromAccountNumber: accounts.find(a => a.currency === topCurrency)!.accountNumber,
                toAccountNumber: accounts.find(a => a.currency === downCurrency)!.accountNumber,
                fromCurrency: topCurrency,
                toCurrency: downCurrency,
                amount: topCurrencyAmount
            });
            toast.success("Exchange successful!");
        } catch (err) {
            if(err instanceof ResponseError) {
                toast.error(err.message);
            }
        }
        setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getConvertedAmount  = useCallback(debounce(async (fromCurrency, toCurrency, amount, setAmount) => {
        if(topCurrencyAmount && downCurrencyAmount) {
            try {
                const convertedAmount = await getExchangeRate({
                    amount,
                    currencyOne: fromCurrency,
                    currencyTwo: toCurrency,
                });
                setAmount(convertedAmount);
            } catch (err) {
                console.error(err);
            }
        }
    }, 1000), []);

    const handleTopAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setTopCurrencyAmount(value);
        getConvertedAmount(topCurrency, downCurrency, value, setDownCurrencyAmount);
    };

    const handleDownAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setDownCurrencyAmount(value);
        getConvertedAmount(downCurrency, topCurrency, value, setTopCurrencyAmount);
    };

    const handleTopCurrencyChange = (selectedOption: SingleValue<OptionType>) => {
        setTopCurrency(selectedOption!.value);
        getConvertedAmount(selectedOption!.value, downCurrency, topCurrencyAmount, setDownCurrencyAmount);
    };

    const handleDownCurrencyChange = (selectedOption: SingleValue<OptionType>) => {
        setDownCurrency(selectedOption!.value);
        getConvertedAmount(topCurrency, selectedOption!.value, topCurrencyAmount, setDownCurrencyAmount);
    };

    useEffect(() => {
        getConvertedAmount(topCurrency, downCurrency, topCurrencyAmount, setDownCurrencyAmount);
    }, []);

    useEffect(() => {
        if (user?.id) {
            getAccountsData();
        }
    }, [user]);

    return (
        <Container>
            <SidebarMenu user={user} isUserLoading={isUserLoading} />
            <Section title={"Exchange"} width={420}>
                <Card accounts={accounts} />
                <ExchangeForm>
                    <SwitchButton type={"button"} onClick={handleSwitchClick}>
                        <HiOutlineSwitchVertical/>
                    </SwitchButton>
                    <ExchangeCurrency>
                        <SelectInput
                            defaultValue={topCurrencyOptions.find(o => o.value === topCurrency)}
                            options={topCurrencyOptions}
                            components={{ Option: SelectOptionImage }}
                            onChange={(e) => {
                                const tempOptions = updateIsDisabled(downCurrencyOptions, e?.value);
                                setDownCurrencyOptions(tempOptions);
                                handleTopCurrencyChange(e);
                            }}
                            value={topCurrencyOptions.find(o => o.value === topCurrency)}
                        />
                        <ExchangeInput
                            placeholder={"123.45"}
                            type={"number"}
                            step={"any"}
                            value={topCurrencyAmount || ""}
                            onChange={handleTopAmountChange}
                        />
                    </ExchangeCurrency>
                    <ExchangeCurrency>
                        <SelectInput
                            defaultValue={downCurrencyOptions.find(o => o.value === downCurrency)}
                            options={downCurrencyOptions}
                            components={{ Option: SelectOptionImage }}
                            onChange={(e) => {
                                const tempOptions = updateIsDisabled(topCurrencyOptions, e?.value);
                                setTopCurrencyOptions(tempOptions);
                                handleDownCurrencyChange(e)
                            }}
                            value={downCurrencyOptions.find(o => o.value === downCurrency)}
                        />
                        <ExchangeInput
                            placeholder={"123.45"}
                            type={"number"}
                            step={"any"}
                            onChange={handleDownAmountChange}
                            value={downCurrencyAmount || ""}
                        />
                    </ExchangeCurrency>
                </ExchangeForm>
                <Button type={"button"} isLoading={isLoading} onClick={async () => {
                    await exchange();
                    getAccountsData();
                }}>
                    Exchange
                </Button>
            </Section>
            <Section title={"History"} width={600}>
                <ExchangeList
                    paddingTop={0}
                    paddingBottom={0}
                    height={"100%"}
                    hasPagination={true}
                    size={10}
                    user={user}
                    accounts={accounts}
                />
            </Section>
        </Container>
    );
}

export default Exchange;