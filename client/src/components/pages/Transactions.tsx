import React, {useEffect, useState} from "react";
import Container from "../layout/Container";
import SidebarMenu from "../layout/SidebarMenu";
import {currencyMultiOptions, currencyOptions, DefaultPageProps} from "../../types/app";
import Section from "../common/Section";
import Card from "../common/Card";
import {getUserAccounts, transfer} from "../../services/api";
import {AccountData, ResponseError, TransactionType, TransferRequest} from "../../types";
import {toast} from "react-toastify";
import styled from "styled-components";
import Input from "../common/Input";
import SelectInput from "../common/SelectInput";
import SelectOptionImage from "../common/SelectOptionImage";
import {Controller, useForm} from "react-hook-form";
import Button from "../common/Button";
import { IoWarningOutline } from "react-icons/io5";
import InputError from "../common/InputError";
import TransactionHistory from "../layout/TransactionHistory";

const TransactionForm = styled.form`
    padding: 1.5rem 0 1rem 0;
    
    & > h5 {
        font-size: 1rem;
        font-weight: 500;
    } 
`;

const TransferWarning = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    padding: 0.6rem 1rem;
    border: dashed 2px #B8683C;
    border-radius: 10px;
    
    & > p {
        color: #B8683C;
        font-size: 12px;
        width: calc(420px - 32px);
        margin: auto;
        text-align: center;
    }
    
    & > svg {
        font-size: 2rem;
        margin-right: 0.5rem;
        width: 32px;
        height: 32px;
        & > path {
            color: #B8683C;
        }
    }
`

const Transactions: React.FC<DefaultPageProps> = ({ user, isUserLoading }) => {

    const {
        control,
        register,
        handleSubmit,
        formState: {errors},
        reset,
        getValues,
        setValue,
    } = useForm<TransferRequest>();

    const [accounts, setAccounts] = useState<Array<AccountData>>([]);
    const [isTransferLoading, setIsTransferLoading] = useState(false);

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

    const onSubmit = async (req: TransferRequest) => {
        setIsTransferLoading(true);
        try {
            await transfer(req);
            await getAccountsData()
            toast.success("Transfer done successfully!");
            reset();
        } catch (e) {
            if(e instanceof ResponseError) {
                toast.error(e.message);
            }
        }
        setIsTransferLoading(false);
    }

    useEffect(() => {
        if (user?.id) {
            getAccountsData();
        }
    }, [user]);

    return (
        <Container>
            <SidebarMenu user={user} isUserLoading={isUserLoading} />
            <Section title={"Transactions"} width={420}>
                <Card accounts={accounts}/>
                <TransactionForm onSubmit={handleSubmit(onSubmit)}>
                    <h5>Transaction</h5>
                    <Input type={"hidden"} value={accounts.find(a => getValues("currency") === a.currency)?.accountNumber} {...register("fromAccountNumber")}/>
                    <Input label={"Account Number:"} placeholder={"1234567890123456"} {...register("toAccountNumber", { required: true })} />
                    {errors.toAccountNumber && <InputError>Account Number is required</InputError>}
                    <Controller
                        render={({ field: { onChange, onBlur, value } }) => (
                            <SelectInput
                                label={"Currency:"}
                                options={currencyOptions}
                                components={{ Option: SelectOptionImage }}
                                onChange={(e) => {
                                    onChange(e!.value);
                                    setValue("fromAccountNumber", accounts.find(a => getValues("currency") === a.currency)!.accountNumber)
                                }}
                                onBlur={onBlur}
                                value={currencyOptions.find(option => option.value === value)}
                            />
                        )}
                        name={"currency"}
                        control={control}
                    />
                    <Input label={"Amount:"} type={"number"} placeholder={"123456.78"} step={"any"} {...register("amount", { required: true })} />
                    {errors.amount && <InputError>Amount is required</InputError>}
                    <Input label={"Reason:"} placeholder={"Pizza Party 🍕"} {...register("reason")} />
                    <Button isLoading={isTransferLoading}>
                        Transfer
                    </Button>
                </TransactionForm>
                <TransferWarning>
                    <IoWarningOutline/>
                    <p>Double-check all details before submitting. Incorrect information may cause delays or loss of funds.</p>
                </TransferWarning>
            </Section>
            <Section title={"History"} width={"fit-content"}>
                {user && <TransactionHistory user={user} accounts={accounts}/>}
            </Section>
        </Container>
    );
}

export default Transactions;