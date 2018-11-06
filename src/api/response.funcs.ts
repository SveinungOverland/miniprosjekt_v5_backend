import { Response } from 'express'
//import { Document } from 'mongoose'
import { StatusCodes, ErrorResponse, DataResponse, simpleApiResponse } from './response.interfaces'


export const respondWithError = (res: Response) => 
    (status: StatusCodes, msg: string) => 
        () => { res.status(status); res.json(ErrorResponse.create(status, msg)) }

        
// Curry pipeline: begins with response object => middleware to supply data => finally supplied doc from whatever function calls respondWithData
export const respondWithData = <T>(res: Response) => 
    (consumer: (doc: T) => DataResponse<any>, token?: string) => 
            (doc: T) => {
                let data = consumer(doc)
                if (token) data.addToken(token)
                res.json(data)
            }


export const respondWithOk = (res: Response, token?: string, msg: string = "success") => () => { 
    res.status(200); res.json(simpleApiResponse(StatusCodes.OK, msg, token)) 
}