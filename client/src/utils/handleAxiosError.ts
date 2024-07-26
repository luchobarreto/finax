import axios from 'axios';
import {ResponseError, SignUpErrorResponse} from '../types';

export const handleAxiosError = (error: unknown): never => {
    if(axios.isAxiosError(error) && error.response) {
        if(error.response.data.message) {
            throw new ResponseError(error.response.status, error.response.data.message);
        } else {
            const data = error.response.data as SignUpErrorResponse;
            const message: string = Object.values(data)[0];
            throw new ResponseError(error.response.status, message);
        }
    } else {
        throw new Error("Unexpected Error");
    }
};