import { Request, Response } from 'express'
//import { Document } from 'mongoose'

import { CommentModel, NewsModel } from '../models'

import { StatusCodes } from '../response.interfaces'

import { signToken } from '../crypto'

import { respondWithError, respondWithOk } from '../response.funcs'

//import { PublicComment } from '../models.public'



export default class Comment {
    // CRUD OPERATIONS FOR USER TO BE USED IN ROUTES
    static postToArticle(req: Request, res: Response) {
        const { newsid } = req.headers
        const { post } = req.body
        const { username } = req.body.verified
        
        let newComment = new CommentModel({poster: username, post: post})
        NewsModel.findOneAndUpdate({ _id: newsid }, { $push: { comments: { newComment } } })
            .then(news => {
                if(news) {
                    respondWithOk(res, signToken(username))()
                } else respondWithError(res)(StatusCodes.BAD_REQUEST, "Cannot post comment to non-existing news article")()
            })
            .catch(respondWithError(res)(StatusCodes.SERVER_ERROR, "Server could not properly serve the request"))
    }
}