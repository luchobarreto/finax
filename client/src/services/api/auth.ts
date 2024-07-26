import axios from "axios";
import {API_URL} from "../../config";
import {SignInData, SignUpData} from "../../types";
import {handleAxiosError} from "../../utils";

export const signUpUser = async ({ fullName, email, username, password }: SignUpData): Promise<string> => {
    try {
        const response = await axios({
            method: "POST",
            url: API_URL + "/auth/signup",
            data: {
                fullName, email, username, password
            },
            withCredentials: true
        });
        return response.data.message;
    } catch (error) {
        return handleAxiosError(error as unknown);
    }
}

export const signInUser = async ({ username, password }: SignInData): Promise<string> => {
    try {
        await axios({
            method: "POST",
            url: API_URL + "/auth/signin",
            data: { username, password },
            withCredentials: true
        });
        return "Sign in successful! Welcome back!";
    } catch (error) {
        return handleAxiosError(error as unknown);
    }
}

export const signOutUser = async () => {
    await axios({
        method: "POST",
        url: API_URL + "/auth/signout",
        withCredentials: true
    });
}