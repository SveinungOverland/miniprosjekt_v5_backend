import { Request, Response } from 'express'

import { Document } from 'mongoose'

import { NewsModel/*, CategoryModel*/ } from '../models'

import { StatusCodes } from '../response.interfaces'

import { respondWithError, respondWithData/*, respondWithOk*/, respondWithDataAndEmit } from '../response.funcs'

import { PublicNews } from '../models.public'

import { signToken } from '../crypto'



export default class News {
    // CRUD OPERATIONS FOR NEWS TO BE USED IN ROUTES
    static post(req: Request, res: Response) {
        const { header, content, peek, image, category } = req.body
        const { username } = req.body.verified
        let temp = {
            poster: username,
            header,
            content,
            peek,
            image,
            category
        }
        console.log(temp)
        NewsModel.create(temp)
        .then(respondWithDataAndEmit<Document>(res)(PublicNews.responseFromNewsDoc, signToken(username)))
        .catch(respondWithError(res)(StatusCodes.SERVER_ERROR, "Server failed at creating post, try again later."))
    }

    static get(_: Request, res: Response) {
        NewsModel.find()
            .limit(20)
            .then(doc => {
                if(doc) respondWithData<Document[]>(res)(PublicNews.responseFromNewsDocArray)(doc)
                else respondWithError(res)(StatusCodes.NOT_FOUND, "No posts")()
            })
    }

    static getFromUsername(req: Request, res: Response) {
        const { username } = req.params
        NewsModel.find({ poster: username })
            .then(doc => {
                if(doc) respondWithData<Document[]>(res)(PublicNews.responseFromNewsDocArray)(doc)
                else respondWithError(res)(StatusCodes.NOT_FOUND, "User has not posted any news")()
            })
    }

    static getFromUsernameTimestamp(req: Request, res: Response) {
        const { username, timestamp } = req.params
        NewsModel.find({ poster: username, timestamp: timestamp })
            .then(doc => {
                if(doc) respondWithData<Document[]>(res)(PublicNews.responseFromNewsDocArray)(doc)
                else respondWithError(res)(StatusCodes.NOT_FOUND, "Post was not found")()
            })
    }
}