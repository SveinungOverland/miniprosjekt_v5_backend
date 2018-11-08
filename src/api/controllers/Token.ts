import { Request, Response } from 'express'
import { signToken, checkPassword } from '../crypto'
import { respondWithOk, respondWithError } from '../response.funcs'
import { UserModel } from '../models'
import { StatusCodes } from '../response.interfaces';


export default class Token {
    static get = (req: Request, res: Response) => respondWithOk(res, signToken(req.body.verified.username))()
    static post = (req: Request, res: Response) => {
        const { username, password } = req.body
        console.log("Looking for user", username, password)
        UserModel.findOne({ username: username })
        .then(dbUser => { if(dbUser) {
            console.log("Found user checking password", "dbUser.get('password') "+dbUser.get("password"))
            checkPassword(password, dbUser.get("password"))
            .then(match => {
                if (match) respondWithOk(res, signToken(username))()
                else respondWithError(res)(StatusCodes.UNAUTHORIZED, "Wrong username or password")()
            })
        } else {
            respondWithError(res)(StatusCodes.UNAUTHORIZED, "Wrong username or password")()
        }})
        .catch(respondWithError(res)(StatusCodes.SERVER_ERROR, "Internal server error"))
    }
}