import {UserData} from "./users";
import {Currency} from "./enums";
import {AccountData} from "./accounts";

export interface DefaultPageProps {
    user: UserData | null,
    isUserLoading: boolean,
}

export interface OptionType {
    label: string;
    value: any;
    isDisabled?: boolean;
}

export interface DefaultListProps {
    hasPagination: boolean,
    size: number,
    title?: string,
    seeAllButton?: boolean,
    user: UserData | null,
    height?: number | string,
    paddingTop?: number | string,
    paddingBottom?: number | string,
    overflowY?: "-moz-hidden-unscrollable" | "auto" | "clip" | "hidden" | "scroll" | "visible",
    accounts?: AccountData[]
}

export const currencyColors: Record<Currency, string> = {
    USD: "#44AF69",
    EUR: "#18206F",
    CAD: "#F71735",
    JPY: "#B980FF",
    AUD: "#FCAB10"
};

export const currencyOptions: OptionType[] = [
    {label: "USD", value: Currency.USD},
    {label: "EUR", value: Currency.EUR},
    {label: "CAD", value: Currency.CAD},
    {label: "AUD", value: Currency.AUD},
    {label: "JPY", value: Currency.JPY},
]

export const currencyMultiOptions: OptionType[] = [
    {label: "Any", value: [Currency.USD, Currency.EUR, Currency.CAD, Currency.AUD, Currency.JPY]},
    {label: "USD", value: [Currency.USD]},
    {label: "EUR", value: [Currency.EUR]},
    {label: "CAD", value: [Currency.CAD]},
    {label: "AUD", value: [Currency.AUD]},
    {label: "JPY", value: [Currency.JPY]},
]