import { Response } from "express";


interface ResponseData {
    success: boolean;
    message: string;
    data?: unknown;
    errors?: unknown;
}


export const sendResponse = (
    res: Response,
    statusCode: number,
    response: ResponseData
) => {

    return res.status(statusCode).json(response);

};