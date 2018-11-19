import { hash, compare } from 'bcryptjs'
import { Request, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'

import { respondWithError } from './response.funcs'
import { StatusCodes } from './response.interfaces';
import { UserRoles, UserModel } from './models';


const masterKey: string = process.env.MASTER_KEY || process.exit(255)


export type Payload = {
    username: string
}


export const hashPassword = async (password: string) => hash(password, 10)


export const checkPassword = async (plainTextPwd: string, hashFromDB: string) => compare(plainTextPwd, hashFromDB)


export const signToken = (payload: Payload | string): string => {
    if (typeof payload === "string") payload = { username: payload } as Payload
    return sign(payload, masterKey, { expiresIn: 60*60 })
}


export const verifyToken = (token: string): Promise<Payload> => 
    new Promise((resolve, reject) =>
        verify(token, masterKey, (err, decoded) => {
            if (err) reject(err)
            else resolve(decoded as Payload)
        }
    ))



export const requireLogin = (next: (resquest: Request, response: Response) => void) => 
    (req: Request, res: Response) => {
        let token: string | string[] | undefined = req.headers["x-access-token"]
        if(typeof token === "string") verifyToken(token)
            .then(payload => { 
                req.body = { ...req.body, verified: { username: payload.username } }
                return next(req, res)
            })
            .catch((err) => { console.log(err); return respondWithError(res)(StatusCodes.UNAUTHORIZED, "Please log in")() })
        else return respondWithError(res)(StatusCodes.BAD_REQUEST, "Bad request. Header was of incorrect type")()
    }


export const matchParams = (against: (params: any) => string, also: UserRoles[] = []) => 
    (next: (request: Request, response: Response) => void) => 
        (req: Request, res: Response) => {
            let verifiedUsername: string = req.body.verified.username || ""
            let role = ""
            if (also.length > 0) UserModel.findOne({ username: verifiedUsername }).exec((_, res) => role = res ? res.get("role") : "")
            if (verifiedUsername === against(req.params) || role in also) return next(req, res)
            else return respondWithError(res)(StatusCodes.CONFLICT, "There is a conflict between the request access and the action permission")()
        }


export const matchBody = (against: (data: any) => string, also: UserRoles[] = []) =>
    (next: (request: Request, response: Response) => void) => 
        (req: Request, res: Response) => {
            let verifiedUsername: string = req.body.verified.username || ""
            let role = ""
            if (also.length > 0) UserModel.findOne({ username: verifiedUsername }).exec((_, res) => role = res ? res.get("role") : "")
            if (verifiedUsername === against(req.body) || role in also) return next(req, res)
            else return respondWithError(res)(StatusCodes.CONFLICT, "There is a conflict between the request access and the action permission")()
        }