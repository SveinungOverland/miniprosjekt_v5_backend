import { Request, Response } from 'express'
import { Document } from 'mongoose'

import { UserModel } from '../models'

import { StatusCodes } from '../response.interfaces'

import { respondWithError, respondWithData, respondWithOk } from '../response.funcs'

import { PublicUser } from '../models.public'

import { hashPassword, signToken } from '../crypto'


export default class User {
    // CRUD OPERATIONS FOR USER TO BE USED IN ROUTES
    static post(req: Request, res: Response) {
        const { username, password } = req.body
                                // true reverserer svaret fra userExists så den vil resolve hvis brukernavnet ikke er i bruk
        User.userExists(username, true)
        .then(() => {
            hashPassword(password)
            .then(hash => {
                UserModel.create({
                    username: username,
                    password: hash
                })
                .then(respondWithData<Document>(res)(PublicUser.responseFromUserDoc, signToken(username))) // ved å gi req gjennom blir det automatisk generert en ny token
                .catch(respondWithError(res)(StatusCodes.SERVER_ERROR, "Server failed at creating user, try again later."))
            })
            .catch(respondWithError(res)(StatusCodes.SERVER_ERROR, "Server could not securely store password, try again later."))
        })
        .catch(respondWithError(res)(StatusCodes.CONFLICT, "Username already taken"))
    }

    static get(req: Request, res: Response) {
        const { username } = req.body
        UserModel.findOne({ username: username }, (err, userDoc) => {
            if (err) respondWithError(res)(StatusCodes.SERVER_ERROR, "Could not serve request, try again later.")()

            if (userDoc) respondWithData<Document>(res)(PublicUser.responseFromUserDoc)(userDoc)
            else respondWithError(res)(StatusCodes.NOT_FOUND, "No user with that username")()
        })
    }

    static delete(req: Request, res: Response) {
        const { username } = req.body
        UserModel.deleteOne({ username: username }, (err) => {
            if (err) respondWithError(res)(StatusCodes.SERVER_ERROR, "Server failed at deleting user, try again later.")()
            else respondWithOk(res)()
        })
    }


    // HELPER FUNCTIONS NOT TO BE EXPOSED BY REST
    static userExists = (username: string, reverse: boolean = false): Promise<void> => new Promise((resolve, reject) => {
        UserModel.countDocuments({ username: username.trim() })
                                    // count > 0 !== reverse tilsvarer count > 0 XOR reverse for boolske verdier
            .then((count: number) => { count > 0 !== reverse ? resolve() : reject() })
            .catch(reject)
    })
}
