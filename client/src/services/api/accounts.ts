import {AccountData} from "../../types";
import {handleAxiosError} from "../../utils";
import axios from "axios";
import {API_URL} from "../../config";

export const getUserAccounts = async (): Promise<Array<AccountData>> => {
    try {
        const accounts = await axios({
            method: 'GET',
            url: API_URL + "/accounts",
            withCredentials: true
        });
        return accounts.data as AccountData[];
    } catch (error) {
        return handleAxiosError(error);
    }
}