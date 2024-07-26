import {UserData} from "../../types";
import {handleAxiosError} from "../../utils";
import axios from "axios";
import {API_URL} from "../../config";

export const getUserSessionData = async (): Promise<UserData> => {
    try {
        const user = await axios({
            method: "GET",
            url: API_URL + "/users",
            withCredentials: true
        });
        return user.data as UserData;
    } catch (error) {
        return handleAxiosError(error);
    }
}

export const uploadProfilePicture = async ({ file }: { file: File }): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        await axios({
            method: "POST",
            url: API_URL + "/users/profile-picture",
            data: formData,
            withCredentials: true
        });
        return "Image uploaded successfully";
    } catch (error) {
        return handleAxiosError(error);
    }
}

export const updateUserData = async ({ fullName }: { fullName: string }): Promise<string> => {
    try {
        await axios({
            method: "PATCH",
            url: API_URL + "/users",
            data: {
                fullName
            },
            withCredentials: true
        });
        return "User updated successfully";
    } catch (error) {
        return handleAxiosError(error);
    }
}